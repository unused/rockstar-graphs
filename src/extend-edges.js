import * as d3 from 'd3';
import {linksBuilder} from './data-mapping.js';

/**
 * Build a graph from given nodes.
 **/
const extendEdges = (vis, nodes, extEdges) => {
  // console.debug(extEdges, linksBuilder(nodes));

  const edges = linksBuilder(nodes);

  vis.selectAll('circle.eventedges').remove();

  edges.forEach(function(item, index, array) {
    let scaleX = d3
      .scaleLinear()
      .domain([
        d3.min(extEdges[index], ({tweet: {ts}}) => ts),
        d3.max(extEdges[index], ({tweet: {ts}}) => ts),
      ])
      .range([item.source.x, item.target.x]);

    extEdges[index].forEach(function({tweet: {ts}}, eventIndex, eventArray) {
      let x = scaleX(ts);
      let y =
        item.source.y +
        ((item.target.y - item.source.y) / (item.target.x - item.source.x)) *
          (x - item.source.x);

      // console.debug('[extEdges]', event, x, y);

      let edge = vis
        .append('g')
        .selectAll('circle.eventedges')
        .data([event])
        .enter()
        .append('circle')
        .attr('class', 'eventedges')
        .attr('r', 3)
        .attr('cx', x)
        .attr('cy', y)
        .style('fill', '#69b3a2')
        .style('fill-opacity', 0.2)
        .attr('stroke', '#69a2b2')
        .style('stroke-width', 0.1);
    });
  });
};

export default extendEdges;
