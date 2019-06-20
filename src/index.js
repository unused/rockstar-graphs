import * as d3 from 'd3';
import {coordScaling} from './data-mapping.js';
import graph from './graph.js';
import dataFetch from './data-fetch.js';

import './styles.css';

const vis = d3.select('#graph').append('svg');

/**
 * Our viewbox model is in min/max range of 0 to 1000. All data is mapped to
 * this limits in order to ensure a scalable graph.
 **/
vis.attr('viewBox', '0 0 1000 1000');

const nodes = coordScaling(
  [{lon: 12, lat: 12}, {lon: 4, lat: 2}, {lon: 36, lat: 8}],
  {min: 0, max: 1000},
);

graph(vis, nodes);

const newNodes = coordScaling(
  [
    {lat: 47.07, lon: 15.42}, // Graz
    {lat: 48.21, lon: 16.36}, // Vienna
    {lat: 48.86, lon: 2.43}, // Paris
    {lat: 51.5, lon: -0.11}, // London
  ],
  {min: 0, max: 1000},
);
console.debug('scaled coordinates', newNodes);

setTimeout(() => {
  console.debug('update nodes');
  graph(vis, newNodes);
}, 1500);

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
};

dataFetch('lambofgod', data => drawHistogram(data));
