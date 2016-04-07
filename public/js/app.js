(function(){
  angular.module('allMovies', ['ui.router','tc.chartjs'])
      .config(['$stateProvider', '$urlRouterProvider', mainRouter])
      .factory('authInterceptor', authInterceptor)
      .config(function($httpProvider){
        $httpProvider.interceptors.push('authInterceptor');
      })

////////////////////////AUTH INTERCEPTOR///////////////////////

        function authInterceptor(auth){
          return {
            request: function(config){
              var token  = auth.getToken()
              if(token){
                config.headers['x-access-token'] = token;
              }
              return config
            },
            response: function(res){
               if(res.data.token){auth.saveToken(res.data.token)}
               return res
            }
          }
        }

////////////////////////UI ROUTER STATES///////////////////////
    function mainRouter($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/')

    $stateProvider
      .state('movie', {
        url:'/',
        templateUrl:'partials/movie.html',
        controller:'MovieController as movies'
      })
      .state('dashboard', {
        url:'/movie/:id',
        templateUrl:'partials/dashboard.html',
        controller:'InfoController as info'
      })
      .state('login', {
        url:'/login',
        templateUrl:'partials/login.html'
      })
      .state('signup', {
        url:'/signup',
        templateUrl:'partials/signup.html'
      })
      .state('profile', {
        url:'/users/:id',
        templateUrl:'partials/profile.html',
        controller:'UserController as user'
      })

    }
})()
