
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


var app = angular.module('moodata', ['ngRoute','ngResource']);
 
app.controller('DashboardCtrl', ['$scope', '$http', function($scope, $http){
  



  $scope.refresh = function(){

    $scope.reports = [];
    
    $http({method: 'GET', url: 'https://moodata.herokuapp.com/milkdata'}).
    success(function(data, status, headers, config) {
      console.log("SUCCESS");
      console.log(status);
      data.forEach(function(d){ 
        if ($scope.reports && $scope.reports.length < 10){
          

          console.log(window.moment(d.Date.$date.toString().slice(0,-3),'X'));

          d.Date.moment = window.moment(d.Date.$date.toString().slice(0,-3),'X');
          
          window.last_date = d.Date.moment;

          d.Date.month = moment.months(d.Date.moment.month()).slice(0,3);
          d.Date.day = d.Date.moment.date();

          $scope.reports.push(d);  

        }
      });

    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      console.log(status);
      console.log(data);
    });





    if (!$scope.reports){
      console.log("REFRESH THIS COW!");
      $scope.refresh();
    }

    console.log($scope.report);
  }

}]);

app.controller('TrendsCtrl', ['$scope', '$http', function($scope, $http){

}]);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/', {controller:CreateCtrl, templateUrl:'signin.html'}).
      // when('/edit/:projectId', {controller:EditCtrl, templateUrl:'detail.html'}).
      when('/dashboard', {controller:'DashboardCtrl', templateUrl:'dashboard.html'}).
      when('/trends', {controller:'TrendsCtrl', templateUrl:'trends.html'}).
      otherwise({redirectTo:'/'});
  }]);

 
function CreateCtrl($scope) {
  // $scope.save = function() {
  //   Projects.add($scope.project, function() {
  //     $timeout(function() { $location.path('/'); });
  //   });
  // }
}
 
