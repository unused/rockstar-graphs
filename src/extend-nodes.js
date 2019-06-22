import * as d3 from 'd3';
import {mood_scale} from './config';

/**
 * Build a graph from given nodes.
 **/
const extendNodes = (vis, nodes, extNodes) => {
  // console.debug(extNodes);
  // console.debug(nodes);

  vis.selectAll('circle.eventnodes').remove();

  nodes.forEach(function(item, index, array) {
    // Initialize the circle: all located at the center of the svg area
    let node = vis
      .append('g')
      .selectAll('circle.eventnodes')
      .data(extNodes[index])
      .enter()
      .append('circle')
      .attr('class', 'eventnodes')
      .attr('r', 3)
      .attr('cx', item.x)
      .attr('cy', item.y)
      .style('fill', ({tweet: {sentiment}}) => {
        console.debug(mood_scale(sentiment));
        return mood_scale(sentiment);
      })
      .style('fill-opacity', 0.75);

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
      .force('charge', d3.forceManyBody().strength(0.5)) // Nodes are attracted one each other of value is > 0
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
      node
        .attr('cx', function(d) {
          return d.x;
        })
        .attr('cy', function(d) {
          return d.y;
        });
    });
  });
};

export default extendNodes;
