(function(){
  angular.module('allMovies')
    .controller('MovieController', MovieController)

    MovieController.$inject = ['movieService']

    function MovieController(movieService){
      var vm = this
      vm.title = "Movie Controller"
      vm.searches = false
      console.log('Movie Controller is being used')

      vm.getMovies = function(){
        movieService.index().success(function(results){
          vm.recent = results.results
        })
      }

      vm.findMovie = function(){
        console.log(vm.searchField)
        movieService.find(vm.searchField).success(function(results){
          vm.searchResults = results.results
        })
      }
    }
})()
