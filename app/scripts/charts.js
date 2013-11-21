$(document).ready(function() {
	$.getJSON("scripts/milkdata.json", draw);
});

function draw(info){
	var width=$(window).width();
		var margin = {
			top : 20,
			right : 50,
			bottom : 30,
			left : 50
		};
		width = width - margin.left - margin.right;
		var height = 300 - margin.top - margin.bottom;

		var parseDate = d3.time.format("%Y-%m-%d").parse;

		var x = d3.time.scale().range([0, width]);

		var y = d3.scale.linear().range([height, 0]);

		var xAxis = d3.svg.axis().scale(x).orient("bottom");

		var yAxis = d3.svg.axis().scale(y).orient("left");

		var line = d3.svg.line().x(function(d) {
			return x(d.date);
		}).y(function(d) {
			return y(d.close);
		});

		var svg = d3.select("#graph").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var date1 = "";
		var tm;
		var data = [];
		$.each(info, function(key, value) {
			$.each(value, function(k, v) {
				if (k == "Date") {
					$.each(v, function(k1, v1) {
						date1 = timeConverter(v1);
						tm = v1;
					});
					return true;
				}
				if (k == "BMCC") {
					var d = {
						date : parseDate(date1),
						close : v,
						timestamp : tm
					};
					data.push(d);
					return true;
				}
			});
		});
		data.sort(function(a, b) {
			return a.timestamp - b.timestamp;
		});
		x.domain(d3.extent(data, function(d) {
			return d.date;
		}));
		y.domain(d3.extent(data, function(d) {
			return d.close;
		}));

		svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);

		svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("BMCC");

		svg.append("path").datum(data).attr("class", "line").attr("d", line);
}

$(window).on("resize", function() {
	$("svg").remove();
    $.getJSON("scripts/milkdata.json", draw);
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