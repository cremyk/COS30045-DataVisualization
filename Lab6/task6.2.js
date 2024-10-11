function init() {
    var w = 500;
    var h = 150;
    var barPadding = 3;
    
    var dataset = [14, 5, 26, 23, 9, 10, 28, 3, 7, 13];
    var maxValue = 25; // Maximum value for random data
    var sortOrder = false; //initialize sortOrder which false is ascending
    
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
                .attr("height", h);
    
    //function to handle mouse events (mouseover and mouseout)
    function MouseEvents(select) {
        select.on("mouseover", function(event, d) {
            // Remove any existing tooltip before adding a new one
            d3.select("#tooltip").remove();
    
            var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2;
            var yPosition = parseFloat(d3.select(this).attr("y")) - 10;
    
            // Create tooltip on hover
            svg1.append("text")
                .attr("id", "tooltip")
                .attr("x", xPosition)
                .attr("y", yPosition + 25)
                .attr("text-anchor", "middle")
                .attr("fill", "black")
                .text(d);  // Display the data value inside the tooltip
    
            // Change bar color on hover
            d3.select(this)
                .transition()
                .duration(200)
                .attr("fill", "orange");
        })
        .on("mouseout", function() {
            // Remove the tooltip when the mouse moves out
            d3.select("#tooltip").remove();
    
            // Recover bar color on mouse out
            d3.select(this)
                .transition()
                .duration(200)
                .attr("fill", "slategrey");
        });
    }

    //function to update the bars
    function updateBars() {
        //bind data to bar variable
        var bars = svg1.selectAll("rect")
            .data(dataset);

        //create new bars for any new data
        bars.enter()
            .append("rect") //create the new rectangle
            .attr("x", function(d, i) { //set x position
                return xScale(i); 
            })
            .attr("y", function(d) { //set y position 
                return h - yScale(d); 
            })
            .attr("width", xScale.bandwidth()) //set bar width
            .attr("height", function(d) { //set bar height
                return yScale(d); 
            })
            .attr("fill", "slategrey")
            /*.each(function(d) {
                d3.select(this)
                  .append("title")
                  .text("This Value is " + d); //add tooltip text
            })*/
            .call(MouseEvents) //apply mouse events to new bars
            .merge(bars) // Merge with existing bars
            .transition()
            .duration(500)
            .attr("x", function(d, i) { //update x position
                return xScale(i); 
            }) 
            .attr("y", function(d) { //update y position
                return h - yScale(d); 
            }) 
            .attr("width", xScale.bandwidth()) //set bar width
            .attr("height", function(d) { //set bar height
                return yScale(d); 
            }); 

        bars.exit().remove(); //remove old bars
    }


    //initial bars 
    updateBars();
    
    //add button event
    d3.select("#add").on("click", function() {
        var newNumber = Math.floor(Math.random() * maxValue);
        dataset.push(newNumber); //add the new number to dataset
    
        xScale.domain(d3.range(dataset.length)); //update xScale
        updateBars();
    });
    
    //remove button event
    d3.select("#remove").on("click", function() {
        dataset.pop(); //remove last element
        xScale.domain(d3.range(dataset.length)); //update xScale
        updateBars();
    });


   //sort bars
    d3.select("#sort").on("click", function() {
        sortOrder = !sortOrder; // Toggle sort order

    //sort dataset
    dataset.sort(function(a, b) {
        return sortOrder ? d3.ascending(a, b) : d3.descending(a, b);
    });

    //update xScales for sorted dataset
    xScale.domain(d3.range(dataset.length));

    //redraw bars and labels
    updateBars();
});
}

    
// Call the init function when the window loads
window.onload = init
    