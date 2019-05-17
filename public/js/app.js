angular.module('shopApp',[
    'ui.router',
    'ngResource',
    'ui.bootstrap',
    'ngAnimate',
    'ngStorage'
])
.constant('APP_CONST', {
    APP_API : 'http://localhost:3005'
})
.factory('httpInterceptor', ['$localStorage',
    function($localStorage) {
        return {
            request: function(config) {
                config.headers = config.headers || {};

                if ($localStorage.token)
                    config.headers['Autherization'] = $localStorage.token;

                return config;
            },
            /* response: function(response) {
                return response || $q.when(response);
            },
            'responseError': function(rejection) {
                var toastr = $injector.get('toastr');
                // var $state = $injector.get('$state');

                if (rejection.status === 401) {
                    // handle the case where the user is not authenticated
                    toastr.error('You are not authenticated');
                    // Erase the tokens
                    delete $localStorage.token;
                    delete $localStorage.type;
                    //$state.go('login');
                    $window.location = '/';
                } else if (rejection.status === 403) {
                    // user is not authorized
                    toastr.error('You are not authorized to perform this operation');
                } else {
                    toastr.error('Unable to process request');
                }
                return $q.reject(rejection);
            } */
        };
    }
])
  
.factory('AppService', ['$resource','APP_CONST','$localStorage', function($resource,APP_CONST,$localStorage) {
        
    return {
        getProducts: function() {
            return $resource(APP_CONST.APP_API + '/products');
        },
        addProduct: function() {
            return $resource(APP_CONST.APP_API + '/products');
        },
        loginUser: function() {
            return $resource(APP_CONST.APP_API + '/user/login');
        },
        signupUser: function() {
            return $resource(APP_CONST.APP_API + '/user/signup');
        },
        isUserloggedIn: function(){
            if($localStorage.token){
                return true;
            } else {
                return false;
            }   
        },
        deleteProductById:function(id){
            return $resource(APP_CONST.APP_API + '/products/:id',{id:id});
        }
        /* page: function() {
            return $resource(APP_CONST.APP_API + '/cms/getCmsContent/:slug');
        } */
        /* getCousineTypes: function() {
            return $resource(APP_CONST.APP_API + '/public/cuisinelist');
        } */
    }
}])
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
                templateUrl: 'modules/pages/views/home.html',
                controller: "appCtrl"
            },
            'header': {
                templateUrl: 'modules/shared/views/header.html'
            },
            'footer': {
                templateUrl: 'modules/shared/views/footer.html'
            }
        }
    })

    .state('product',{
        url:'/products',
        pageTrack:'/products',
        views:{
            'content': {
                templateUrl: 'modules/product/views/product-list.html',
                controller: "appCtrl"
            },
            'header': {
                templateUrl: 'modules/shared/views/header.html'
            },
            'footer': {
                templateUrl: 'modules/shared/views/footer.html'
            }
        }
    })

    .state('order',{
        url:'/orders',
        pageTrack:'/orders',
        views:{
            'content': {
                templateUrl: 'modules/order/views/order-list.html',
                controller: "appCtrl"
            },
            'header': {
                templateUrl: 'modules/shared/views/header.html'
            },
            'footer': {
                templateUrl: 'modules/shared/views/footer.html'
            }
        }
    })

}])

.controller('appCtrl',['$scope','$uibModal','AppService','$rootScope','$localStorage','$window','$state', function($scope, $uibModal,AppService,$rootScope,$localStorage,$window,$state){
    $rootScope.isUserloggedIn = AppService.isUserloggedIn();
    $scope.products ={};

    var getProductsData = function(){
        AppService.getProducts().get(function(response) {
            if (response.code == 200) {
                console.log('response.products',response.products);
                $scope.products = response.products;
            } else {
                console.log(response);
            }
        });
    }

    getProductsData();
    
    // function to open Add Product modal
    $scope.openAddProductDialouge = function(record) {
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            size:'md',
            templateUrl: 'modules/product/views/add-product.html',
            backdrop: 'static',
            resolve: {},
            controller: 'productCtrl'
        });
        modalInstance.result.then(function(){}, function(){})
    };

    // function to open Login modal
    $scope.openLoginDialouge = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            size:'md',
            templateUrl: 'modules/user/views/login.html',
            backdrop: 'static',
            resolve: {},
            controller: 'loginCtrl'
        });
        modalInstance.result.then(function(){}, function(){})
    };

    $scope.deleteProduct = function(productId){
        AppService.deleteProductById(productId).delete(function(response) {
            if (response.code == 200) {
                $state.go('product');
            }
        })
    }

    //function to logout user
    $scope.logOut = function(){
        delete $localStorage.token;
        $state.go('product');
        // $window.location = '/';
    }
}])

.controller('productCtrl',['$scope','$uibModalInstance','AppService','$state', function($scope,$uibModalInstance,AppService,$state){
    // function to close form modal
    $scope.closeDialouge = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.addProduct = function(product){
        AppService.addProduct().save(product, function(response) {
            if (response.code == 200) {
                $state.go('product');
                // $scope.productForm.$setPristine();
                // $scope.productForm.$setUntouched(); // reset validation
                // $scope.submitLoading = false;
                // toastr.success(response.message);
            } else {
                console.log('error',response);
                // $scope.whiteLabelSignupForm.$setPristine();
                // $scope.whiteLabelSignupForm.$setUntouched(); // reset validation
                // $scope.submitLoading = false;
                //toastr.error(response.message);
            }
        });
        $uibModalInstance.dismiss('cancel');
    };
}])

.controller('loginCtrl',['$scope','$uibModal','$uibModalInstance','AppService','$localStorage','$window','$state', function($scope,$uibModal,$uibModalInstance,AppService,$localStorage,$window,$state){
    // function to close form modal
    $scope.closeDialouge = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.login = function(user){
        AppService.loginUser().save(user, function(response) {  
            if (response.code == 200) {
                console.log('response',response);
                $localStorage.token = response.token;
                $state.go('order');
                // $scope.loginForm.$setPristine();
                // $scope.loginForm.$setUntouched(); // reset validation
                
                // $scope.submitLoading = false;
                // toastr.success(response.message);
                $uibModalInstance.dismiss('cancel');
                
                // $window.location = '/';
            } else {
                console.log('error',response);
                // $scope.whiteLabelSignupForm.$setPristine();
                // $scope.whiteLabelSignupForm.$setUntouched(); // reset validation
                // $scope.submitLoading = false;
                // toastr.error(response.message);
            }
        });
        
    };

    $scope.openSignupDialouge = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            size:'md',
            templateUrl: 'modules/user/views/signup.html',
            backdrop: 'static',
            resolve: {},
            controller: 'signupCtrl'
        });
        modalInstance.result.then(function(){}, function(){})
    }
}])


.controller('signupCtrl',['$scope','$uibModalInstance','AppService', function($scope,$uibModalInstance,AppService){
    // function to close form modal
    $scope.closeDialouge = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.signup = function(user){
        AppService.signupUser().save(user, function(response) {
            if (response.code == 200) {
                console.log('response',response);
                // $scope.signupForm.$setPristine();
                // $scope.signupForm.$setUntouched(); // reset validation
                // $scope.submitLoading = false;
               //  toastr.success(response.message);
               
                $uibModalInstance.dismiss('cancel');
            } else if(response.code == 409){
                console.log('conflict',response.message);
                // toastr.error(response.message);
            } else{
                console.log(response.message);
                // $scope.submitLoading = false;
                // toastr.error(response.message);
            }
        });
        
    };
}])