var color = d3.scaleOrdinal(d3.schemeCategory20);

var bubble = d3.pack(dataset)
            .size([diameter, diameter])
            .padding(1.5);

var node = svg.selectAll(".node")
            .data(bubble(nodes).descendants())
            .enter()
            .filter(function(d){
                return  !d.children
            })
            .append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });