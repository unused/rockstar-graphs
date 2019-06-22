import * as d3 from 'd3';
import {coordScaling} from './data-mapping.js';
import drawGraph from './graph.js';
import extendNodes from './extend-nodes.js';
import extendEdges from './extend-edges.js';
import drawHistogram from './histogram.js';
import EnrichedGraph from './enriched-graph';
import dataFetch from './data-fetch.js';
import RockstarGraph from './rockstar-graph.js';

import './styles.css';

let graph = new RockstarGraph();
let enrichedGraph = new EnrichedGraph();

const printEventDebug = (events, data) => {
  const formatTs = ts => new Date(ts * 1000).toLocaleDateString();
  const minNodes = d3.min(events, d => d.timestamp);
  const maxNodes = d3.max(events, d => d.timestamp);
  const minData = d3.min(data);
  const maxData = d3.max(data);

  console.debug(
    '[Event Limits] Nodes for Concert data range from',
    formatTs(minNodes),
    'to',
    formatTs(maxNodes),
    'and for Twitter data from',
    formatTs(minData),
    'to',
    formatTs(maxData),
  );
};

/**
 * SVG Graph
 *
 * Our viewbox model is in min/max range of 0 to 1000. All data is mapped to
 * this limits in order to ensure a scalable graph.
 **/
const vis = d3.select('#graph').append('svg');
vis.attr('viewBox', '0 0 1000 1000');

/**
 * Data Histogram
 *
 * Our viewbox model is in min/max range of 0 to 100. All data is mapped to
 * this limits in order to ensure a scalable graph.
 **/
const histogram = d3.select('#histogram').append('svg');
histogram.attr('viewBox', '0 0 1000 100');

const switchArtist = artist => {
  dataFetch(artist, data => {
    const events = graph.tourData[artist];
    printEventDebug(events, data);
    enrichedGraph.initialize(events, data);

    const coords = graph.tourData[artist].map(event => event.coords);
    const nodes = coordScaling(coords, {min: 0, max: 1000});

    drawGraph(vis, nodes);
    extendNodes(vis, nodes, enrichedGraph.enrichedNodes);
    extendEdges(vis, nodes, enrichedGraph.enrichedEdges);

    const max = data.length / 100;
    drawHistogram(histogram, data.sort(), ({start, range}) => {
      vis
        .selectAll('circle.eventnodes, circle.eventedges')
        .style('fill-opacity', (_d, i) => {
          return i >= start * max && i <= (start + range) * max ? 0.5 : 0.125;
        });
    });
  });
};

const prepareArtistSelect = artists => {
  const select = document.createElement('select');
  select.addEventListener('change', event => switchArtist(event.target.value));
  artists.forEach(artist => {
    const option = document.createElement('option');
    option.val = artist;
    option.text = artist;
    select.appendChild(option);
  });
  document.getElementById('artist-select').appendChild(select);
};

fetch('tour-dates.json')
  .then(response => response.json())
  .then(json => {
    graph.tourData = json;

    const artists = Object.keys(json);
    if (artists.length === 0) {
      console.error('Failed to load tour data');
      return;
    }

    prepareArtistSelect(artists);
    switchArtist(artists[0]);
  });
