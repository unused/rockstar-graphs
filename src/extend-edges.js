import * as d3 from 'd3';
import {FILL_OPACITY, mood_scale} from './config';
import {linksBuilder} from './data-mapping';

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

    extEdges[index].forEach(function({tweet}, eventIndex, eventArray) {
      const {ts} = tweet;
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
        .style('fill', 'GoldenRod') // mood_scale(ts))
        .style('fill-opacity', 0.125);
    });
  });
};

export default extendEdges;
