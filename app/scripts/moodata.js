
moment.lang('en', {
    monthsShort : [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]
});

moment.lang('en', {
    monthsShort : function (momentToFormat, format) {
        if (/^MMMM/.test(format)) {
            return nominative[momentToFormat.month()];
        } else {
            return subjective[momentToFormat.month()];
        }
    }
});


window.onNotificationGCM = function(e){
switch(e.event){
case "registered":
if (e.regid.length > 0){
  console.log("reg id: ["+e.regid+"]");
}
break;
default:
break;

 }
};

var app = angular.module('moodata', [ 'ionic','ngRoute', 'ngAnimate']);
 
// app.config(['$compileProvider', function ($compileProvider){
//   // Needed for routing to work
//   $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
// }]);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $routeProvider.when('/', { 
    templateUrl: 'signin.html',
    controller: 'SigninCtrl'
  });

  $routeProvider.when('/signin', { 
    templateUrl: 'signin.html',
    controller: 'SigninCtrl'
  });

  $routeProvider.when('/dashboard', {
    templateUrl: 'app.html',
    controller: 'DashboardCtrl'
  });

  $routeProvider.when('/report/:reportId', {
    templateUrl: 'report.html',
    controller:'ReportCtrl'
  });

  // $routeProvider.otherwise({
  //   redirectTo: '/signin'
  // });

}]);


app.factory('User', function() { 
  
  var user = {};

  return {

    get: function(){
        return user;
    },

    set: function(data){
      user = data;
      return user;
    }
    

  }
});

app.factory('Reports', ['$http', function($http) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var reports = [];

  $http({method: 'GET', url: 'https://moodata.herokuapp.com/milkdata'}).
      
      success(function(data, status, headers, config) {
        
        data.forEach(function(d){ 
          if (reports){
            
            d.Date.moment = window.moment(d.Date.$date.toString().slice(0,-3),'X');
            
            window.last_date = d.Date.moment;

            d.Date.month = moment.months(d.Date.moment.month()).slice(0,3);
            d.Date.day = d.Date.moment.date();
            d.Date.full_date = d.Date.moment.calendar();

            reports.push(d);  

          }
        });

        reports.sort(function(a,b){
          return b.Date.moment > a.Date.moment;
        });

        }).
        error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          console.log(status);
          console.log(data);
        });

  return {
    all: function() {

      return reports;
    
    },
    last_thirty: function(){

      return reports.slice(0,30);

    } ,
    clear: function(){
      reports = [];
      this.refresh();
    },
    get: function(reportId) {
      // Simple index lookup
      console.log("GO GO GADGET");
      for (var i=0; i<reports.length; i++ ) {
        if (reports[i]._id.$oid == reportId){
          console.log(reports[i]);
          return reports[i];
        }
      }

      return reports[reportId];
    },
    refresh: function(){
      console.log("REFRESHING");
      var reports = [];
      $http({method: 'GET', url: 'https://moodata.herokuapp.com/milkdata'}).
      
      success(function(data, status, headers, config) {
        
        data.forEach(function(d){ 
          if (reports && reports.length < 20){
            
            d.Date.moment = window.moment(d.Date.$date.toString().slice(0,-3),'X');
            
            window.last_date = d.Date.moment;

            d.Date.month = moment.months(d.Date.moment.month()).slice(0,3);
            d.Date.day = d.Date.moment.date();
            d.Date.full_date = d.Date.moment.calendar();

            reports.push(d);  

          }
        });

      }).
      error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          console.log(status);
          console.log(data);
      });

  }
}}]);

app.controller('SigninCtrl', ['$scope','$http', '$location', 'User', function($scope, $http, $location, User){


  $scope.login = function(){

    var package = { "username": this.user.email, "password":this.user.pass };

    console.log(this);
    console.log($scope);
    console.log(package);

    $http({'method':'POST', 'url':'http://moodata.herokuapp.com/app_login', 'data' :JSON.stringify(package) } ).
      
      success(function(data, status, headers, config) {
        User.set(data);
        $location.path('/dashboard');

        var pushNotification = window.plugins.pushNotification; 

        function log (e){console.log(e)}

        pushNotification.register(
          log, 
          log,
          {'senderID': "620831868836", "ecb": "onNotificationGCM"} 
        );

      }).
      error(function(data, status, headers, config) {
        alert("Login has failed, please enter your credentials again");
        $scope.mooPassword = "";
      });
  }


}]);

app.controller('DashboardCtrl', ['User','Reports', '$scope', function(User, Reports, $scope){

  $scope.reports = Reports.last_thirty();

  $scope.refresh = function(){
    console.log(this);
    this.reports.forEach(function(d){ d = null });
    console.log(this);
    Reports.refresh();
    this.reports = Reports.last_thirty();
    this.refresh.time = moment().calendar();
  }

  $scope.farmer = User.get();
  
}]);

app.controller('ReportCtrl', ['$scope','$routeParams' , 'Reports', function($scope, $routeParams, Reports){
  console.log("REPORTING IN"+$routeParams.reportId);
  $scope.report = Reports.get($routeParams.reportId);
}]);

app.controller('TrendsCtrl', ['$scope', 'Reports', function($scope, Reports){
  
  console.log("LETS GO REPORT");
  

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
  
   var sd, ed, startDate, endDate, range, json, empty;
   var parameter="BMCC";
      var today = new Date();
      endDate = getTimeString(today);
      range = 6;
      var ed = endDate.split("-");
      var sd = new Date(ed[0], ed[1] - 1, ed[2]);
      sd.setDate(sd.getDate() - range);
      startDate = getTimeString(sd);
      console.log(startDate);
      
  $scope.periods=[
        {
        	name:"3 days",
        	value:"2"
        },
        {
        	name:"week",
        	value:"6"
        },
        {
        	name:"month",
        	value:"30"
        },
        {
        	name:"year",
        	value:"364"
        }
    ];
  
  $scope.setRange = function(period) {
        $scope.selected = period;
        range=period.value;
    }

  $scope.isSelected = function(period) {
        return $scope.selected === period;
  }
  
  $scope.paras=[
  {
  	name:"BMCC",
  	value:"BMCC"
  },
  {
  	name:"Milkfat",
  	value:"Milkfat"
  },
  {
  	name:"Volume",
  	value:"Volume"
  },
  {
  	name:"Temperature",
  	value:"Temp"
  },
  {
  	name:"Total Plate Count",
  	value:"Total Plate Count"
  },
  {
  	name:"True Protein",
  	value:"True Protein"
  }
  ];
  
  
  $scope.setParameter = function(para) {
        $scope.selected2 = para;
        parameter=para.value;
    }

  $scope.isSelected2 = function(para) {
        return $scope.selected2 === para;
  }
	
	
  $scope.genChart = function(){
    console.log("GEN CHART!")
       
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
            reports = Reports.all();
            console.log("reports");
            console.log(reports);

            empty = draw(reports);
            if (empty == false) {
              $("svg").remove();
              alert("No data in the selected period!");
            }

            //code adapted from D3 Line chart example at http://bl.ocks.org/benjchristensen/2579599
        function draw(info) {
          console.log("STARTING TO DRAW!");
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

            var date1 = "";
            var ts,pm;
            var data = [];
            var flag = 0;
            var flag2=0;
            console.log(info);
            $.each(info, function(key, value) {
              console.log(key +" "+ value);
              $.each(value, function(k, v) {
                if (k == "Date") {
                  $.each(v, function(k1, v1) {
                    console.log(k1 + " " + v1);
                    if (k1 == "$date"){
                      date1 = timeConverter(v1);
                      var date1ts = getTimeStamp(date1);

                      if (date1ts >= sdts && date1ts <= edts) {
                        ts = v1;
                        flag2+=1;
                      } else {
                        flag = 1;
                      }
                    }
                  });
                  if (flag == 0) {
					return true;
				} else {
					flag=0;
					return false;
				}
                }
                if (k == parameter) {
                  pm=v;
                  flag2+=1;
                }
                if (flag2 == 2) {
                var d = {
                    date : parseDate(date1),
                    close : pm,
                    timestamp : ts
                  };
                	data.push(d);
                    return false;
                }
              });
              flag2=0;
            });
            if (data.length == 0) {
              return false;
            }
            data.sort(function(a, b) {
              return a.timestamp - b.timestamp;
            });
            
            var data1=data.slice(0);
            data1.sort(function(a, b) {
              return a.close - b.close;
            });
            var last=data1.length-1;
            
            var x = d3.time.scale().range([0, width]);

            var y = d3.scale.linear().range([height, 0]);
            if (range == 2) {
              var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(2);
            } else if (range == 6) {
              var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(6);
            } else {
              var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(10);
            }
            
            x.domain(d3.extent(data, function(d) {
              return d.date;
            }));
            y.domain([data1[0].close,data1[last].close]);
            
            var yAxis = d3.svg.axis().scale(y).orient("left");

            var line = d3.svg.line().x(function(d) {
              return x(d.date);
            }).y(function(d) {
              return y(d.close);
            });

            var svg = d3.select("#graph").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
            //code doing diagonal x axis labels adapted from http://www.d3noob.org/2013/01/how-to-rotate-text-labels-for-x-axis-of.html
            svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis).selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", function(d) {
              return "rotate(-65)";
            });

            svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text(parameter);

            svg.append("path").datum(data).attr("class", "line").attr("d", line);

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
  }
}


}]);




 
