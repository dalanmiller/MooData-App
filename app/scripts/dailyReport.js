$(document).ready(function() {
	$.getJSON("scripts/milkdata.json", function(data) {
		var items = [];
		$.each(data, function(key, value) {
			$.each(value, function(k, v) {
				if (k == "Date") {
					$.each(v, function(k1, v1) {
						items[k] = timeConverter(v1);
					});
					return true;
				}
				items[k] = v;
			});
			if (items["Date"] == timeConverter(1325376000000)) {
				return false;
			} else {
				items = [];
			}
		});
		$("#BMCC").text(items["BMCC"]);
		$("#Temp").text(items["Temp"]);
		$("#Volume").text(items["Volume"]);
		$("#Milkfat").text(items["Milkfat"]);
		$("#TotalPlateCount").text(items["Total Plate Count"]);
		$("#PickupTime").text(items["Pickup Time"]);
		var td=items["Test Date"].split("/");
		items["Test Date"]="20"+td[2]+"-"+td[1]+"-"+(td[0]<10?'0'+td[0]:td[0]);
		$("#TestDate").text(items["Test Date"]);
		$("#TrueProtein").text(items["True Protein"]);
		//$("#Date").text("19/11/2013");
		$("#Date").text(items["Date"]);
	});
});

//code adapted from http://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
function timeConverter(UNIX_timestamp) {
	var a = new Date(UNIX_timestamp);
	//var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	var year = a.getFullYear();
	//var month = months[a.getMonth()];
	var month = ((a.getMonth() + 1) < 10 ? '0' + (a.getMonth() + 1) : (a.getMonth() + 1) );
	var date = (a.getDate() < 10 ? '0' + a.getDate() : a.getDate());
	var weekday = weekdays[a.getDay()];
	var hour = (a.getHours() < 10 ? '0' + a.getHours() : a.getHours());
	var min = (a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes());
	var sec = (a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds());
	var time = year + '-' + month + '-' + date + ' ' + weekday + ' ' + hour + ':' + min + ':' + sec;
	return time;
}

