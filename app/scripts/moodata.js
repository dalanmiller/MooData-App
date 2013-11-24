
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
      var reports = [];
      $http({method: 'GET', url: 'https://moodata.herokuapp.com/milkdata'}).
      
      success(function(data, status, headers, config) {
        
        data.forEach(function(d){ 
          if (reports && $reports.length < 10){
            
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

}]);




 
