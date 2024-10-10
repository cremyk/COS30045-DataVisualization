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
            .attr("fill", "rgb(255, 192, 203)");

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

//draw initial labels
svg1.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function(d) {
        return d;
    })
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .attr("x", function(d, i) {
        return xScale(i) + xScale.bandwidth() / 2;
    })
    .attr("y", function(d) {
        return h - yScale(d) + 14;
    });

//function update with random values
function updateData() {
    //update dataset with random values
    var numValues = dataset.length;

    dataset = []; //reset the dataset array

    //give the dataset with random values
    for (var i = 0; i < numValues; i++) {
        var newNumber = Math.floor(Math.random() * maxValue);
        dataset.push(newNumber);
    }

    //update yScale to adjust for new data range
    yScale.domain([0, d3.max(dataset)]);

    //update bars with animation
    svg1.selectAll("rect")
        .data(dataset)
        .transition()
        .delay(function(d,i) {
            return i * 100;
        })
        .duration(1000)
        .ease(d3.easeCubicInOut)
        .attr("y", function(d) {
            return h - yScale(d);
        })
        .attr("height", function(d) {
            return yScale(d);
        });

    //update labels with animation
    svg1.selectAll("text")
        .data(dataset)
        .transition()
        .delay(function(d,i) {
            return i * 100;
        })
        .duration(1000)
        .ease(d3.easeCubicInOut)
        .text(function(d) {
            return d;
        })
        .attr("x", function(d, i) {
            return xScale(i) + xScale.bandwidth() / 2;
        })
        .attr("y", function(d) {
            return h - yScale(d) + 14;
        });
}

//update button event
d3.select("#updatebutton").on("click", function() {
   updateData(); //call the updateData function 
});

//transitions button 1
d3.select("#transition1").on("click", function() {
    updateData(); //call the updateData function  
    
    //update bar
    svg1.selectAll("rect")
        .data(dataset)
        .transition()
        .delay(function(d,i) {
            return i * 30 ; //faster staggered effect
        })
        .duration(500) //shorter duration for faster transition
        .ease(d3.easeCubicInOut)
        .attr("y", function(d) {
            return h - yScale(d);
        })
        .attr("height", function(d) {
            return yScale(d);
        });

    //update label
    svg1.selectAll("text")
        .data(dataset)
        .transition()
        .delay(function(d,i) {
            return i * 30;
        })
        .duration(500)
        .ease(d3.easeCubicInOut)
        .text(function(d) {
            return d;
        })
        .attr("x", function(d, i) {
            return xScale(i) + xScale.bandwidth() / 2;
        })
        .attr("y", function(d) {
            return h - yScale(d) + 14;
        });
});

//transitions button 2
d3.select("#transition2").on("click", function() {
    updateData(); //call the updateData function  
    
    //update bar
    svg1.selectAll("rect")
        .data(dataset)
        .transition()
        .delay(function(d,i) {
            return i * 300 ; //slower staggered effect
        })
        .duration(2000) //longer duration for slower transition
        .ease(d3.easeCubicInOut)
        .attr("y", function(d) {
            return h - yScale(d);
        })
        .attr("height", function(d) {
            return yScale(d);
        });

    //update label
    svg1.selectAll("text")
        .data(dataset)
        .transition()
        .delay(function(d,i) {
            return i * 300;
        })
        .duration(2000)
        .ease(d3.easeCubicInOut)
        .text(function(d) {
            return d;
        })
        .attr("x", function(d, i) {
            return xScale(i) + xScale.bandwidth() / 2;
        })
        .attr("y", function(d) {
            return h - yScale(d) + 14;
        });
});

