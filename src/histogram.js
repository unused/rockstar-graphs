const drawHistogram = (histogram, data) => {
  data = data.sort();

  const height = 90;
  const width = 300;
  const numberBins = 100;
  
  const x = d3.scaleLinear()
      .domain([d3.min(data), d3.max(data)])
      .range([0, width]);
      
  histogram.selectAll("g").remove();
  histogram.append("g")
      .attr("transform", "translate(0," + 100 + ")")
      .call(d3.axisBottom(x));
      
    // set the parameters for the histogram
  const parameter = d3.histogram()
      .domain(x.domain())  // then the domain of the graphic
      .thresholds(x.ticks(numberBins)); // then the numbers of bins

  // And apply this function to data to get the bins
  const bins = parameter(data);

  // Y axis: scale and draw:
  const y = d3.scaleLinear()
      .range([height, 0]);
      y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
  histogram.append("g")
      .call(d3.axisLeft(y));

  // append the bar rectangles to the svg element
  const h = histogram.selectAll("rect").data(bins);
  h.enter()
  .append("rect")
    .merge(h)
    .attr("x", 1)
    .attr("transform", function(d) { return  "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
    .attr("width", function(d) { return x(d.x1) - x(d.x0); })
    .attr("height", function(d) { return height - y(d.length); })
    .style("fill", "#69b3a2");
  h.exit().remove();
};

export default drawHistogram;

