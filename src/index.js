import * as d3 from 'd3';
import {coordScaling} from './data-mapping.js';
import drawGraph from './graph.js';
import drawHistogram from './histogram.js';
import dataFetch from './data-fetch.js';
import RockstarGraph from './rockstar-graph.js';

import './styles.css';

let graph = new RockstarGraph();

const vis = d3.select('#graph').append('svg');

/**
 * Data Histogram
 **/
const histogram = d3.select('#histogram').append('svg');
/**
 * Our viewbox model is in min/max range of 0 to 100. All data is mapped to
 * this limits in order to ensure a scalable graph.
 **/
histogram.attr('viewBox', '0 0 100 100');

/**
 * Our viewbox model is in min/max range of 0 to 1000. All data is mapped to
 * this limits in order to ensure a scalable graph.
 **/
vis.attr('viewBox', '0 0 1000 1000');

const switchArtist = artist => {
  const coords = graph.tourData[artist].map(event => event.coords);
  const nodes = coordScaling(coords, {min: 0, max: 1000});

  drawGraph(vis, nodes);
  dataFetch(artist, data => drawHistogram(histogram, data));
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

