function init() {
    // width and height
    var w = 500;
    var h = 500;

    // define projection
    var projection = d3.geoMercator()
        .center([145, -36.5])  // Victoria's center coordinates
        .translate([w / 2, h / 2])
        .scale(3000);

    // define path generator
    var path = d3.geoPath()
                .projection(projection);

    // set the color range for choropleth
    var color = d3.scaleQuantize()
        .range(["rgb(242,240,247)", "rgb(203,201,226)", 
                "rgb(158,154,200)", "rgb(117,107,177)", "rgb(84,39,143)"]);

    // Create a div for the tooltip
    var tooltip = d3.select("body")
                    .append("div")
                    .attr("class", "tooltip")
                    .style("position", "absolute")
                    .style("visibility", "hidden")
                    .style("background-color", "white")
                    .style("border", "1px solid #ccc")
                    .style("padding", "5px")
                    .style("border-radius", "4px")
                    .style("font-size", "12px")
                    .style("pointer-events", "none");

    // create SVG element
    var svg = d3.select("#MapOnPage")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

    // Load unemployment CSV data
    d3.csv("VIC_LGA_unemployment.csv").then(function(data) {
        // Set the color domain based on the unemployment values
        color.domain([
            d3.min(data, function(d) { return +d.unemployed; }),
            d3.max(data, function(d) { return +d.unemployed; })
        ]);

        // Load in GeoJSON data for Victoria
        d3.json("LGA_VIC.json").then(function(json) {

            // Merge the unemployment data with GeoJSON
            for (var i = 0; i < data.length; i++) {
                var dataState = data[i].LGA;   // name of state from CSV
                var dataValue = parseFloat(data[i].unemployed);  // unemployment rate

                // Find corresponding state in GeoJSON and assign unemployment value
                for (var j = 0; j < json.features.length; j++) {
                    var jsonState = json.features[j].properties.LGA_name;

                    if (dataState == jsonState) {
                        json.features[j].properties.value = dataValue;
                        break;
                    }
                }
            }

            // Create the map paths for each LGA
            svg.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("fill", function(d) {
                    // Get unemployment value
                    var value = d.properties.value;
                    if (value) {
                        // Apply the color if value exists
                        return color(value);
                    } else {
                        // If no value, color it light gray
                        return "#ccc";
                    }
                });

            // Add Victorian towns and cities as circles
            d3.csv("VIC_city.csv").then(function(data) {
                svg.selectAll("circle")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("cx", function(d) {
                        return projection([d.lon, d.lat])[0];
                    })
                    .attr("cy", function(d) {
                        return projection([d.lon, d.lat])[1];
                    })
                    .attr("r", 5)
                    .style("fill", "yellow")
                    .style("opacity", 0.75)
                    .style("stroke", "gray")
                    .style("stroke-width", 0.25)
                    .on("mouseover", function(event, d) {
                        tooltip.style("visibility", "visible")
                               .text( d.place);
                    })
                    .on("mousemove", function(event) {
                        tooltip.style("top", (event.pageY - 10) + "px")
                               .style("left", (event.pageX + 10) + "px");
                    })
                    .on("mouseout", function() {
                        tooltip.style("visibility", "hidden");
                    });
                });
        });
    });
}
            

                

window.onload = init;
