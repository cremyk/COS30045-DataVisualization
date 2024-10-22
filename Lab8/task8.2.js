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

    //set the colour range
    var color = d3.scaleQuantize()
                    .range(["rgb(242,240,247)", "rgb(203,201,226)",
                        "rgb(158,154,200)", "rgb(117,107,177)", "rgb(84,39,143)"]);

    //create svg
    var svg = d3.select("#MapOnPage")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .attr("fill", "steelblue");

    //load unemployement csv
    d3.csv("VIC_LGA_unemployment.csv").then(function(data) {
        //set color domain based on data values
        color.domain([
            d3.min(data, function(d) { return d.value; }),
            d3.max(data, function(d) { return d.value; })
        ]);

    //load in GeoJSON data
    d3.json("LGA_VIC.json").then(function(json) { 

        //merge the og. data and GeoJSON
        //loop through once for each og. data value
        for (var i = 0; i < data.length; i++) {

            //grab state name
            var dataState = data[i].state;

            //grab data value and convert from string to float
            var dataValue = parseFloat(data[i].value);

            //find the corresponding state inside the GeoJSON
            for (var j = 0; j < json.features.length; j++) {
                var jsonState = json.features[j].properties.name;

                if (dataState == jsonState) {
                    //copy the data value into JSON
                    json.features[j].properties.value = dataValue;

                    //stop looking through the JSON
                    break;
                }
            }
        }

    //create path
    svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", function(d) {
            //get data value
            var value = d.properties.value;

            if (value) {
                //if value exists
                return color(value);
            } else {
                //if value is undefined
                return "#ccc";
            }
        });
    

    //add victorian towns and cities
    d3.csv("VIC_city.csv").then(function(cityData) {
        data.forEach(function(d) {
            d.lon = +d.lon;
            d.lat = +d.lat;
        });

    

    //add position for each circle 
    svg.selectAll("circle")
        .data(cityData)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return projection([d.lon, d.lat])[0];
        })
        .attr("cy", function(d) {
            return projection([d.lon, d.lat])[1];
        })
        .attr("r", function(d) {
            return Math.sqrt(parseInt(d.population)) * 0.02;
        })
        .style("fill", "yellow")
        .style("stroke", "gray")
        .style("stroke-width", 0.25)
        .style("opacity", 0.75)
        .append("title") //simple tooltip
        .text(function(d) {
            return d.place + ": Pop. " + formatAsThousands(d.population);
        });
    });
});
})
}



window.onload = init;