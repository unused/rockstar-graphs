import {BEFORE, AFTER} from './config.js';

/**
 * Enriched Graph...
 **/
class EnrichedGraph {
  initialize(graph, tweets) {
    const nodes = [];
    const edges = [];

    // Init nodes
    for (let i = 0; i < graph.length; i++) {
      nodes[i] = [];
    }

    // Init edges
    for (let i = 0; i < graph.length - 1; i++) {
      edges[i] = [];
    }

    graph.forEach(function(item, i, grapharray) {
      tweets.forEach(function(tweet, j, eventarray) {
        const {ts} = tweet;

        // Event is part of the concert
        if (item.timestamp - BEFORE <= ts && item.timestamp + AFTER > ts) {
          nodes[i].push({tweet});
        }
        //Event is between two concerts
        if (item.timestamp + AFTER <= ts && grapharray[i + 1].timestamp > ts) {
          edges[i].push({tweet});
        }
      });
    });

    this._enrichedNodes = nodes;
    this._enrichedEdges = edges;
  }

  get enrichedNodes() {
    return this._enrichedNodes;
  }

  get enrichedEdges() {
    return this._enrichedEdges;
  }
}

export default EnrichedGraph;
