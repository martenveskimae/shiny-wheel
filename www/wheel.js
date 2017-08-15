function init(){
	////////////////////////////////////////////////////////////
	//////////////////////// Setup /////////////////////////////
	////////////////////////////////////////////////////////////
	margin = {left: 20, top: 100, right: 20, bottom: 100},
	width = 700 - margin.left - margin.right,
	height = 750 - margin.top - margin.bottom;

	colorScale = d3.scaleOrdinal(d3.schemeCategory20c);

	arc = d3.arc()
	.innerRadius(10) 
	.outerRadius(width*0.9/2 + 30);

	pie = d3.pie()
	.value(function(d) { return d.end - d.start; })
	.padAngle(.005)
	.sort(null);

	svg = d3.select("#wheel")
	.append("svg")
	.attr("width", (width + margin.left + margin.right))
	.attr("height", (height + margin.top + margin.bottom))
	.append("g").attr("class", "wrapper")
	.attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

	g = svg.append("g")
	.attr("class", "dharmachakra");

}

Shiny.addCustomMessageHandler("df", function(message){

	////////////////////////////////////////////////////////////
	//////////////////////// Data //////////////////////////////
	////////////////////////////////////////////////////////////

	var dataframe = message,
	spinData = new Array;

	dataframe.deeds.forEach(function(d,i) {
		u = 360/dataframe.deeds.length;
		if(i==0){
			var s = 0,
			e = u;
		} else {
			var s = spinData[i-1].end +1,
			e = s + u - 1;
		};
		spinData.push({label: d, start: s, end: e, motivation: dataframe.motivation[i], image:  dataframe.images[i] });
	});

	////////////////////////////////////////////////////////////
	/////////////// Create & Update Slices /////////////////////
	////////////////////////////////////////////////////////////

	update(spinData);
	function update(source){
		var t = d3.transition()
    	        .duration(750);

    		var arcs = g.selectAll(".sliceArc")
		.data(pie(source), function(d,i) { return i; });

		var text = g.selectAll(".sliceText")
		.data(source, function(d,i){ return i; });

		arcs.exit()
    		.transition(t)
      		.style("fill-opacity", 1e-6)
      		.remove();

      		text.exit()
      		.transition(t)
      		.style("fill-opacity", 1e-6)
      		.remove();

      		arcs.transition(t)
      		.style("fill", function(d,i) { return colorScale(i); })
		.attr("id", function(d,i) { return "sliceArc_"+i; })
		.attr("d", arc);

		text.transition(t)
		.attr("dx", function(d,i){ return (width*0.9/2 + 30) * Math.PI / dataframe.deeds.length; } );

		arcs.enter()
		.append("path")
		.attr("class", "sliceArc")
		.transition(t)
		.style("fill", function(d,i) { return colorScale(i); })
		.attr("id", function(d,i) { return "sliceArc_"+i; })
		.attr("d", arc);

		text.enter()
		.append("text")
		.attr("class", "sliceText")
		.attr("id", function(d){return d.label;})
		.attr("dx", (width*0.9/2 + 30) * Math.PI / dataframe.deeds.length)
		.attr("dy", 30)
		.append("textPath")
		.attr("class", "sliceTextPath")
		.style("text-anchor", "middle")
		.attr("xlink:href", function(d,i){return "#sliceArc_"+i;})
		.text(function(d){return d.label;});
	}

	d3.selectAll(".sliceDots").remove();
	d3.selectAll(".pointer").remove();

	var arcradius = width*0.9/2 + 25,
	circleradius = 2.2,
	n = (Math.PI * 2 * arcradius) / (circleradius*10);

	for(let i=0; i<n; i++){
		var ang = (Math.PI * 2 * i) / n,
		cx = arcradius * Math.sin(ang),
		cy = arcradius * Math.cos(ang);

		g.append("circle")
		.attr("class", "sliceDots")
		.attr('cx', cx)
		.attr('cy', cy)
		.attr('r', circleradius)
		.attr("fill", "white");
	};

	svg.append("polygon")
	.attr("class", "pointer")
	.attr("points", (-(width*0.9/2 + 30)/24) + "," +(-(width*0.9/2 + 30) - (width*0.9/2 + 30)/12) + " " +
		((width*0.9/2 + 30)/24) + "," + (-(width*0.9/2 + 30) - (width*0.9/2 + 30)/12) + " " +
		"0," + (-(width*0.9/2 + 30) - (width*0.9/2 + 30)/12 + 40)) 
	.style('opacity', 1)
	.attr("fill", "#fff7f7")
	.attr("stroke", "#aaaaaa")
	.attr("stroke-width", 2);           

	svg.append("circle")
	.attr("class", "pointer")
	.attr("id", "pointerCircle")
	.attr("cx", 0)
	.attr("cy", -width/2-25)
	.attr("r", (width*0.9/2 + 30)/24)
	.attr("fill", "#fff7f7")
	.attr("stroke", "#aaaaaa")
	.attr("stroke-width", 2);

	////////////////////////////////////////////////////////////
	//////////////////// Spin function /////////////////////////
	////////////////////////////////////////////////////////////
	var pointerRect = document.getElementById("pointerCircle").getBoundingClientRect(),
	pointerRectCenterX = (pointerRect.right + pointerRect.left) / 2,
	pointerRectCenterY = (pointerRect.bottom + pointerRect.top) / 2;

	var selectedSlice = function(){
		topDeed = new Array;
		for(let i=0; i<dataframe.deeds.length; i++){
			var sliceRect = document.getElementById("sliceArc_"+i).getBoundingClientRect(),
			textRectCenterX = (sliceRect.right + sliceRect.left) / 2,
			textRectCenterY = (sliceRect.bottom + sliceRect.top) / 2,
			dist = Math.sqrt((Math.abs(pointerRectCenterX-textRectCenterX)^2) + (Math.abs(pointerRectCenterY-textRectCenterY)^2));

			topDeed.push(dist);
		}

		var result = spinData[topDeed.indexOf(Math.min(...topDeed))];
		return result;
	};

	var running = false;
	spin = function() {
		running=!running;
		if(!running){spin();};

		var deg = Math.floor((Math.random() * 5500) + 800),
		duration = (deg*400)/360;

		var transform = function() {
			return d3.interpolateString("rotate(0)", "rotate(" + deg + ")");
		};

		d3.select(".dharmachakra")
		.transition()
		.ease(d3.easeQuadOut)
		.duration(duration)
		.attrTween("transform", transform);

		d3.timer(function(){
			document.getElementById("results").innerHTML = selectedSlice().label + "!";
		}, 0);
	};

});
