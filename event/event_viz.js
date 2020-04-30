
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-12786552-2', 'auto');
ga('send', 'pageview');

types = ["France"];

colorScale = d3.scale.ordinal()
  .domain(types)
  //.range(["#EFB605", "#C20049", "#7EB852"]);
  .range(["#EFB605", "#E58903", "#E01A25", "#C20049", "#991C71", "#66489F", "#2074A0", "#10A66E", "#7EB852","#BB3104",
  "#88B398", "#C7B911", "#1EB52E", "#2CBB11", "#99BAC0","#A1B831", "#D7B811", "#39B8DC7","#312EC1", "#522711","#70B412",
   "#AC7469", "#C20762", "#13925B", "#215C10", "#923D77","#AE76AA", "#D111D9", "#300831","#3D7888", "#5EE2522","#7D2422"]);


d3.csv("event.csv", function (csv) {
  var timeline = d3.layout.timeline()
    .size([1500,80])
    .extent(["1/1/2000", "12/31/2018"])
    .padding(3)
    .maxBandHeight(12);

  xScale = d3.time.scale()
  .domain([new Date("1/1/2000"), new Date("12/31/2018")])
  //.range([0,900]);
  .range([0,1500]);

  xScaleYear = d3.scale.linear()
  .domain([2000, 2018])
  //.range([0,900]);
  .range([0,1500]);


  middles = csv
  .map(function (d) {return (xScale(new Date(d.start)) + xScale(new Date(d.end))) / 2; });

  breaks = ss.ckmeans(middles,4);
  console.log(breaks);

  d3.select("svg#war").append("g").attr("class", "timeline")
  .attr("transform", "translate(0,150)");
  //.attr("transform", "translate(0,150)");

  d3.select("svg#war").append("text").attr("x", 130)
  .attr("y", 50)
  .style("text-anchor", "start")
  .style("font-size", "28px")
  .text("Events that may affect French election");

  axis = d3.svg.axis().scale(xScale)
  .orient("bottom")
  .tickSize(770);

  axisYear = d3.svg.axis().scale(xScaleYear)
  .orient("bottom")
  .tickSize(40)
  .tickFormat(function (d) {return d; });

  d3.select("g.timeline")
  .append("g")
  .attr("class", "axis")
  .attr("transform", "translate(120,-580)")
  .call(axis);

types.forEach(function (type, i) {
  onlyThisType = csv.filter(function(d) {return d.sphere === type});

  theseBands = timeline(onlyThisType);

  d3.select("g.timeline").append("g")
  .attr("class", "categories")
  .attr("transform", "translate(100," + (0 + (i * 90)) + ")")
  .selectAll("rect")
  .data(theseBands)
  .enter().append("rect")
  .attr("rx", 2)
  .attr("x", function (d) {return d.start; })
  .attr("y", function (d) {return d.y; })
  .attr("height", function (d) {return d.dy; })
  .attr("width", function (d) {return d.end - d.start; })
  //.style("fill", function (d) {return colorScale(d.sphere); })
  .style("fill", function (d) {return colorScale(Math.ceil(Math.random()*30)); })
  .style("stroke", "none")
  .style("stroke-width", 1)
  .style("cursor", "pointer")
  .style("opacity", function (d) {return d.type === "covert" ? 0.30 : 1; })
  .style("stroke",function(d) { return d.type === "covert" ? "black" : "none"; })
  .on("mouseover", function (d) {hoverText(d,i); })
  .on("click", function (d) {console.log(d.link);window.open(d.link); });

d3.select("g.timeline").append("text")
  .text(type)
  .attr("y", 15 + (i * 90))
  .attr("x", 80)
  .style("font-size", "20px")
  .style("text-anchor", "end");

});

  periodBars = [];
  periods = [""];

  breaks.forEach(function(breaks, i) {
    periodBars.push({start: breaks[0], end: breaks[breaks.length-1], name: periods[i]});

    d3.selectAll("rect")
    .filter(function(d) {return (d.start + d.end) / 2 >= breaks[0]})
    .each(function (d) {
      d.period = i;
    });
  });

  d3.select("g.timeline").selectAll("rect.periodBars")
  .data(periodBars)
  .enter()
  .insert("rect", "g")
  .attr("y", -65)
  .attr("x", function (d) {return d.start + 100})
  .attr("width", function (d) {return d.end - d.start +100})
  .attr("height", 300)
  .style("fill", "#f6f6f6")
  .style("fill-opacity", 1);

  d3.select("g.timeline").selectAll("text.periodBars")
  .data(periodBars)
  .enter()
  .insert("text", "g")
  .attr("y", 5)
  .attr("x", function (d) {return d.start + 98; })
  .attr("class", "periodLabel")
  .style("font-weight", 100)
  .style("font-size", "20px")
  .style("fill", "#1A1A1A")
  .style("opacity", 0.6)
  .text(function (d) {return d.name; });

  allBands = timeline(csv);

allBands.forEach(function(band) {band.startYear = band.originalStart.getFullYear();band.endYear = band.originalEnd.getFullYear(); });

var x = 2000;

var nowar = [];
while (x <= 2019) {
  var wars = allBands.filter(function(d) {
    return d.startYear <= x && d.endYear >= x;
  }).length;

  nowar.push({x: x, y: wars});
  x++;
}

var peaceG = d3.select("svg#peace").append("g")
  .attr("transform", "translate(100,00)");

peaceG.append("g")
.call(axisYear);

peaceG
.selectAll("circle")
  .data(nowar.filter(function (d) {return d.y === 0; }))
  .enter()
  .append("circle")
  .attr("r", 2)
  .attr("cx", function (d) {return xScaleYear(d.x); })
  .attr("cy", 20);

  distributionData = [];

  allBands
  .sort(function (a,b) {
    if (a.start < b.start) {
      return -1;
    }
    if (b.start > a.start) {
      return 1;
    }
    return 1;
  })
  .forEach(function(d, i) {
    num = allBands.filter(function (p) {
      return (p.start <= d.start && p.end >= d.start);
    }).length;
    distributionData.push({x: d.start, y: num});

  });

//  yRange = d3.extent(distributionData, function (d) {return d.y});
//  distScale = d3.scale.linear().domain(yRange).range([100,0]);
  yRange = d3.extent(nowar, function (d) {return d.y});
  distScale = d3.scale.linear().domain(yRange).range([100,0]);

  distLine = d3.svg.line().y(function (d) {return distScale(d.y)})
  .x(function (d) {return xScaleYear(d.x)})
  .interpolate("step")


  var distG = d3.select("g.timeline")
  .insert("g", "g.axis")
  .attr("transform", "translate(100,70)");

  distG
  .append("text")
  .text("Event")
  .attr("x", -25)
  .attr("y", 50)
  .style("text-anchor", "end")
  .style("font-size", "20px");

  distG
  .append("path")
  .style("fill", "none")
  .style("stroke", "gray")
  .style("stroke-width", "2px")
  .attr("d", distLine(nowar));

  distG
  .append("rect")
  .style("stroke", "none")
  .style("fill", "white")
  .attr("x", 0)
  .attr("y", -198)
  .attr("width", 1000)
  .attr("height", 80)





})

function hoverText(d, i) {
  d3.selectAll("text.label")
  .remove();

  d3.select("g.timeline").append("text")
  .attr("class", "label")
  .attr("x", d.start + 100)
  .attr("y", d.y + (1000 + (i * 90)))
  .style("opacity", .9)
  .style("fill", "white")
  .style("stroke", "white")
  .style("stroke-width", 2)
  .style("pointer-events", "none")
    .text("")
    .transition()
    .duration(d.name.length * 10)
     .tween("text", function() {
         var interpolator = d3.interpolateRound( 0, d.name.length );
        return function(t) {
          var c = Math.floor(t * (d.name.length))
            this.textContent = d.name.substring(0, interpolator(t));
        };
  })

  d3.select("g.timeline").append("text")
  .attr("class", "label")
  .attr("x", d.start + 100)
  .attr("y", d.y + (-5 + (i * 90)))
  .style("pointer-events", "none")
    .text("")
    .transition()
    .duration(d.name.length * 10)
     .tween("text", function() {
         var interpolator = d3.interpolateRound( 0, d.name.length );
        return function(t) {
          var c = Math.floor(t * (d.name.length))
            this.textContent = d.name.substring(0, interpolator(t));
        };
  });

}