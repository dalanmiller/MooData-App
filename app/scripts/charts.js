var sd, ed, startDate, endDate, range, json, empty;
$(document).ready(function() {
	//$("#datepicker").datepicker();
	//$("#datepicker").datepicker("option", "dateFormat", "yy-mm-dd");
	var today = new Date();
	endDate = getTimeString(today);
	range = 6;
	var ed = endDate.split("-");
	var sd = new Date(ed[0], ed[1] - 1, ed[2]);
	sd.setDate(sd.getDate() - range);
	startDate = getTimeString(sd);
	console.log(startDate);
	$(".range").click(function() {
		range = $(this).attr("value");
		console.log("range set:"+range);
	});
	$.getJSON("scripts/milkdata.json", function(data) {
		json = data;
	});

	$("#btn").click(function() {
		//var d = $("#datepicker").datepicker("option", "dateFormat", "yy-mm-dd").val();
		
		//d = $('#myDate').datebox("getTheDate");
		d=$("#datepicker").val();
		if (d !="") {
			console.log("test");
			endDate =d;
			console.log("myDate:" + endDate);
			var ed = endDate.split("-");
			var sd = new Date(ed[0], ed[1] - 1, ed[2]);
			sd.setDate(sd.getDate() - range);
			startDate =getTimeString(sd);
		}

		$("#Date").text("Trend Chart - From:" + startDate + " To: " + endDate);
		//$.getJSON("scripts/milkdata.json", draw);
		empty = draw(json);
		if (empty == false) {
			$("svg").remove();
			alert("No data in the selected period!");
		}
	});

});

//code adapted from D3 Line chart example at http://bl.ocks.org/benjchristensen/2579599
function draw(info) {
	$("svg").remove();
	var width = $(window).width();
	var margin = {
		top : 20,
		right : 50,
		bottom : 80,
		left : 50
	};
	width = width - margin.left - margin.right;
	var height = 300 - margin.top - margin.bottom;
	var parseDate = d3.time.format("%Y-%m-%d").parse;

	//timestamp form of the startDate and endDate
	var sdts = getTimeStamp(startDate);
	var edts = getTimeStamp(endDate);

	var x = d3.time.scale().range([0, width]);

	var y = d3.scale.linear().range([height, 0]);
	if (range == 2) {
		var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(2);
	} else if (range == 6) {
		var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(6);
	} else {
		var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(10);
	}

	var yAxis = d3.svg.axis().scale(y).orient("left");

	var line = d3.svg.line().x(function(d) {
		return x(d.date);
	}).y(function(d) {
		return y(d.close);
	});

	var svg = d3.select("#graph").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var date1 = "";
	var ts;
	var data = [];
	var flag = 0;
	$.each(info, function(key, value) {
		$.each(value, function(k, v) {
			if (k == "Date") {
				$.each(v, function(k1, v1) {
					date1 = timeConverter(v1);
					var date1ts = getTimeStamp(date1);

					if (date1ts >= sdts && date1ts <= edts) {
						ts = v1;
					} else {
						flag = 1;
					}
				});
				if (flag == 0) {
					return true;
				} else {
					flag = 0;
					return false;
				}

			}
			if (k == "BMCC") {
				var d = {
					date : parseDate(date1),
					close : v,
					timestamp : ts
				};
				data.push(d);
				return true;
			}
		});
	});
	if (data.length == 0) {
		return false;
	}
	data.sort(function(a, b) {
		return a.timestamp - b.timestamp;
	});
	x.domain(d3.extent(data, function(d) {
		return d.date;
	}));
	y.domain(d3.extent(data, function(d) {
		return d.close;
	}));

	//code doing diagonal x axis labels adapted from http://www.d3noob.org/2013/01/how-to-rotate-text-labels-for-x-axis-of.html
	svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis).selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", function(d) {
		return "rotate(-65)";
	});

	svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("BMCC");

	svg.append("path").datum(data).attr("class", "line").attr("d", line);

	return true;
}


$(window).on("resize", function() {
	$("svg").remove();
});
//code adapted from http://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
function timeConverter(UNIX_timestamp) {
	var a = new Date(UNIX_timestamp);
	var year = a.getFullYear();
	var month = ((a.getMonth() + 1) < 10 ? '0' + (a.getMonth() + 1) : (a.getMonth() + 1) );
	var date = (a.getDate() < 10 ? '0' + a.getDate() : a.getDate());
	var time = year + '-' + month + '-' + date;
	return time;
}

//transform the timeString with format "yyyy-mm-dd" to Unix timestamp
function getTimeStamp(timeString) {
	var dates = timeString.split("-");
	var date = new Date(dates[0], dates[1] - 1, dates[2]);
	var timestamp = date.getTime();
	return timestamp;
}

function getTimeString(dateObj){
	var year = dateObj.getFullYear();
	var month = ((dateObj.getMonth() + 1) < 10 ? '0' + (dateObj.getMonth() + 1) : (dateObj.getMonth() + 1) );
	var date = (dateObj.getDate() < 10 ? '0' + dateObj.getDate() : dateObj.getDate());
	var time = year + '-' + month + '-' + date;
	return time;
}