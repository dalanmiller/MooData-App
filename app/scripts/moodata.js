
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

var app = angular.module('moodata', [ 'ionic','ngRoute', 'ngAnimate']);
 
// app.config(['$compileProvider', function ($compileProvider){
//   // Needed for routing to work
//   $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
// }]);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $routeProvider.when('/dashboard', {
    templateUrl: 'app.html',
    controller: 'DashboardCtrl'
  });

  $routeProvider.when('/report/:reportId', {
    templateUrl: 'report.html',
    controller:'ReportCtrl'
  });

  $routeProvider.otherwise({
    redirectTo: '/dashboard'
  });

}]);

app.factory('Reports', ['$http', function($http) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var reports = [];

  $http({method: 'GET', url: 'https://moodata.herokuapp.com/milkdata'}).
      
      success(function(data, status, headers, config) {
        
        data.forEach(function(d){ 
          if (reports && reports.length < 10){
            
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

  return {
    all: function() {
      return reports;
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
          if (reports && reports.length < 10){
            
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

app.controller('DashboardCtrl', ['Reports', '$scope', function(Reports, $scope){

  $scope.reports = Reports.all();
  
}]);

app.controller('ReportCtrl', ['$scope','$routeParams' , 'Reports', function($scope, $routeParams, Reports){
  console.log("REPORTING IN"+$routeParams.reportId);
  $scope.report = Reports.get($routeParams.reportId);

}]);

app.controller('TrendsCtrl', ['$scope', 'Reports', function($scope, Reports){

  console.log("LETS GO REPORT");

  $scope.refresh = function(){
      $("#graph svg").remove();
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

      var svg = d3.select("#graph").
        append("svg").
        attr("width", width + margin.left + margin.right).
        attr("height", height + margin.top + margin.bottom).
        append("g").
        attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var date1 = "";
      var tm;
      var data = [];
      $.each(Reports.all(), function(key, value) {
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

      function timeConverter(UNIX_timestamp) {
          var a = new Date(UNIX_timestamp);
          var year = a.getFullYear();
          var month = ((a.getMonth() + 1) < 10 ? '0' + (a.getMonth() + 1) : (a.getMonth() + 1) );
          var date = (a.getDate() < 10 ? '0' + a.getDate() : a.getDate());
          var time = year + '-' + month + '-' + date;
          return time;
      }
  }
  

}]);




 
