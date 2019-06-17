import * as d3 from 'd3';

const vis = d3.select('#graph').append('svg');

vis.attr('width', 900).attr('height', 400);
vis.text('The Graph').select('#graph');

const nodes = [{x: 30, y: 50}, {x: 50, y: 80}, {x: 90, y: 120}];

vis
  .selectAll('circle .nodes')
  .data(nodes)
  .enter()
  .append('svg:circle')
  .attr('class', 'nodes')
  .attr('cx', function(d) {
    return d.x;
  })
  .attr('cy', function(d) {
    return d.y;
  })
  .attr('r', '10px')
  .attr('fill', 'gray');

const links = [
  {source: nodes[0], target: nodes[1]},
  {source: nodes[2], target: nodes[1]},
];

vis
  .selectAll('.line')
  .data(links)
  .enter()
  .append('line')
  .attr('x1', function(d) {
    return d.source.x;
  })
  .attr('y1', function(d) {
    return d.source.y;
  })
  .attr('x2', function(d) {
    return d.target.x;
  })
  .attr('y2', function(d) {
    return d.target.y;
  })
  .style('stroke', 'red');
