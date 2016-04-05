(function(){
  angular.module('allMovies')
    .controller('DetailController', DetailController)

    DetailController.$inject = ['user','$stateParams']

    function DetailController(user,$stateParams){
      var vm = this
      vm.title = 'Detail Controller'

      vm.editable = true

      // vm.email = user.email
      // console.log(vm.email)

    }

})()
