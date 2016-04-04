(function(){
  angular.module('allMovies', ['ui.router'])
      .config(['$stateProvider', '$urlRouterProvider', mainRouter])
      .factory('authInterceptor', authInterceptor)
      .service('user', userService)
      .service('auth', authService)
      .config(function($httpProvider){
        $httpProvider.interceptors.push('authInterceptor');
      })
      // .controller('User', UserCtrl);

      // function UserCtrl(user, auth){
      //   var vm = this;
      //
      //   function handleRequest(res){
      //     var token = res.data ? res.data.token : null;
      //     console.log(res);
      //     if (token){
      //       console.log('JWT:', token);
      //     };
      //     vm.message = res.data.message;
      //   }
      //
      //   vm.login = function() {
      //     user.login(vm.email, vm.password)
      //       .then(handleRequest, handleRequest);
      //   }
      //
      //   vm.register = function() {
      //     user.register(vm.email, vm.password)
      //       .then(handleRequest, handleRequest);
      //   }
      //
      //   vm.getUsers = function() {
      //     user.getUsers()
      //       .then(handleRequest, handleRequest);
      //   }
      //
      //   vm.logout = function() {
      //     auth.logout && auth.logout();
      //     vm.message = 'You are logout now';
      //   }
      //
      //   vm.isAuthed = function() {
      //     return auth.isAuthed ? auth.isAuthed() : false;
      //   }
      // }

////////////////////////USER SERVICE///////////////////////
      function userService($http){
        var vm = this

        vm.login = function(email, password){
          return $http.post('auth/authenticate', {
            email: email,
            password: password
          })
        }

      vm.register = function(email, password){
          return $http.post('auth/register', {
            email: email,
            password: password
          })
      }

      vm.getUsers = function(email, password){
        return $http.get('/users');
        }
      }

////////////////////////AUTH SERVICE///////////////////////
      function authService($window){
        var vm = this

        vm.parseJwt = function(token) {
         var base64Url = token.split('.')[1];
         var base64 = base64Url.replace('-', '+').replace('_', '/');
         return JSON.parse($window.atob(base64));
       }

        vm.saveToken = function(token){
          $window.localStorage['jwtToken'] = token
      }

        vm.getToken = function() {
            return $window.localStorage['jwtToken']
          }

        vm.isAuthed = function() {
          var token = vm.getToken()
          if(token) {
            var params = vm.parseJwt(token)
            return Math.round(new Date().getTime() / 1000) <= params.exp
          } else {
            return false
          }
        }
        vm.logout = function() {
          $window.localStorage.removeItem('jwtToken')
        }
      }

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
      .state('home', {
        url:'/',
        templateUrl:'partials/home.html'
      })
      .state('movie', {
        url:'/movie',
        templateUrl:'partials/movie.html'
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
        url:'/profile',
        templateUrl:'partials/profile.html'
      })
    }
})()
