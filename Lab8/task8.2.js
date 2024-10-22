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

    // Tooltip for circles
    var tooltip = d3.select("body").append("div")
                    .style("position", "absolute")
                    .style("background-color", "white")
                    .style("border", "solid 1px #ccc")
                    .style("border-radius", "5px")
                    .style("padding", "5px")
                    .style("display", "none");

    //load unemployment csv
    d3.csv("VIC_LGA_unemployment.csv").then(function(data) {
        // Ensure values are numeric
        data.forEach(function(d) {
            d.value = +d.value; // Convert to number
        });

        //set color domain based on data values
        color.domain([
            d3.min(data, function(d) { return d.value; }),
            d3.max(data, function(d) { return d.value; })
        ]);

        //load in GeoJSON data
        d3.json("LGA_VIC.json").then(function(json) {

            //merge the original data and GeoJSON
            for (var i = 0; i < data.length; i++) {
                var dataState = data[i].state;
                var dataValue = parseFloat(data[i].value);

                //find the corresponding state inside the GeoJSON
                for (var j = 0; j < json.features.length; j++) {
                    var jsonState = json.features[j].properties.name;

                    if (dataState === jsonState) {
                        //copy the data value into JSON
                        json.features[j].properties.value = dataValue;

                        //stop looking through the JSON
                        break;
                    }
                }
            }

            //create path (UNCHANGED)
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

            //add Victorian towns and cities
            d3.csv("VIC_city.csv").then(function(cityData) {
                cityData.forEach(function(d) {
                    d.lon = +d.lon;
                    d.lat = +d.lat;
                    d.population = +d.population;
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
                        return Math.sqrt(d.population) * 0.02;
                    })
                    .style("fill", "yellow")
                    .style("stroke", "gray")
                    .style("stroke-width", 0.25)
                    .style("opacity", 0.75)
                    // Tooltip interaction
                    .on("mouseover", function(event, d) {
                        tooltip.style("display", "block");
                        tooltip.html(d.place + ": Pop. " + d.population);
                    })
                    .on("mousemove", function(event) {
                        tooltip.style("left", (event.pageX + 10) + "px")
                               .style("top", (event.pageY - 20) + "px");
                    })
                    .on("mouseout", function() {
                        tooltip.style("display", "none");
                    });
            });
        });
    });
}

window.onload = init;
