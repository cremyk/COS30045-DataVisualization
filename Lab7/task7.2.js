var dataset = [5, 10, 20, 45, 6, 25]; // Simple dataset

// Define the pie layout
var pie = d3.pie(); // Creates a pie layout generator

var w = 300;
var h = 300;

var outerRadius = w / 2;
var innerRadius = 0;
var arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

// Define the color scale
var color = d3.scaleOrdinal(d3.schemeCategory10);

// Create the SVG element
var svg = d3.select("article.content")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

// Set up groups for the arcs
var arcs = svg.selectAll("g.arc")
                .data(pie(dataset)) // Bind the pie data to the arcs
                .enter()
                .append("g")
                .attr("class", "arc")
                .attr("transform", "translate(" + outerRadius + ", " + outerRadius + ")"); // Center the pie chart

// Draw arc paths
arcs.append("path")
    .attr("fill", function(d, i) {
        return color(i); // Use color scale for different segments
    })
    .attr("d", arc); // Generate the arc shapes

// Add text labels for each wedge
arcs.append("text")
    .text(function(d) {
        return d.value; // Display the value of each slice (this comes from the pie layout)
    })
    .attr("transform", function(d) {
        return "translate(" + arc.centroid(d) + ")"; // Position the text in the center of each wedge
    })
    
