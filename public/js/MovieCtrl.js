(function(){
  angular.module('allMovies')
    .controller('MovieController', MovieController)

    function MovieController(){
      var vm = this
      vm.title = "Movie Controller"
      console.log('Movie Controller is being used')
      
    }
})()
