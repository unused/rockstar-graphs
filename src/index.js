import * as d3 from 'd3';
import {coordScaling} from './data-mapping.js';
import drawGraph from './graph.js';
import extendGraph from './extend-graph.js';
import drawHistogram from './histogram.js';
import EnrichedGraph from './enriched-graph';
import dataFetch from './data-fetch.js';
import RockstarGraph from './rockstar-graph.js';

import './styles.css';

let graph = new RockstarGraph();
let enrichedGraph = new EnrichedGraph();

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
histogram.attr('viewBox', '0 0 500 100');

const switchArtist = artist => {
  dataFetch(artist, data => {
  enrichedGraph.initialize(graph.tourData[artist], data);

  const coords = graph.tourData[artist].map(event => event.coords);
  const nodes = coordScaling(coords, {min: 0, max: 1000});

  drawGraph(vis, nodes);
  extendGraph(vis, nodes, enrichedGraph.enrichedNodes, enrichedGraph.enrichedEdges);
  drawHistogram(histogram, data.sort());
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
