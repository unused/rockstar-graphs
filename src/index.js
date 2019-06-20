import * as d3 from 'd3';
import {coordScaling} from './data-mapping.js';
import graph from './graph.js';
import dataFetch from './data-fetch.js';
// import RockstarGraph from './rockstar-graph.js';

import './styles.css';

// let graph = new RockstarGraph();

const vis = d3.select('#graph').append('svg');

/**
 * Our viewbox model is in min/max range of 0 to 1000. All data is mapped to
 * this limits in order to ensure a scalable graph.
 **/
vis.attr('viewBox', '0 0 1000 1000');

fetch('tour-dates.json')
  .then(response => response.json())
  .then(json => {
    // graph.setTourData(json);
    // prepareArtistSelect();

    const coords = json['gloryhammer'].map(event => event.coords);
    const nodes = coordScaling(coords, {min: 0, max: 1000});

    graph(vis, nodes);
  });

/**
 * Data Histogram
 **/
const histogram = d3.select('#histogram').append('svg');
/**
 * Our viewbox model is in min/max range of 0 to 100. All data is mapped to
 * this limits in order to ensure a scalable graph.
 **/
histogram.attr('viewBox', '0 0 100 100');

const drawHistogram = data => {
  /* TODO: draw histogram */
  data = data.sort();

  console.debug(
    'data goes from',
    new Date(data[0] * 1000),
    'to',
    new Date(data[data.length - 1] * 1000),
  );
};

dataFetch('gloryhammer', data => drawHistogram(data));
