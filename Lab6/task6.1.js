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
                .attr("height", h);
    
    //function to handle mouse events (mouseover and mouseout)
    function MouseEvents(select) {
        select.on("mouseover", function(event, d) {
            var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2;
            var yPosition = parseFloat(d3.select(this).attr("y")) - 10;

            //create tooltip on hover
            svg1.append("text")
                .attr("id", "tooltip")
                .attr("x", xPosition)
                .attr("y", yPosition)
                .attr("text-anchor", "middle")
                .attr("fill", "black")

            d3.select(this) //change bar colour on hover
              .transition()
              .duration(200)
              .attr("fill", "orange");
        })
        .on("mouseout", function() {
            d3.select("#tooltip").remove(); //remove tooltip on oust out

            d3.select(this) //recover bar colour on mouse out
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
            .each(function(d) {
                d3.select(this)
                  .append("title")
                  .text("This Value is " + d); //add tooltip text
            })
            .call(MouseEvents) //apply mouse events to new bars
            .merge(bars) // Merge with existing bars
            .transition()
            .duration(500)
            .attr("x", function(d, i) { return xScale(i); }) //update x position
            .attr("y", function(d) { return h - yScale(d); }) //update y position
            .attr("width", xScale.bandwidth()) //set bar width
            .attr("height", function(d) { return yScale(d); }); //set bar height

        bars.exit().remove(); //remove old bars
    }

    //function to update the text labels
    function updateLabels() {
        //bind data to text variable
        var texts = svg1.selectAll("text")
            .data(dataset);

        //create new text labels for any new data
        texts.enter()
        .append("text") //create the new text
        .attr("fill", "black") 
        .attr("text-anchor", "middle") 
        .attr("x", function(d, i) { //set x position
            return xScale(i) + xScale.bandwidth() / 2; 
        }) 
        .attr("y", function(d) { //set y position
            return h - yScale(d) + 14; 
        }) 
        .text(function(d) { 
            return d; 
        }) //set initial text
        .merge(texts) //merge with existing text labels
        .transition()
        .duration(500)
        .attr("x", function(d, i) { 
            return xScale(i) + xScale.bandwidth() / 2; 
        }) 
        .attr("y", function(d) { 
            return h - yScale(d) + 14; 
        }) 
        .text(function(d) { //update text
            return d; 
        }); 

    texts.exit().remove(); //remove old labels
}

    //initial bars and labels
    updateBars();
    updateLabels();
    
    //add button event
    d3.select("#add").on("click", function() {
        var newNumber = Math.floor(Math.random() * maxValue);
        dataset.push(newNumber); //add the new number to dataset
    
        xScale.domain(d3.range(dataset.length)); //update xScale
        updateBars();
        updateLabels();
    });
    
    //remove button event
    d3.select("#remove").on("click", function() {
        dataset.pop(); //remove last element
        xScale.domain(d3.range(dataset.length)); //update xScale
        updateBars();
        updateLabels();
    });
}

//call the init function when the window loads
window.onload = init;
