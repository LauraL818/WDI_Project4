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

    vm.update = function(id, data){
      return $http.patch('/users/' + id, data)
    }

    vm.movies = function(){
      return $http.get('/users/profile/movies')
  }

    vm.remove = function(id){
      return $http.delete('/users/profile/movies', {body: id})
  }

  }
})()
