var dataset = [5, 10, 20, 45, 6, 25]; //simple dataset
var pie = d3.pie(); //define default pie

var w = 300;
var h = 300;

var outerRadius = w / 2;
var innerRadius = 0;
var arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

//colour scale
var color = d3.scaleOrdinal(d3.schemeCategory10);

//create svg element
var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

//set up groups
var arcs = svg.selectAll("g.arc")
                .data(pie(dataset))
                .enter()
                .append("g")
                .attr("class", "arc")
                .attr("transform", "translate(" + outerRadius + ", " + outerRadius + ")");

//draw arcpaths
arcs.append("path")
    .attr("fill", function(d, i) {
        return color(i);
    })
    .attr("d", arc); //generate arc shapes

//text label for each wedge
arcs.append("text")
    .attr("transform", function(d) {
        return "translate("  + arc.centroid(d) + ")";
    })
    .attr("text-anchor", "middle")
    .text(function(d) {
        return d.value;
    });