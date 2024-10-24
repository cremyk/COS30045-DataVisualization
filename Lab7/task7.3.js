var dataset = [
    { apples: 5, oranges: 10, grapes: 22}, //blue =apples
    { apples: 4, oranges: 12, grapes: 28}, //orange =oranges
    { apples: 2, oranges: 19, grapes: 32}, //green =grapes
    { apples: 7, oranges: 23, grapes: 35},
    { apples: 23, oranges: 17, grapes: 43}
]

//set width, height for the chart
var w = 500;
var h = 400;

//define the color scale
var color = d3.scaleOrdinal(d3.schemeCategory10);

//set up stack method
var stack = d3.stack()
                .keys([ "apples", "oranges", "grapes" ])
                .order(d3.stackOrderDescending);

//data, stacked
var series= stack(dataset);

var xScale = d3.scaleBand()
                .domain(d3.range(dataset.length))
                .range([0, w])
                .paddingInner(0.05);


var yScale = d3.scaleLinear()
                .domain([0, d3.max(dataset, function(d) {
                    return d.apples + d.oranges + d.grapes;
                    })
                ])
                .range([h, 0]);

//series, the array formely known as dataset
[
    [ [ 0, 5], [ 0, 4], [ 0, 2], [ 0, 7], [ 0, 23] ], //apples
    [ [ 5, 15], [ 4, 16], [ 2, 21], [ 7, 30], [ 23, 40] ], //oranges
    [ [ 15, 37], [ 16, 44], [ 21, 53], [ 30, 65], [ 40, 83] ], //apples
]


//create svg
var svg = d3.select("article.content")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

//add group for each row of data
var groups = svg.selectAll("g")
                .data(series)
                .enter()
                .append("g")
                .style("fill", function(d, i) {
                    return color(i);
                });


                //add rect for each data value
var rects = groups.selectAll("rect")
                    .data(function(d) { return d; })
                    .enter()
                    .append("rect")
                    .attr("x", function(d, i) {
                        return xScale(i);
                    })
                    .attr("y", function(d, ) {
                        return yScale(d[1]);
                    })
                    .attr("height", function(d) {
                        return yScale(d[0]) - yScale(d[1]);
                    })
                    .attr("width", xScale.bandwidth());

//add one dot in the legend for each name
var size = 20
svg.selectAll("mydots")
.data(keys)
.enter()
.append("rect")
  .attr("x", 100)
  .attr("y", function(d,i){ return 100 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
  .attr("width", size)
  .attr("height", size)
  .style("fill", function(d){ return color(d)})

// Add one dot in the legend for each name.
SVG.selectAll("mylabels")
.data(keys)
.enter()
.append("text")
  .attr("x", 100 + size*1.2)
  .attr("y", function(d,i){ return 100 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
  .style("fill", function(d){ return color(d)})
  .text(function(d){ return d})
  .attr("text-anchor", "left")
  .style("alignment-baseline", "middle")
