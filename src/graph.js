import {linksBuilder} from './data-mapping.js';

/**
 * Build a graph from given nodes.
 **/
const graph = (vis, nodes) => {
  const g = vis.selectAll('circle.node').data(nodes);
  g.enter()
    .append('circle')
    .merge(g)
    .attr('class', 'node')
    .attr('cx', ({x}) => x)
    .attr('cy', ({y}) => y)
    .attr('r', '.75rem')
    .attr('fill', 'lightGray');
  g.exit().remove();

  const l = vis.selectAll('line.link').data(linksBuilder(nodes));
  l.enter()
    .append('line')
    .merge(l)
    .attr('class', 'link')
    .attr('x1', ({source}) => source.x)
    .attr('y1', ({source}) => source.y)
    .attr('x2', ({target}) => target.x)
    .attr('y2', ({target}) => target.y)
    .style('stroke', 'gray');
  l.exit().remove();
};

export default graph;
