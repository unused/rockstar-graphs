import * as d3 from 'd3';
import {FILL_OPACITY, BEFORE, AFTER} from './config.js';
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
  const minData = d3.min(data, d => d.ts);
  const maxData = d3.max(data, d => d.ts);

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

/**
 * Reduce tweets to match only the timestamp for the given events.
 **/
const reduceTweets = (events, data) => {
  const firstEvent = events[0];
  const lastEvent = events[events.length - 1];
  console.debug('BEFORE', BEFORE);
  // Remove all events that happened before the tour.
  while (firstEvent.timestamp - BEFORE > data[0].ts) {
    data.shift();
  }
  // Remove all events that happened after the tour.
  while (lastEvent.timestamp + AFTER < data[data.length - 1].ts) {
    data.pop();
  }

  return data;
};

const switchArtist = artist => {
  dataFetch(artist, data => {
    const events = graph.tourData[artist].sort((a, b) =>
      a.timestamp < b.timestamp ? -1 : 1,
    );
    // Sort and reduce tweets
    data = data.sort((a, b) => (a.ts < b.ts ? -1 : 1));
    data = reduceTweets(events, data);

    printEventDebug(events, data);
    enrichedGraph.initialize(events, data);

    const coords = graph.tourData[artist];
    const nodes = coordScaling(coords, {min: 0, max: 1000});

    drawGraph(vis, nodes);
    extendNodes(vis, nodes, enrichedGraph.enrichedNodes);
    extendEdges(vis, nodes, enrichedGraph.enrichedEdges);

    const max = data.length / 100;
    drawHistogram(histogram, data.sort(), ({start, range}) => {
      vis
        .selectAll('circle.eventnodes, circle.eventedges')
        .style('fill-opacity', (_d, i) => {
          return i >= start * max && i <= (start + range) * max
            ? FILL_OPACITY
            : 0.125;
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
