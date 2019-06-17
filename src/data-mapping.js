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
 * TODO: Current implementation does not preserve the relative distance when
 * scaling. To keep this information yet find a proper presentation one has to
 * find the large distance at either longitude or latitude values, then build a
 * corresponding linear scale function yet keeping sure the limits are in
 * bound.
 **/
const coordScaling = (coords, {min, max}) => {
  const mappedCoords = coords.map(({lon, lat}) => {
    return {lon: 180 + lon, lat: (lat - 90) * -2};
  });
  const longitudes = mappedCoords.reduce((list, {lon}) => list.concat(lon), []);
  const latitudes = mappedCoords.reduce((list, {lat}) => list.concat(lat), []);

  const scaleLon = d3
    .scaleLinear()
    .domain([Math.min(...longitudes), Math.max(...longitudes)])
    .range([min + max * 0.1, max - max * 0.1]);
  const scaleLat = d3
    .scaleLinear()
    .domain([Math.min(...latitudes), Math.max(...latitudes)])
    .range([min + max * 0.1, max - max * 0.1]);

  return mappedCoords.map(({lon, lat}) => {
    return {x: scaleLon(lon), y: scaleLat(lat)};
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
