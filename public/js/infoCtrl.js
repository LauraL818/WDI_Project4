(function(){
  angular.module('allMovies')
    .controller('InfoController', InfoController)

    InfoController.$inject = ['movieService', '$stateParams']
    function InfoController(movieService, $stateParams){
      var vm = this
      vm.title = 'Info Controller'

      vm.getDetails = function(){
        movieService.show($stateParams.id).success(function(results){
          console.log(results)
        })
      }


    }

})()
