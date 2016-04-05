(function(){
  angular.module('allMovies')
    .service('user', userService)

  userService.$inject = ['$http']

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

    vm.show = function(id){
      return $http.get('/users/' + id)
    }

    vm.update = function(id,data){
      return $http.patch('/users/' + id, data)
    }

  }
})()
