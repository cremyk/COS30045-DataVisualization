function init() {
    //width and height
    var w = 500;
    var h = 300;

    var projection = d3.geoMercator()
                        .center([145, -36.5])
                        .translate([w / 2, h / 2])
                        .scale(3000);

    //define path generator
    var path = d3.geoPath()
                .projection(projection);

    //create svg
    var svg = d3.select("#MapOnPage")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .attr("fill", "steelblue");

    //load in GeoJSON data
    d3.json("LGA_VIC.json").then(function(json) { 

        //bind data ad create one path per GeoJSON feature
        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path);
    });
}
window.onload = init;