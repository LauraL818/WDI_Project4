(function(){
  angular.module('allMovies')
    .service('auth', authService)

    authService.$inject = ['$window']

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
})()
