import * as d3 from 'd3';
import {linksBuilder} from './data-mapping.js';

/**
 * Build a graph from given nodes.
 **/
const extendGraph = (vis, nodes, extNodes, extEdges) => {
  console.debug('nodes', nodes);
  console.debug('extNodes', extNodes);
  console.debug('extEdges', extEdges);
  console.debug('linksBuilder(nodes)', linksBuilder(nodes));

  // Clear all event data
  vis.selectAll('circle.event').remove();

  nodes.forEach(function(item, index, array) {
    // Initialize the circle: all located at the center of the svg area
    //   vis.selectAll('circle.events').remove();
    let node = vis
      .append('g')
      .selectAll('circle.event')
      .data(extNodes[index])
      .enter()
      .append('circle')
      .attr('class', 'event')
      .attr('r', 3)
      .style('fill-opacity', 0.5);
    // node.exit().remove();

    // Features of the forces applied to the nodes:
    let simulation = d3
      .forceSimulation()
      .force(
        'center',
        d3
          .forceCenter()
          .x(item.x)
          .y(item.y),
      ) // Attraction to the center of the svg area
      .force('charge', d3.forceManyBody().strength(0.75)) // Nodes are attracted one each other of value is > 0
      .force(
        'collide',
        d3
          .forceCollide()
          .strength(1)
          .radius(1)
          .iterations(1),
      ); // Force that avoids circle overlapping

    // Apply these forces to the nodes and update their positions.
    // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    simulation.nodes(extNodes[index]).on('tick', function(d) {
      node.attr('cx', ({x}) => x).attr('cy', ({y}) => y);
    });
  });

  // const g = vis.selectAll('circle.node').data(nodes);
  // g.enter()
  //   .append('circle')
  //   .merge(g)
  //   .attr('class', 'node')
  //   .attr('cx', ({x}) => x)
  //   .attr('cy', ({y}) => y)
  //   .attr('r', '.75rem')
  //   .attr('fill', 'lightGray');
  // g.exit().remove();
  //
  // const l = vis.selectAll('line.link').data(linksBuilder(nodes));
  // l.enter()
  //   .append('line')
  //   .merge(l)
  //   .attr('class', 'link')
  //   .attr('x1', ({source}) => source.x)
  //   .attr('y1', ({source}) => source.y)
  //   .attr('x2', ({target}) => target.x)
  //   .attr('y2', ({target}) => target.y)
  //   .style('stroke', 'gray');
  // l.exit().remove();
};

export default extendGraph;
