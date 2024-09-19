    var w = 800; //width of the SVG canvas
    var h = 360; //hieght of the SVG canvas
    var padding = 60; //padding around the canvas for axes
                
    var dataset = [
                    [2, 8, 5],
                    [3, 5, 5],
                    [5, 17, 10],
                    [6, 6, 5],
                    [6, 12, 6],
                    [7, 20, 3],
                    [8, 22, 10],
                    [10, 11, 5],
                    [5, 12, 5],
                    [6, 16, 10]
                    ]; //array of datapoints : [x,y,radius] for circles

    //xScale - scales the x-values of the dataset to fit within the canvas width, considering padding
    var xScale = d3.scaleLinear()
        .domain([d3.min(dataset, function(d) {return d[0];}), //minimum x-value in the dataset
                d3.max(dataset, function(d) {return d[0];})]) //maximum x-value in the dataset
        .range([padding, w - padding - 120]); //maps values between the canvas padding and its width minus padding

    //yScale - scales the y-values of the dataset to fit within the canvas height, considering padding
    var yScale = d3.scaleLinear()
        .domain([d3.min(dataset, function(d) {return d[1];}), //minimum y-value in the dataset
                 d3.max(dataset, function(d) {return d[1];})]) //maximum y-value in the dataset
        .range([h - padding, padding]); //maps values between the height minus padding and padding (inverted in SVG)

    var svg = d3.select("body") //select the container to append the SVG
                .append("svg") //add an SVG element
                .attr("width", w) //set the width of the SVG
                .attr("height", h); //set the height of the SVG

    //xAxis - create the x-axis based on the xScale and specifie 10 ticks (divisions)
    var xAxis = d3.axisBottom()
        .scale(xScale) //use the xScale to scale the axis
        .ticks(10); //suggest 10 tick marks
   
    //yAxis - create the y-axis based on the yScale and specifie 4 ticks (divisions)
    var yAxis = d3.axisLeft()
        .scale(yScale) //use the yScale to scale the axis
        .ticks(4); //suggest 4 tick marks

    //create circles for each data point
    svg.selectAll("circle") //select all existing circle elements (if any)
        .data(dataset) //bind the dataset to the selection
        .enter() //create placeholders for each data point
        .append("circle") //append a circle element for each data point
        .attr("cx", function(d, i) {return xScale(d[0]);}) //set the x-coordinate of the circle based on the x-value (d[0])
        .attr("cy", function(d){return yScale(d[1]);}) //set the y-coordinate of the circle based on the y-value (d[1])
        .attr("r", function(d) {return d[2];}) //set the radius of the circle based on the third value in the dataset (d[2])
        .attr("fill", function(d) {return d[0] === 500 ? "red" : "rgb(49, 145, 0)";}); //set the colour of the circle (red if x-value is 500, otherwise green)
    
    //add text label next to each data point
    svg.selectAll("text") //select all existing text elements (if any)
        .data(dataset) //bind the dataset to the selection
        .enter() //create placeholders for each data point
        .append("text") //append a text element for each data point
        .text(function(d) {return d[0] + "," + d[1];}) //set the text content to the x and y values
        .attr("x", function(d) {return xScale(d[0]) + 10;}) //position the text slightly to the right of the circle (x+10)
        .attr("y", function(d) {return yScale(d[1]) - 1;}) //position the text slightly above the circle (y-1)
        .attr("fill", "green"); //set the text colour to green

    //append the x-axis to the SVG at the bottom (height - padding)
    svg.append("g") //add a group element (g) to hold the x-axis
        .attr("class", " x axis") //assign a class to the axis for styling purposes
        .attr("transform", "translate(0, " + (h - padding) + ")") //move the x-axis to the bottom of the canvas
        .call(xAxis); //draw the x-axis using the defined xScale

    //append the y-axis to the SVG at the left (at padding position)
    svg.append("g") //add a group element (g) to hold the y-axis
        .attr("class", " y axis") //assign a class to the axis for styling purposes
        .attr("transform", "translate(" + padding + ", 0)") //move the y-axis to the left side of the canvas
        .call(yAxis); //draw the y-axis using the defined yScale

    // Adding x-axis label
    svg.append("text") 
        .attr("text-anchor", "end") 
        .attr("x", w - 150) 
        .attr("y", h - 10) 
        .text("Tree Age (year)"); //the label text
        
    // Adding y-axis label
    svg.append("text") 
        .attr("text-anchor", "end") 
        .attr("transform", "rotate(-90)") //rotate the text by -90 degrees to align with the y-axis
        .attr("y", 0) 
        .attr("x", -50) 
        .attr("dy", ".75em")
        .text("Tree Height (m)"); //the label text



    

	

	



