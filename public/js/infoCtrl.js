(function(){
  angular.module('allMovies')
    .controller('InfoController', InfoController)

    InfoController.$inject = ['movieService', '$stateParams']
    function InfoController(movieService, $stateParams){
      var vm = this
      vm.title = 'Info Controller'

      vm.getDetails = function(){
        movieService.show($stateParams.id).success(function(results){
          vm.main = false
          vm.details = false
          vm.overview = false
          vm.movie = results
          vm.uneditedDate = results.release_date
          vm.release = moment(vm.uneditedDate).format('MMMM DD, YYYY')
          console.log(vm.release)
        })
      }


    }

})()
