import handleSliderControl from './slide-controls';

/**
 * Draws a histogram
 **/
const drawHistogram = (histogram, data) => {
  const width = 950; // viewbox width is 500, keep some space for y-axis text
  const height = 75; // viewbox height is 100, keep some space for x-axis text
  const numberBins = 100;
  const margin = (1000 - width) / 2;

  const x = d3
    .scaleLinear()
    .domain([d3.min(data), d3.max(data)])
    .range([0, width]);
  const xAxis = d3
    .axisBottom(x)
    .ticks(5)
    .tickFormat(d => new Date(d * 1000).toLocaleDateString());

  // Clear graph from previous labels (x/y-axis) first.
  histogram.selectAll('g').remove();

  // Print the x-axis, reduce the number of dates to output and format the
  // timestamps to locale date strings.
  histogram
    .append('g')
    .attr('class', 'text')
    .attr('transform', `translate(${margin}, ${height + 5})`)
    .call(xAxis);

  // Set the basic parameters for the histogram.
  const parameter = d3
    .histogram()
    .domain(x.domain())
    .thresholds(x.ticks(numberBins));
  const bins = parameter(data);

  // Scale down and print the y-axis.
  const y = d3
    .scaleLinear()
    .range([height, 0])
    .domain([0, d3.max(bins, d => d.length)]);
  histogram
    .append('g')
    .attr('class', 'text')
    .attr('transform', `translate(${margin}, 5)`)
    .call(d3.axisLeft(y).ticks(3));

  // Append the bar rectangles to the histogram
  const h = histogram.selectAll('rect.bars').data(bins);
  h.enter()
    .append('rect')
    .merge(h)
    .attr('y', 5) // move down not to overlap axis
    .attr('x', margin + 1) // move to right not to overlap axis
    .attr('class', 'bars')
    .attr('transform', d => `translate(${x(d.x0)},${y(d.length)})`)
    .attr('width', d => x(d.x1) - x(d.x0))
    .attr('height', d => height - y(d.length));
  h.exit().remove();

  handleSliderControl(histogram, h, {margin, width}, ({start, range}) =>
    console.debug('slider update', {start, range}),
  );
};

export default drawHistogram;
