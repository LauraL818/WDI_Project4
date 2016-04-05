(function(){
  angular.module('allMovies')
    .service('movieService', movieService)

    movieService.$inject = ['$http']

    function movieService($http){
      var service = {
        index: index,
        show: show,
        find: find
      }
      return service

      function index(){
        return $http.post('/movies')
      }

      function show(id){
        return $http.post('/movies/' + id)
      }

      function find(movie){
        return $http.post('/movies/search/movie', {query:movie})
      }
    }

})()
