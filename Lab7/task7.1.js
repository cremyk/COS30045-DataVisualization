d3.csv("Unemployment_78-95.csv", function(d) {
    d.date = new Date(d.year, +d.month-1); // corrected to Date
    d.number = +d.number;
    return d;
}).then(function(data) {
    var w = 600;
    var h = 300;
    var padding = 60;

    var xScale = d3.scaleTime()
        .domain([d3.min(data, function(d) { return d.date; }),
                 d3.max(data, function(d) { return d.date; })
        ])
        .range([padding, w - padding]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.number; })])
        .range([h - padding, padding]);

    var svg = d3.select("#chart")  // assuming an element with id="chart" in your HTML
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    var line = d3.line()
        .x(function(d) { return xScale(d.date); })
        .y(function(d) { return yScale(d.number); });

    svg.append("path")
        .datum(data)  // corrected from dataset to data
        .attr("class", "line")
        .attr("d", line);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("transform", "translate(0," + (h - padding ) + ")")
        .call(xAxis);

    svg.append("g")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

    var area = d3.area()
        .x(function(d) { return xScale(d.date); })
        .y0(function() { return yScale.range()[0]; })  // base line for area shape
        .y1(function(d) { return yScale(d.number); });

    svg.append("path")
        .datum(data)
        .attr("fill", "lightblue")
        .attr("d", area);

    svg.append("line")
        .attr("class", "line halfMilMark")
    //start of line
        .attr("x1", padding)
        .attr("y1", yScale(500000))
    //end of line
        .attr("x2", w)
        .attr("y2", yScale(500000));

    svg.append("text")
        .attr("class", "halfMilLabel")
        .attr("x", padding + 10)
        .attr("y", yScale(500000) - 7)
        .attr("fill", "red")
        .style("font-size", "10px")
        .text("Half a million unemployed");
});
