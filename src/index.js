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
  data = data.sort();

  const height = 90;
  const width = 300;
  const numberBins = 1000;
  
  const x = d3.scaleLinear()
      .domain([d3.min(data, function(d) { return d }), d3.max(data, function(d) { return d })])
      .range([0, width]);
  histogram.append("g")
      .attr("transform", "translate(0," + 100 + ")")
      .call(d3.axisBottom(x));
      
    // set the parameters for the histogram
  const parameter = d3.histogram()
      .value(function(d) { return d; })   // I need to give the vector of value
      .domain(x.domain())  // then the domain of the graphic
      .thresholds(x.ticks(numberBins)); // then the numbers of bins

  // And apply this function to data to get the bins
  const bins = parameter(data);

  // Y axis: scale and draw:
  const y = d3.scaleLinear()
      .range([height, 0]);
      y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
  histogram.append("g")
      .call(d3.axisLeft(y));
      
      console.debug("bins: ", bins);

  // append the bar rectangles to the svg element
  histogram.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return  "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0); })
        .attr("height", function(d) { return height - y(d.length); })
        .style("fill", "#69b3a2")
      
};

dataFetch('gloryhammer', data => drawHistogram(data));
