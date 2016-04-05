(function(){
  angular.module('allMovies')
    .service('movieService', movieService)

    movieService.$inject = ['$http']

    function movieService($http){
      var service = {
        index: index
      }
      return service

      function index(){
        return $http.post('/movies')
      }
    }

})()
