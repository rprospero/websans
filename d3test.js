window.onload = function () {
    document.getElementById("xlog").onclick = updater
    document.getElementById("ylog").onclick = updater
    document.getElementById("radius").onchange = updater
    document.getElementById("drho").onchange = updater
    document.getElementById("background").onchange = updater
    document.getElementById("qmin").onchange = updater
    document.getElementById("qmax").onchange = updater
    document.getElementById("qstep").onchange = updater
    window.onresize = updater
}

hardSphere = function(q) {
    var drho = document.getElementById("drho").value;
    var radius = document.getElementById("radius").value;
    var background = +document.getElementById("background").value;

    var xrad = q * radius;
    var bes = 3*(Math.sin(xrad)-xrad*Math.cos(xrad))/(xrad*xrad*xrad);
    var vol = 4*Math.PI/3*radius*radius*radius;
    var f = bes*drho;
    var f2 = f*f*vol*1e8+background;

    return f2;
};

var data=[]

for(var i=0.01;i<6;i+=0.01){
    data.push({x:i,y:hardSphere(i)});
}

var margin = {top: 20, right: 20, bottom: 30, left: 50};
var width = 480 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var x = d3.scale.linear().range([0,width]);
var y = d3.scale.linear().range([height,0]);

var xAxis = d3.svg.axis().scale(x).orient("bottom");
var yAxis = d3.svg.axis().scale(y).orient("left");

var line = d3.svg.line()
    .x(function(d) {return x(d.x);})
    .y(function(d) {return y(d.y);})
    .interpolate("basis");

var svg = d3.select(".chart")
    .attr("width",width + margin.left + margin.right)
    .attr("height",height + margin.top + margin.bottom)
    .append("g")
    .attr("transform","translate("+margin.left+","+margin.top+")");
    
x.domain(d3.extent(data, function(d) {return d.x;}))
y.domain(d3.extent(data, function(d) {return d.y;}))
	
svg.append("g")
    .attr("class","x axis")
    .attr("transform","translate(0,"+height+")")
    .call(xAxis);

svg.append("g")
    .attr("class","y axis")
    .call(yAxis)
    .append("text")
    .attr("transform","rotate(-90)")
    .attr("y",6)
    .attr("dy",".71em")
    .style("text-anchor","end")
    .text("I(Q)");

svg.selectAll("path.line")
    .data([data])
    .enter()
    .append("svg:path")
    .attr("class","line")
    .attr("d",line);

updater = function() {

    var width = document.getElementById("graphspan").clientWidth - margin.left - margin.right;
    var height = document.getElementById("graphspan").clientHeight - margin.top - margin.bottom;

    var data=[]

    qmin = +document.getElementById("qmin").value;
    qmax = +document.getElementById("qmax").value;
    qstep = +document.getElementById("qstep").value;


    for(var i=qmin;i<qmax;i+=qstep){
	data.push({x:i,
		   y:hardSphere(i)});
    }

    if(document.getElementById("xlog").checked){
	x = d3.scale.log().range([0,width]);
    } else {
	x = d3.scale.linear().range([0,width]);
    }


    if(document.getElementById("ylog").checked){
	y = d3.scale.log().range([height,0]);
    } else {
	y = d3.scale.linear().range([height,0]);
    }

    xAxis.scale(x);
    yAxis.scale(y);

    x.domain(d3.extent(data, function(d) {return d.x;})).range([0,width]);
    y.domain(d3.extent(data, function(d) {return d.y;})).range([height,0]);

    var svg = d3.select(".chart")
	.transition()
	.duration(3000)
	.attr("width",width + margin.left + margin.right)
	.attr("height",height + margin.top + margin.bottom)


    var line = d3.svg.line()
	.x(function(d) {return x(d.x);})
	.y(function(d) {return y(d.y);})
	.interpolate("basis");
    
    trans = d3.select("body").transition();

    trans.select(".line")
	.duration(3000)
	.attr("d",line(data));
    trans.select(".y.axis")
	.duration(3000)
	.call(yAxis)
    trans.select(".x.axis")
	.duration(3000)
	.call(xAxis)
}