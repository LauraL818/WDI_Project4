(function(){
  angular.module('allMovies')
    .service('movieService', movieService)

    movieService.$inject = ['$http']

    function movieService($http){
      var service = {
        index: index,
        show: show,
        update: update
      }
      return service

      function index(){
        return $http.post('/movies')
      }

      function show(id){
        return $http.post('/movies/' + id)
      }

      function update(){
        return $http.get('/movies/search')
      }
    }

})()
