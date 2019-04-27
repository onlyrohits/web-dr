
var diameter = 800;
        var color = d3.scaleOrdinal(d3.schemeCategory20);

        var bubble = d3.pack(dataset)
            .size([diameter, diameter])
            .padding(1.5);

        var svg = d3.select("body")
            .append("svg")
            .attr("width", diameter)
            .attr("height", diameter)
            .attr("class", "bubble");

        var nodes = d3.hierarchy(dataset)
            .sum(function(d) { return d.Count; });

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

        node.append("title")
            .text(function(d) {
                return d.Name ;
            });
        
        node.append("circle")
            .attr("r", function(d) {
                return d.r;
            })
            .style("fill", function(d,i) {
                return color(i);
            });

        node.append("text")
            .attr("dy", ".2em")
            .style("text-anchor", "middle")
            .text(function(d) {
                return d.data.Name.substring(0, d.r / 3);
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", function(d){
                return d.r/5;
            })
            .attr("fill", "white");

        node.append("text")
            .attr("dy", "1.3em")
            .style("text-anchor", "middle")
            .text(function(d) {
                return "";
            })
            .attr("font-family",  "Gill Sans", "Gill Sans MT")
            .attr("font-size", function(d){
                return d.r/5;
            })
            .attr("fill", "white");

            d3.selection.prototype.moveToFront = function() {  
      return this.each(function(){
        this.parentNode.appendChild(this);
      });
    };
    d3.selection.prototype.moveToBack = function() {  
        return this.each(function() { 
            var firstChild = this.parentNode.firstChild; 
            if (firstChild) { 
                this.parentNode.insertBefore(this, firstChild); 
            } 
        });
    };    
        d3.selectAll(".node")
        .on("click",function(d,i){
            var current_topic = d.data.Name.substring(0, d.r / 3);
            //alert("changed")
            //Controller Reference
            //d3.select(".current").text(current_topic);
            //d3.selectAll("#questionwc").remove();
            //Question WordCloud Code Start 
            //console.log("Loading data");
            chart("Stream/"+current_topic+".csv", "orange");
            
            
            d3.json("Question-Corpus/"+current_topic+".json", function(error, data) {
                if (error) throw error;
            
                var text = data.text;
            
                console.log("calculating stats");
                word_counts = getWordCounts(text);
            
                // document.getElementById("corpus").innerHTML = word_counts.map(function(x) { return x.text });
                console.log(word_counts.map(function(x) { return x.text }));
            
                var wordcloud = d3.layout.cloud()
                    .size([500, 500])
                    // .words(word_counts)
                    .words(word_counts)
                    .padding(2)
                    .rotate(function() { return ~~(Math.random() * 2) * 90; })
                    .fontSize(function(d) { return d.count * 8; })
                    .on("end", drawCloudQ) // register a callback to insert the elements into the group once the layout has been finalized
                    .start();
            
            }); 

            //Answer WordCloud Code Start 
            //console.log("Loading data");
            d3.json("Answer-Corpus/"+current_topic+".json", function(error, data) {
                if (error) throw error;
            
                var text = data.text;
            
                console.log("calculating stats");
                word_counts = getWordCounts(text);
            
                // document.getElementById("corpus").innerHTML = word_counts.map(function(x) { return x.text });
                //console.log(word_counts.map(function(x) { return x.text }));
            
                var wordcloud = d3.layout.cloud()
                    .size([500, 500])
                    // .words(word_counts)
                    .words(word_counts)
                    .padding(2)
                    .rotate(function() { return ~~(Math.random() * 2) * 90; })
                    .fontSize(function(d) { return d.count * 8; })
                    .on("end", drawCloudA) // register a callback to insert the elements into the group once the layout has been finalized
                    .start();
            
            }); 
            
        })
        .on("mouseover",function(d,i){
                d3.select(this).select("circle").attr("r",80);
                d3.select(this).select("text").attr("font-size", function(d){
                return 20;
            })
                d3.select(this).moveToFront();
                
            })
            .on("mouseout",function(d,i){
                d3.select(this).select("circle").attr("r", d.r);
                d3.select(this).select("text").attr("font-size", function(d){
                return d.r/5;
            })
                
            })

        d3.select(self.frameElement)
            .style("height", diameter + "px");

            // wordcloud.js start
            windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            
            var margin = { top: 20, right: 20, bottom: 30, left: 40 };
            
            width = windowWidth - margin.left - margin.right;
            height = windowHeight - margin.bottom - margin.top;
            
            let stopwords = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"];
            
            function getWordCounts(data) {
                let cleaned_data = data.replace(/[(),.!?<>\-_\/\+:]/g, ""); // !?.,@#$%&"\[\]|()“”:/-_\+
                let text = cleaned_data.toLowerCase();
                // document.getElementById("corpus").innerHTML = text;
            
                let words = text.split(' ')
                    .map(function(x) { return x.trim(); }) // trim out excessive spaces around words
                    .filter(function(x) { return !(!x); }) // remove empty strings
                    .filter(function(x) { return !(stopwords.indexOf(x) >= 0); }) // remove stopwords
                    .filter(function(x) { return x.length > 2; }); // remove single or double character words
            
                let counts = {};
                for (var i = 0; i < words.length; i++) {
                    counts[words[i]] = 1 + (counts[words[i]] || 0);
                }
                var arr = [];
                for (var key in counts) {
                    arr.push({ text: key, count: counts[key] });
                }
            
                var res = arr.filter(function(x) { return x.count > 1 && x.count < 20; });
                return res;
            }
            
            
            
            
            // Make the word cloud
            
            function drawCloudQ(words) {
                // console.log(words);
                d3.selectAll("#questionwcsvg").remove();
                
                var fill = d3.scaleOrdinal(d3.schemeCategory10);
            var xScale = d3.scaleLinear()
                .range([0, width]);
            //alert("tillsvg")
            var svg = d3.select("#questionwcdiv")
                .append("svg")
                .attr("id","questionwcsvg")
                .attr("width", "500")
                .attr("height", "500");
            
            var chartGroup = svg.append("g").attr("transform", "translate(250,250)");
                chartGroup.selectAll("text")
                    .data(words)
                    .enter().append("text")
                    .style("fill", function(d, i) { return fill(i); })
                    .style("font-size", function(d) { return d.size + "px"; })
                    .attr("transform", function(d) {
                        return "translate(" + [+d.x, +d.y] + ")rotate(" + d.rotate + ")";
                    })
                    .attr("text-anchor", "middle")
                    .text(function(d) { return d.text });
            }

            function drawCloudA(words) {
                // console.log(words);
                d3.selectAll("#answerwcsvg").remove();
                
                var fill = d3.scaleOrdinal(d3.schemeCategory10);
            var xScale = d3.scaleLinear()
                .range([0, width]);
            //alert("tillsvg")
            var svg = d3.select("#answerwcdiv")
                .append("svg")
                .attr("id","answerwcsvg")
                .attr("width", "500")
                .attr("height", "500");
            
            var chartGroup = svg.append("g").attr("transform", "translate(250,250)");
                chartGroup.selectAll("text")
                    .data(words)
                    .enter().append("text")
                    .style("fill", function(d, i) { return fill(i); })
                    .style("font-size", function(d) { return d.size + "px"; })
                    .attr("transform", function(d) {
                        return "translate(" + [+d.x, +d.y] + ")rotate(" + d.rotate + ")";
                    })
                    .attr("text-anchor", "middle")
                    .text(function(d) { return d.text });
            }

        //Stream js staers
        var datearray = [];
var colorrange = [];


function chart(csvpath, color) {
   d3.selectAll(".chartStream").remove();
   d3version2.select(".StreamHandler")
   .append("div")
   .attr("class", "chartStream")
if (color == "blue") {
  colorrange = ["#045A8D", "#2B8CBE", "#74A9CF", "#A6BDDB", "#D0D1E6", "#F1EEF6"];
}
else if (color == "pink") {
  colorrange = ["#980043", "#DD1C77", "#DF65B0", "#C994C7", "#D4B9DA", "#F1EEF6"];
}
else if (color == "orange") {
  colorrange = ["#B30000", "#E34A33", "#FC8D59", "#FDBB84", "#FDD49E", "#FEF0D9"];
}
strokecolor = colorrange[0];

var format = d3version2.time.format("%m");

var margin = {top: 20, right: 40, bottom: 30, left: 30};
var width = 800 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var tooltip = d3version2.select(".StreamHandler")
    .append("div")
    .attr("class", "remove")
    .style("position", "absolute")
    .style("z-index", "20")
    .style("visibility", "hidden")
    .style("top", "30px")
    .style("left", "55px");

var x = d3version2.time.scale()
    .range([0, width]);

var y = d3version2.scale.linear()
    .range([height-10, 0]);

var z = d3version2.scale.ordinal()
    .range(colorrange);

var xAxis = d3version2.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(d3version2.time.months);

var yAxis = d3version2.svg.axis()
    .scale(y);

var yAxisr = d3version2.svg.axis()
    .scale(y);

var stack = d3version2.layout.stack()
    .offset("silhouette")
    .values(function(d) { return d.values; })
    .x(function(d) { return d.date; })
    .y(function(d) { return d.value; });

var nest = d3version2.nest()
    .key(function(d) { return d.key; });

var area = d3version2.svg.area()
    .interpolate("cardinal")
    .x(function(d) { return x(d.date); })
    .y0(function(d) { return y(d.y0); })
    .y1(function(d) { return y(d.y0 + d.y); });

var svg = d3version2.select(".chartStream").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var graph = d3version2.csv(csvpath, function(data) {
  data.forEach(function(d) {
    d.date = format.parse(d.date);
    d.value = +d.value;
  });

  var layers = stack(nest.entries(data));

  x.domain(d3version2.extent(data, function(d) { return d.date; }));
  y.domain([0, d3version2.max(data, function(d) { return d.y0 + d.y; })]);

  svg.selectAll(".layer")
      .data(layers)
    .enter().append("path")
      .attr("class", "layer")
      .attr("d", function(d) { return area(d.values); })
      .style("fill", function(d, i) { return z(i); });


  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + width + ", 0)")
      .call(yAxis.orient("right"));

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis.orient("left"));

  svg.selectAll(".layer")
    .attr("opacity", 1)
    .on("mouseover", function(d, i) {
      svg.selectAll(".layer").transition()
      .duration(250)
      .attr("opacity", function(d, j) {
        return j != i ? 0.6 : 1;
    })})

    .on("mousemove", function(d, i) {
      mousex = d3version2.mouse(this);
      mousex = mousex[0];
      var invertedx = x.invert(mousex);
      invertedx = invertedx.getMonth() + invertedx.getDate();
      var selected = (d.values);
      for (var k = 0; k < selected.length; k++) {
        datearray[k] = selected[k].date
        datearray[k] = datearray[k].getMonth() + datearray[k].getDate();
      }

      mousedate = datearray.indexOf(invertedx);
      pro = d.values[mousedate].value;

      d3version2.select(this)
      .classed("hover", true)
      .attr("stroke", strokecolor)
      .attr("stroke-width", "0.5px"), 
      tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" ).style("visibility", "visible");
      
    })
    .on("mouseout", function(d, i) {
     svg.selectAll(".layer")
      .transition()
      .duration(250)
      .attr("opacity", "1");
      d3version2.select(this)
      .classed("hover", false)
      .attr("stroke-width", "0px"), tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" ).style("visibility", "hidden");
  })
    
  var vertical = d3version2.select(".chartStream")
        .append("div")
        .attr("class", "remove")
        .style("position", "absolute")
        .style("z-index", "19")
        .style("width", "1px")
        .style("height", "380px")
        .style("top", "10px")
        .style("bottom", "30px")
        .style("left", "0px")
        .style("background", "#fff");

  d3version2.select(".chartStream")
      .on("mousemove", function(){  
         mousex = d3version2.mouse(this);
         mousex = mousex[0] + 5;
         vertical.style("left", mousex + "px" )})
      .on("mouseover", function(){  
         mousex = d3version2.mouse(this);
         mousex = mousex[0] + 5;
         vertical.style("left", mousex + "px")});
});
}
            
            
                      