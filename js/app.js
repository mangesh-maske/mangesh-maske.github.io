angular.module('payApp',[
    'ui.router',
    'ngAnimate',
])
.config(['$stateProvider','$urlRouterProvider','$httpProvider','$locationProvider',function($stateProvider, $urlRouterProvider,$httpProvider ,$locationProvider){
    $httpProvider.interceptors.push('httpInterceptor');
    $locationProvider.html5Mode(true);        
    $urlRouterProvider.otherwise('/');    
    $locationProvider.hashPrefix('');
    
    $stateProvider
    .state('home',{
        url:'/',
        pageTrack:'/home',
        views:{
            'content': {
                templateUrl: 'pages/home.html',
                controller: "appCtrl"
            }
        }
    })

    .state('balance',{
        url:'/balance',
        pageTrack:'/balance',
        views:{
            'content': {
                templateUrl: 'pages/balance.html',
                controller: "appCtrl"
            }
        }
    })
}])

.controller('appCtrl',['$scope','$state', function($scope,$state){
    
}])
