var widthLeg = 600, heightLeg = 80;

var widthSelf = 750, heightSelf = 650;
var revenue = [-0.0006017,0.0007958,0.0004412,0.00001389,-0.0006276,0.0003567,-0.0003784,-0.00003548]
var migrantsRate = [-0.1951640,-0.1006791,0.0744296,0.05650,0.3091435,-0.0630517,-0.08118,-0.01711]
var tauxChomage = [0.0292984,-0.2515104,-0.4201149 ,-0.06561,-0.1598621,-0.2385,-0.002633,1.1062898]
var textMenu = ["Revenue", "Migrant Rate", "Unemployment rate"]
var matchingParty = {ExtRight : "#273568", Right : "#0058A2", Center : "#FCB731", Left : "#FF8080", ExtLeft: "#CA472B", Ind: "#808080"};
var coefMatching = {UM : "CoefUM", MU : "CoefUM", UR : "CoefRU", RU : "CoefRU", RM: "CoefRM", MR: "CoefRM"};
//Div of the tooltips
var div = d3.select("body").append("div")   
.attr("class", "tooltipScatter")               
.style("opacity", 0);

var div2 = d3.select("body").append("div")   
.attr("class", "tooltipScatter2")               
.style("opacity", 0);

function absMax(array){
	return Math.max(...array.map(a => Math.abs(a)))
}

function filterOutliers(someArray) {  

    // Copy the values, rather than operating on references to existing values
    var values = someArray.concat();

    // Then sort
    values.sort( function(a, b) {
    	return a - b;
    });

    /* Then find a generous IQR. This is generous because if (values.length / 4) 
     * is not an int, then really you should average the two elements on either 
     * side to find q1.
     */     
     var q1 = values[Math.floor((values.length / 4))];
    // Likewise for q3. 
    var q3 = values[Math.ceil((values.length * (3 / 4)))];
    var iqr = q3 - q1;

    // Then find min and max values
    var maxValue = q3 + iqr*1.5;
    var minValue = q1 - iqr*1.5;

    // Then filter anything beyond or beneath these values.
    var filteredValues = values.filter(function(x) {
    	return (x <= maxValue) && (x >= minValue);
    });

    // Then return

    return filteredValues;
}

var svgLeg = d3.select("#leg").append("svg").attr("width",widthLeg).attr("height",heightLeg)

var svgMain = d3.select("#dim")
.append("svg")
.attr("width", widthSelf)
.attr("height", heightSelf);
var scaleX = d3.scaleLinear()
.domain([-absMax(filterOutliers(revenue)), absMax(filterOutliers(revenue))])
.range([0, widthSelf - 200]);

console.log(widthSelf)

var scaleY = d3.scaleLinear()
.domain([-absMax(filterOutliers(tauxChomage)), absMax(filterOutliers(tauxChomage))])
.range([heightSelf-100, 0]);
   // Add scales to axis
   var x_axis = d3.axisBottom()
   .scale(scaleX)
             .tickValues([]);
             var y_axis = d3.axisLeft()
                   .scale(scaleY).tickValues([]);

    //Append group and insert axis
    svgMain.append("g")
    .attr("id","xaxis")
    .attr("transform","translate(20,"+((heightSelf-100)/2+50)+")")
    .call(x_axis);
    svgMain.append("g")
    .attr("id","yaxis")
    .attr("transform", "translate( "+(widthSelf - 100)/2+",50)")
    .call(y_axis);

    d3.json("./ScatterParty/data.json").then(function(d){

    	circle1 = svgMain.selectAll("boule")
    	.data(d.Feuil1)
    	.enter()
    	.append("circle")
    	.attr("cx", function (d) {
    		return scaleX(d.Revenue)+27; 
    	} )
    	.attr("cy", function (d) { 
    		difference = tauxChomage.filter(x => !filterOutliers(tauxChomage).includes(x));
    		if(difference == d.TauxChomage){
    			t = (absMax(filterOutliers(tauxChomage)) - 10/100*absMax(filterOutliers(tauxChomage)))
    			return scaleY(t)+27
    		}
    		return scaleY(d.TauxChomage)+27; 
    	} )
    	.style("fill", function(d) { return matchingParty[d.Parti]; })
    	.attr("r","29")
    	.style("display",function(d){if(d.CoefRU == 0){return "none"}})






    	circle2 = svgMain.selectAll("boule2")
    	.data(d.Feuil1)
    	.enter()
    	.append("circle")
    	.attr("cx", function (d) {
    		difference = revenue.filter(x => !filterOutliers(revenue).includes(x));
    		if(difference == d.revenue){
    			t = (absMax(filterOutliers(revenue)) - 10/100*absMax(filterOutliers(revenue)))
    			return scaleX(t)+27
    		}
    		return scaleX(d.Revenue)+27; 
    	} )
    	.attr("cy", function (d) { 
    		difference = tauxChomage.filter(x => !filterOutliers(tauxChomage).includes(x));
    		if(difference == d.TauxChomage){
    			t = (absMax(filterOutliers(tauxChomage)) - 10/100*absMax(filterOutliers(tauxChomage)))
    			return scaleY(t)+27
    		}
    		return scaleY(d.TauxChomage)+27; 
    	} )
    	.style("fill", "none")
    	.attr("r","33")
    	.attr("stroke",function(d){return matchingParty[d.Parti]})
    	.attr("stroke-width","2") 
    	.style("display",function(d){if(d.CoefRU != 2){console.log(d.CoefRU);return "none"}})





    	candidatesCircle = 	svgMain
    	.selectAll("dot")
    	.data(d.Feuil1)
    	.enter()
    	.append('g')
    	.append('image')
    	.attr("xlink:href",function(d){return "./ScatterParty/Image/"+d.Parti+".png"})
    	.attr("height",54)
    	.attr("width",54)
    	.attr("id",function(d){return "circle"+d.Parti;})
    	.attr("x", function (d) {
    		return scaleX(d.Revenue); 
    	} )
    	.attr("y", function (d) { 
    		difference = tauxChomage.filter(x => !filterOutliers(tauxChomage).includes(x));
    		if(difference == d.TauxChomage){
    			t = (absMax(filterOutliers(tauxChomage)) - 10/100*absMax(filterOutliers(tauxChomage)))
    			return scaleY(t)
    		}
    		return scaleY(d.TauxChomage); 
    	} )
    	.on("mouseover", function(d) {	   
    	 	  if(d.Parti == "Ind"){
    	 	  	 	 	  div.transition()  //Make the tooltip appear      
    	 	  .duration(200)
    	 	  .style("opacity", 1);
  			div.html( "<h3 class = 'scatter' style='color: "+matchingParty[d.Parti]+"'>"+ d.PartiName+"</h3>"+"</h4><h4 class = 'h4title'>Candidates:<span> "+d.Candidat+"</span></h4>"
    	 	  	+"<h4 class = 'h4title' >Election score (2017): <span>"+d.Score+"%</span></h4>"+"<h4 class = 'h4title'>Partisan departments: <span>"+d.Department+"</span></h4>")  
                  .style("left", (d3.event.pageX + 30) + "px")  //Placement of the tooltip compared to the mouse   
                  .style("top", (d3.event.pageY - 30) + "px")
    	 	  }else if(d.Parti == "Abstention" || d.Parti == "White"){
    	 	  	div2.transition()  //Make the tooltip appear      
    	 	  .duration(200)
    	 	  .style("opacity", 1);
  			div2.html( "<h3 class = 'scatter'  style='color: "+matchingParty[d.Parti]+"'>"+ d.PartiName+"</h3>"+"<h4 class = 'h4title' style='text-align: left;'>"
    	 	  	+"<h4 class = 'h4title'>Election score (2017): <span>"+d.Score+"%</span></h4>"+"<h4 class = 'h4title'>Partisan departments: <span>"+d.Department+"</span></h4>")  
                  .style("left", (d3.event.pageX + 30) + "px")  //Placement of the tooltip compared to the mouse   
                  .style("top", (d3.event.pageY - 30) + "px")
    	 	  }else{
    	 	  	 	 	  div.transition()  //Make the tooltip appear      
    	 	  .duration(200)
    	 	  .style("opacity", 1);
    	 	  div.html( "<h3 class = 'scatter'  style='color: "+matchingParty[d.Parti]+"'>"+ d.Candidat+"</h3>"+"<h4 class = 'h4title' style='text-align: left;'>"+d.PartiName+"</h4><h4 class = 'h4title'>Position:<span> "+d.Side+"</span></h4>"
    	 	  	+"<h4 class = 'h4title'>Election score (2017): <span>"+d.Score+"%</span></h4>"+"<h4 class = 'h4title'>Partisan departments: <span>"+d.Department+"</span></h4>")  
                  .style("left", (d3.event.pageX + 30) + "px")  //Placement of the tooltip compared to the mouse   
                  .style("top", (d3.event.pageY - 30) + "px")
             
    		}
 })
    	.on("mouseout", function(d) {
    	  	  div.style("opacity", 0)//Tooltip diseapear
    	  	  .style("left", "-500px")
    	  	  .style("top", "-500px");

    	  	   div2.style("opacity", 0)//Tooltip diseapear
    	  	  .style("left", "-500px")
    	  	  .style("top", "-500px");

    	  	})


    })




    function appendLegend(){

    	svgLeg.append("text")             
    	.attr("x",0)
    	.attr("y",heightSelf/5-100)
    	.style("text-anchor", "left")
    	.style("fill", "dark")
    	.style("font-weight","bold")
    	.style("text-decoration","underline")
        .style("font-size","13px")
    	.text("Statistical significance:");


    	svgLeg.append("text")             
    	.attr("x",35)
    	.attr("y",heightSelf/5-67)
    	.style("text-anchor", "left")
    	.style("fill", "dark")
    	.style("font-weight","bold")
.style("font-size","13px")
    	.text(" Non significant");

    	svgLeg.append("text")             
    	.attr("x",237 )
    	.attr("y",heightSelf/5-67)
    	.style("text-anchor", "left")
    	.style("fill", "dark")
    	.style("font-weight","bold")
        .style("font-size","13px")
    	.text(" Significant");

    	svgLeg.append("text")             
    	.attr("x",410)
    	.attr("y",heightSelf/5-67)
    	.style("text-anchor", "left")
    	.style("fill", "dark")
    	.style("font-weight","bold")
        .style("font-size","13px")
    	.text(" Highly significant");



    	svgLeg.append("image")
    	.attr("xlink:href","./ScatterParty/Image/Empty.png")
    	.attr("height",30)
    	.attr("width",30)
    	.attr("x",0)
    	.attr("y",heightSelf/5-69-24+5)

    	svgLeg.append("image")
    	.attr("xlink:href","./ScatterParty/Image/Empty.png")
    	.attr("height",30)
    	.attr("width",30)
    	.attr("x",195)
    	.attr("y",heightSelf/5-69-24+5)


    	svgLeg.append("image")
    	.attr("xlink:href","./ScatterParty/Image/Empty.png")
    	.attr("height",30)
    	.attr("width",30)
    	.attr("x",365)
    	.attr("y",heightSelf/5-69-24+5)


    	svgLeg
    	.append("circle")
    	.attr("cx", 210)
    	.attr("cy", heightSelf/5-73)
    	.style("fill", "none")
    	.attr("stroke","#273568")
    	.attr("stroke-width","2") 
    	.attr("r","15")

    	svgLeg
    	.append("circle")
    	.attr("cx", 380)
    	.attr("cy", heightSelf/5-73)
    	.style("fill", "none")
    	.attr("stroke","#273568")
    	.attr("stroke-width","2") 
    	.attr("r","15")

    	
    	svgLeg
    	.append("circle")
    	.attr("cx", 380)
    	.attr("cy", heightSelf/5-73)
    	.style("fill", "none")
    	.attr("stroke","#273568")
    	.attr("stroke-width","2") 
    	.attr("r","21")

    	
    }

    function appendLabels(){

    	svgMain.append("text") 
    	.attr("id","xlabel")            
    	.attr("x",2.55*widthSelf/3-50)
    	.attr("y",heightSelf/2+8)
    	.style("text-anchor", "left")
    	.style("fill", "dark")
    	.style("font-weight","bold")
    	.text(function(d){return $('#Xpick')[0].value});

    	svgMain.append("text")     	
    	.attr("id","ylabel")            
    	.attr("x",widthSelf/2-60)
    	.attr("y",35)
    	.style("text-anchor", "middle")
    	.style("fill", "dark")
    	.style("font-weight","bold")
    	.text(function(d){return $('#Ypick')[0].value});
    }

    appendLegend()
    appendLabels()

    $('#Xpick').on("change",function(d){
    	svgMain.selectAll("#xlabel").remove()

    	appendLabels()
    	var circlesCoef;
    	var xdata;
    	var select;
    	switch(d.target.value){
    		case "Migrants Rate":
    		xdata = migrantsRate;
    		select = "MigrantsRate";
    		circlesCoef = "M"+  $('#Ypick')[0].value.charAt(0)
    		break;
    		case "Revenue":
    		xdata = revenue
    		select = "Revenue"
    		circlesCoef = "R" + $('#Ypick')[0].value.charAt(0)
    		break;
    		case "Unemployment Rate":
    		xdata = tauxChomage;
    		select = "TauxChomage";
    		circlesCoef = "T" + $('#Ypick')[0].value.charAt(0)
    		break;

    		default:
    		xdata = revenue;
    		select = "Revenue";
    		circlesCoef = "R" + $('#Ypick')[0].value.charAt(0)
    		break;
    	} 


    var scaleX = d3.scaleLinear()
	.domain([-absMax(filterOutliers(xdata)), absMax(filterOutliers(xdata))])
	.range([0, widthSelf - 200]);

	   var x_axis = d3.axisBottom()
   .scale(scaleX)
              .tickValues([]);


 	//svg.select("#xaxis").remove()
               // svg.append("g")



    //.attr("id","xaxis")
    svgMain.select("#xaxis").transition()
    .attr("transform","translate(20,"+((heightSelf-100)/2+50)+")")
    .call(x_axis);

    candidatesCircle.transition().duration(1000)
    .attr("x", function (d) {
    		difference = xdata.filter(x => !filterOutliers(xdata).includes(x));
    		if(difference == d[select]){
    			t = (absMax(filterOutliers(xdata)) - 10/100*absMax(filterOutliers(xdata)))
    			return scaleX(t)
    		}
    		return scaleX(d[select]); 

    	} )
    	
    circle1.transition().duration(1000)
    .attr("cx", function (d) {
    		difference = xdata.filter(x => !filterOutliers(xdata).includes(x));
    		if(difference == d[select]){
    			t = (absMax(filterOutliers(xdata)) - 10/100*absMax(filterOutliers(xdata)))
    			return scaleX(t)+27
    		}
    		return scaleX(d[select])+27; 
    	} )
    .style("display",function(d){if(d[coefMatching[circlesCoef]]== 0){return "none"}})



   	circle2.transition().duration(1000)
   	.attr("cx", function (d) {
    		difference = xdata.filter(x => !filterOutliers(xdata).includes(x));
    		if(difference == d[select]){
    			t = (absMax(filterOutliers(xdata)) - 10/100*absMax(filterOutliers(xdata)))
    			return scaleX(t)+27
    		}
    		return scaleX(d[select])+27; 
    	} )
	.style("display",function(d){if(d[coefMatching[circlesCoef]] != 2){return "none"}})


});

///////////////////////////////////////////////////////////////////////:

    $('#Ypick').on("change",function(d){
    	svgMain.selectAll("#ylabel").remove()
    	appendLabels()
    	var circlesCoef;
    	var ydata;
    	var select;
    	switch(d.target.value){
    		case "Migrants Rate":
    		ydata = migrantsRate;
    		select = "MigrantsRate";
    		circlesCoef = "M"+  $('#Xpick')[0].value.charAt(0)
    		break;
    		case "Revenue":
    		ydata = revenue
    		select = "Revenue"
    		circlesCoef = "R"+  $('#Xpick')[0].value.charAt(0)
    		break;
    		case "Unemployment Rate":
    		ydata = tauxChomage;
    		select = "TauxChomage";
    		circlesCoef = "U"+  $('#Xpick')[0].value.charAt(0)
    		break;
    		default:
    		ydata = revenue;
    		select = "Revenue";
    		circlesCoef = "R"+  $('#Xpick')[0].value.charAt(0)
    		break;
    	} 
    
    	var scaleY = d3.scaleLinear()
    	.domain([-absMax(filterOutliers(ydata)), absMax(filterOutliers(ydata))])
    	.range([heightSelf-100, 0])
		
             var y_axis = d3.axisLeft()
                   .scale(scaleY).tickValues([]);


                   candidatesCircle.transition().duration(1000)

                   .attr("y", function (d) { 
                   	difference = ydata.filter(x => !filterOutliers(ydata).includes(x));
                   	if(difference == d[select]){
                   		t = (absMax(filterOutliers(ydata)) - 10/100*absMax(filterOutliers(ydata)))
                   		return scaleY(t)
                   	}
                   	return scaleY(d[select]); 
                   } )

                   //svg.select("#yaxis").remove()
                   console.log(widthSelf)

                   svgMain.select("#yaxis").transition()
                   .attr("transform", "translate( "+(widthSelf - 100)/2+",50)")
                   .call(y_axis);



                   circle1.transition().duration(1000)
                   .attr("cy", function (d) { 
                   	difference = ydata.filter(x => !filterOutliers(ydata).includes(x));
                   	if(difference == d[select]){
                   		t = (absMax(filterOutliers(ydata)) - 10/100*absMax(filterOutliers(ydata)))
                   		return scaleY(t)+27
                   	}
                   	return scaleY(d[select])+27; 
                   } )
                   .style("display",function(d){if(d[coefMatching[circlesCoef]]== 0){return "none"}})

                   circle2.transition().duration(1000)
                   .attr("cy", function (d) { 
                   	difference = ydata.filter(x => !filterOutliers(ydata).includes(x));
                   	if(difference == d[select]){
                   		t = (absMax(filterOutliers(ydata)) - 10/100*absMax(filterOutliers(ydata)))
                   		return scaleY(t)+27
                   	}
                   	return scaleY(d[select])+27; 
                   } )
                       .style("display",function(d){if(d[coefMatching[circlesCoef]]!=2){return "none"}})


               });