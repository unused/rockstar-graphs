/* global Math */

/**
 * Scale coordinates in a given range limit. A 10th of the range is kept as
 * border to ensure there is some space left clear around the maximum points.
 *
 * Note that longitudes are between -180 to 180 degrees and latitudes between
 * -90 to 90 (approximately), for simplification we double the latitude values.
 *
 *            90
 *            N
 *            .
 *            .
 * -180 W ... 0 ... E 180
 *            .
 *            .
 *            S
 *           -90
 *
 **/
const coordScaling = (coords, {min, max}) => {
  const mappedCoords = coords.map(({lon, lat}) => {
    return {lon: 180 + lon, lat: (lat - 90) * -2};
  });
  const values = mappedCoords.reduce((a, {lon, lat}) => a.concat(lon, lat), []);

  console.debug('mapped coordinates', mappedCoords);
  console.debug('limits', [Math.min(...values), Math.max(...values)]);

  const scaleCoord = d3
    .scaleLinear()
    .domain([Math.min(...values), Math.max(...values)])
    .range([min + max * 0.1, max - max * 0.1]);

  return mappedCoords.map(({lon, lat}) => {
    return {x: scaleCoord(lon), y: scaleCoord(lat)};
  });
};

/**
 * Build links from a set of given nodes, results to an array of size n - 1
 * with the form [{ source: a, target: b }, { source: b, target: c }, ...]
 **/
const linksBuilder = nodes =>
  nodes.reduce((links, node) => {
    if (links.length !== 0) {
      links[links.length - 1].target = node;
    }
    if (links.length !== nodes.length - 1) {
      links.push({source: node});
    }
    return links;
  }, []);

export {coordScaling, linksBuilder};
