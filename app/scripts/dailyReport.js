$(document).ready(function() {
	$.getJSON("scripts/milkdata.json", function(data) {
		var items = [];
		$.each(data, function(key, value) {
			$.each(value, function(k, v) {
				if(k=="Date"||k=="_id"){
					$.each(v, function(k1, v1) {
						items[k]=v1;
					});
					return true;
				}
				items[k]=v;
				console.log(k+":"+items[k]);
			});
			if(items["Date"]=="1325376000000"){
				return false;
			}
			else{
				items=[];
			}
		});
		$("#BMCC").text(items["BMCC"]);
		$("#Temp").text(items["Temp"]);
		$("#Volume").text(items["Volume"]);
		$("#Milkfat").text(items["Milkfat"]);
		$("#TotalPlateCount").text(items["Total Plate Count"]);
		$("#PickupTime").text(items["Pickup Time"]);
		$("#TestDate").text(items["Test Date"]);
		$("#TrueProtein").text(items["True Protein"]);
		$("#Date").text("19/11/2013");
		//$("#Date").text("Date:"+items["Date"]);
	});
}); 