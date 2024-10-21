d3.csv("Unemployment_78-95.csv", function(d) {
    d.date = new Date(d.year, +d.month-1); // corrected to Date
    d.number = +d.number;
    return d;
}).then(function(data) {
    var w = 600;
    var h = 300;
    var padding = 60;
    
    //set up the svg and path
    var svg = d3.select("#chart")
                .append("svg")
                .attr("width", w + padding *2) //add padding to make space for axis
                .attr("height", h + padding * 2);

    //set up the scales
    var xScale = d3.scaleTime()
                    .domain([
                        d3.min(dataset, function(d) { return d.date; }),
                        d3.max(dataset, function(d) { return d.date; })
                    ])
                    .range([padding, w - padding]);

    var yScale = d3.scaleLinear()
                    .domain([0, d3.max(dataset, function(d) { return d.number; })
                     ])
                    .range([h - padding, padding]);  
                    
    //set up the line
    var line = d3.line()
                .x(function(d) { return xScale(d.date); })
                .y(function(d) { return yScale(d.number); });

    //set up the area
    var area = d3.area()
            .x(function(d) { return xScale(d.date); })

            //base line for area shape
            .y0(function() { return yScale.range()[0]; })
            .y1(function(d) { return yScale(d.number); });

    //append the line path
    svg.append("path")
        .datum(dataset)
        .attr("class", "line")
        .attr("d", line);

    //append the area path
    svg.append("path")
        .datum(dataset)
        .attr("d", area)
        .attr("fill", "lightblue");

    //X-axis
    var xAxis = d3.axisBottom(xScale);
        svg.append("g")
            .attr("transform", "translate(0, " + (h - padding) + ")")
            .call(xAxis);

    //Y-axis
    var yAxis = d3.axisLeft(yScale);
        svg.append("g")
            .attr("transform", "translate(" + padding + ", 0)")
            .call(yAxis);

    //Annotations: half a millioin unmeployed
    svg.append("line")
        .attr("class", "line halfMiMark")
        //start of line
        .attr("x1", padding)
        .attr("y1", yScale(500000))
        //end of line
        .attr("x2", w)
        .attr("y2", yScale(500000));

    svg.append("text")
        .attr("class", "halfMiLabel")
        .attr("x", padding + 10)
        .attr("y", yScale(500000) - 7)
        .text("Half a million unemployed");

    });

window.onload = init;

    

    

    
