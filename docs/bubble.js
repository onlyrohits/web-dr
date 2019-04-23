
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
            
            //d3.select(".current").text(current_topic);
            //d3.selectAll("#questionwc").remove();
            console.log("Loading data");
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
                    .on("end", drawCloud) // register a callback to insert the elements into the group once the layout has been finalized
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
            
            function drawCloud(words) {
                // console.log(words);
                d3.selectAll("#questionwcsvg").remove();
                var fill = d3.scaleOrdinal(d3.schemeCategory10);
            var xScale = d3.scaleLinear()
                .range([0, width]);
            alert("tillsvg")
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
            
                      