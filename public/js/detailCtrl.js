(function(){
  angular.module('allMovies')
    .controller('DetailController', DetailController)

    DetailController.$inject = ['user','$stateParams']

    function DetailController(user,$stateParams){
      var vm = this
      vm.title = 'Detail Controller'
      // vm.editable = false

      // userService.show($stateParams.id).success(function(results){
      //   console.log(results)
      // })

    }

})()
