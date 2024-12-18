function init() {
    var w = 500;
    var h = 150;
    var barPadding = 3;
    
    var dataset = [14, 5, 26, 23, 9, 10, 28, 3, 7, 13];
    var maxValue = 25; // Maximum value for random data
    
    //ordinal scale method
    var xScale = d3.scaleBand()
                    .domain(d3.range(dataset.length))
                    .range([0, w])
                    .paddingInner(0.05);
    
    var yScale = d3.scaleLinear()
                    .domain([0, d3.max(dataset)])
                    .range([0, h]);
    
    //create SVG
    var svg1 = d3.select("article.content")
                .append("svg")
                .attr("width", w) 
                .attr("height", h)
                .attr("fill", "rgb(106, 90, 205)");
    
    //draw initial bars
    svg1.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
            return xScale(i);
        })
        .attr("y", function(d) {
            return h - yScale(d);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) {
            return yScale(d);
        })
        .attr("fill", "rgb(106, 90, 205)"); //set initial bar colour
    
    //add button event
    d3.select("#add").on("click", function() {
    var maxValue = 25;
    var newNumber = Math.floor(Math.random() * maxValue);
    dataset.push(newNumber);
    
    xScale.domain(d3.range(dataset.length)); // Update xScale
    
    //bind data to bar variable
    var bars = svg1.selectAll("rect")
        .data(dataset);
    
    //create new bars for any new data
    bars.enter()
        .append("rect") //create the new rectangle
        .attr("x", w)
        .attr("y", function(d) {
            return h - yScale(d);
        })
        .merge(bars) //merge with existing bars
        .transition()
        .duration(500)
        .attr("x", function(d, i) {
            return xScale(i); //update x position
        })
        .attr("y", function(d) {
            return h - yScale(d); //update y position
        })
        .attr("width", xScale.bandwidth()) //set the bar width
        .attr("height", function(d) {
            return yScale(d); //set the bar height
        });
    });
    
    //remove button event
    d3.select("#remove").on("click", function() {
        dataset.pop(); // Remove the first element
        xScale.domain(d3.range(dataset.length)); // Update scale
    
        var bars = svg1.selectAll("rect")
            .data(dataset);
    
        //transition to remove bars
        bars.exit()
            .transition()
            .duration(500)
            .attr("x", w) //move off-screen
            .remove(); //remove from DOM
    
        //update remaining bars
        bars.transition()
            .duration(500)
            .attr("x", function(d, i) {
                return xScale(i);
            })
            .attr("y", function(d) {
                return h - yScale(d);
            })
            .attr("width", xScale.bandwidth()) 
            .attr("height", function(d) {
                return yScale(d);
            });
    
        
    
    });
    
    }
    // Call the init function when the window loads
    window.onload = init
    