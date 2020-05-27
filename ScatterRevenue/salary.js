

var margin = {top: 40, right:50, bottom: 40, left: 50},
    dim = 600
    width = dim - margin.left - margin.right,
    height = dim - margin.top - margin.bottom;

console.log(height);

var x = d3.scaleLinear()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

var r = d3.scaleLinear()
    .range([7, 18]);

var color = d3.scaleOrdinal()
      .range(["#035aa6","#40bad5", "#120136"]);

var xAxis = d3.axisBottom()
    .scale(x)


var yAxis = d3.axisLeft()
    .scale(y)
var format = d3.format(".2f")

function changeElection(ele){
  if(ele == "cantonales"){
    return "Municipal"
  
}else{
  return ele;
  // A function that update the chart
}
}


var svg = d3.select("#chart")
    .attr("width", 1100)
    .attr("height", 550)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("circle").attr("cx",800).attr("cy",0).attr("r", 6).style("fill", "#120136")
svg.append("circle").attr("cx",800).attr("cy",30).attr("r", 6).style("fill", "#40bad5")
svg.append("circle").attr("cx",800).attr("cy",60).attr("r", 6).style("fill", "#035aa6")
svg.append("text").attr("x", 820).attr("y", 0).text("Municipal").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 820).attr("y", 30).text("Presidential").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 820).attr("y", 60).text("Legislative").style("font-size", "15px").attr("alignment-baseline","middle")


svg.append("text").attr("x", -15).attr("y",-15).text("Voting Percentage (in %)").style("font-size", "15px").attr("alignment-baseline","middle")

svg.append("text").attr("x", 2*width - 120).attr("y", height - 20 ).text("Gross Salary (in €)").style("font-size", "15px").attr("alignment-baseline","middle")

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      console.log(d.region);
      return "<div><span>Election:</span> <span style='color:white;text-transform:capitalize;'>" + changeElection(d.election) + "</span></div>" +
              "<div><span>Region:</span> <span style='color:white'>" + d.region + "</span></div>" +
              "<div><span>Year:</span> <span style='color:white'>" + d.year + "</span></div>"+
             "<div><span>Participation:</span> <span style='color:white'>" + format(d.participation) + "%</span></div>";
    })

svg.call(tip);

d3.csv("./ScatterRevenue/salary2.csv").then( function(data) {


  var subset = data.filter(function(el){return el.Metric === 'Salary'});
  var allGroup = d3.map(subset, function(d){return(d.year)}).keys()

  subset.forEach(function(d) {
    d.participation = +d.participation;
    d.grosssalary = +d.grosssalary;
    d.participation = +d.participation;
  });

  x.domain([6000, 28000]);
  y.domain([20, 100]);
  r.domain(d3.extent (subset, function (d)  {return d.participation;}));

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", 70)
      .attr("y", 70)
      .style("text-anchor", "end")
      .text("Gross Salary (in €)");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Voting Participation (in %)")

  svg.selectAll(".dot")
      .data(subset)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", function(d) {return r(d.participation)})
      .attr("cx", function(d) { return x(d.grosssalary); })
      .attr("cy", function(d) { return y(d.participation); })
      .style("fill", function(d) { return color(d.election); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);






$('#yearPick').on("change",function(d){
  update(d.target.value)
 })


  function update(selectedGroup) {
    // Create new data with the selection?
    if(selectedGroup != "Every Region"){

      var dataFilter = subset.filter(function(d){return d.region==selectedGroup})

  }else{
    var dataFilter = data.filter(function(el){return el.Metric === 'Salary'});
  }

  console.log(dataFilter)

    dataFilter.forEach(function(d) {
      d.participation = +d.participation;
      d.grosssalary = +d.grosssalary;
      d.participation = +d.participation;
    });

    x.domain([6000, 28000]);
    y.domain([20, 100]);
    r.domain(d3.extent (dataFilter, function (d)  {return d.participation;}));

    svg.selectAll(".dot").remove()
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "label")
        .attr("x", 50)
        .attr("y", 40)
        .style("text-anchor", "end")
        .text("Gross Salary (in €)");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Voting Participation (in %)")

    svg.selectAll(".dot")
        .data(dataFilter)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d) {return r(d.participation)})
        .attr("cx", function(d) { return x(d.grosssalary); })
        .attr("cy", function(d) { return y(d.participation); })
        .style("fill", function(d) { return color(d.election); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    }



});

function resize() {

  //var dim = parseInt(d3.select("#chart").style("width")), parseInt(d3.select("#chart").style("height")),
  width = parseInt(d3.select("#chart").style("width")) - margin.left - margin.right,
  height = parseInt(d3.select("#chart").style("height")) - margin.top - margin.bottom;

  console.log(dim);

  // Update the range of the scale with new width/height
  x.range([0, width]);
  y.range([height, 0]);

  // Update the axis and text with the new scale
  svg.select('.x.axis')
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.select('.x.axis').select('.label')
      .attr("x",width);

  svg.select('.y.axis')
    .call(yAxis);

  // Update the tick marks
  xAxis.ticks(dim / 75);
  yAxis.ticks(dim / 75);

  // Update the circles
  r.range([dim / 90, dim / 35])

  svg.selectAll('.dot')
    .attr("r", function(d) {return r(d.participation)})
    .attr("cx", function(d) { return x(d.grosssalary); })
    .attr("cy", function(d) { return y(d.participation); })
}

d3.select(window).on('resize', resize);

resize();