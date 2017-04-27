/* Created  on 4-17-17 by Nick Roberson, Reilly Grant, and Connor GT */
// Used https://bl.ocks.org/mbostock/3883245

displayData('AMAZON');

d3.queue()
    .defer( d3.csv, 'data/NAMES.csv' )
    .await(function(error , names) {
	var dropDown =
	    d3.select('#filters')
	    .append('select')
	    .attr('id','companies')
	    .on('change',function() {
		displayData(d3.select(this).node().value);
	    });

	dropDown.selectAll('option')
	    .data(names)
	    .enter()
	    .append('option')
	    .attr('value', function(d){
		return d.FileName;
	    }).text(function(d){
		return d.Name;
	    });
    });



function displayData(FileName) {
    d3.select("svg").remove();
    d3.select('#svg_area').append("svg").attr("width", 800).attr("height",450);
    
    var svg = d3.select("svg"),
	margin = {top: 20, right: 50, bottom: 30, left: 50},
	svg_width = +svg.attr("width") - margin.left - margin.right,
	svg_height = +svg.attr("height") - margin.top - margin.bottom,
	g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    //height and width of svg's
    
    // parse by year-month-day
    var parseTime = d3.timeParse("%Y-%m-%d");
    
    var scaleTime = d3.scaleTime().rangeRound([0,svg_width]);
    
    var scaleStock = d3.scaleLinear().rangeRound([svg_height, 0]);
    var scaleSocial = d3.scaleLinear().rangeRound([svg_height, 0]);
    
    var stockLine = d3.line()
	.x(function(d) { return scaleTime(d.Date);} )
	.y(function(d) { return scaleStock(d.Close);});
    
    var trendLine =d3.line()
	.x(function(d) { return scaleTime(d.Date);} )
	.y(function(d) { return scaleSocial(d.Popularity);});
    
    // queue data for loading here 
    d3.queue()
	.defer( d3.csv, 'data/'+FileName+'_STOCK.csv' )
	.defer( d3.csv, 'data/'+FileName+'_GOOGLE_TRENDS.csv' )
	.await( function(error, data_stock, data_google_trends ) {
	    
	    data_google_trends=data_google_trends.reverse();
	    // process data here!
	    var dates = [];
	    
	    for (d of data_stock){
		d.Date = parseTime(d.Date);
		dates.push(d.Date);
		d.Close = +d.Close;
	    }
	    
	    for (d of data_google_trends){
		d.Date = parseTime(d.Date);
		dates.push(d.Date);
		d.Popularity = +d.Popularity;
	    }      
	    
	    
	    scaleTime.domain(d3.extent(dates, function(d) { return d; }));
	    
	    scaleStock.domain(d3.extent(data_stock, function(d) { return d.Close; }));
	    scaleSocial.domain(d3.extent(data_google_trends, function(d) { return d.Popularity; }));
	    
	    g.append("g")
		.attr("transform", "translate(0," + svg_height + ")")
		.call(d3.axisBottom(scaleTime))
		.select(".domain");
	    
	    g.append("g")
		.call(d3.axisLeft(scaleStock))
		.append("text")
		.attr("fill", "#000")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.attr("text-anchor", "end")
		.text("Price ($)");
	    
	    g.append("g")
		.call(d3.axisRight(scaleSocial))
      		.attr("transform", "translate(" + svg_width + ")")
		.append("text")
		.attr("fill", "#000")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.attr("text-anchor", "end")
		.text("Social");
	    
	    g.append("path")
		.datum(data_google_trends)
		.attr("fill", "none")
		.attr("stroke", "green")
		.attr("stroke-linejoin", "round")
		.attr("stroke-linecap", "round")
		.attr("stroke-width", 1.5)
		.attr("d", trendLine);
	    
	    g.append("path")
		.datum(data_stock)
		.attr("fill", "none")
		.attr("stroke", "steelblue")
		.attr("stroke-linejoin", "round")
		.attr("stroke-linecap", "round")
		.attr("stroke-width", 1.5)
		.attr("d", stockLine);
	    
	});
}



