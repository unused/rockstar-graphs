/**
 *
 **/
class EnrichedGraph {
    initialize(graph, data) {
        graph = graph.sort((a, b) => (a.timestamp < b.timestamp) ? -1 : 1);
        data = data.sort();

        const before = 60 * 60 * 4;
        const after = 60 * 60 * 8;
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

        // Remove all events that happened before the tour
        while ((graph[0].timestamp - before) > data[0]) {
            data.shift();
        }

        // Remove all events that happened after the tour
        while ((graph[graph.length - 1].timestamp + after) < data[data.length - 1]) {
            data.pop();
        }

        graph.forEach(function (item, i, grapharray) {
            data.forEach(function (timestamp, j, eventarray) {
                // Event is part of the concert
                if(item.timestamp - before <= timestamp && item.timestamp + after > timestamp) {
                    nodes[i].push({'event': timestamp});
                }
                //Event is between two concerts
                if(item.timestamp + after <= timestamp && grapharray[i + 1].timestamp > timestamp) {
                    edges[i].push({'event': timestamp});
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
