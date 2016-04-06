(function(){
  angular.module('allMovies')
    .controller('GlobalController', GlobalController)

    GlobalController.$inject = ['user', 'auth']

    function GlobalController(user,auth){
      var vm = this;

      vm.loginUser = {}

      function handleRequest(res){
        var token = res.data ? res.data.token : null;
        console.log(res);
        if (token){
          console.log('JWT:', token);
        }
          vm.user = res.data.user

      }

      vm.login = function() {
        user.login(vm.loginUser.email, vm.loginUser.password)
          .then(handleRequest, handleRequest);
      }

      vm.register = function() {
        user.register(vm.registerUser.email, vm.registerUser.password)
          .then(handleRequest, handleRequest);
      }

      vm.logout = function() {
        auth.logout && auth.logout();
        vm.message = 'You are logout now';
      }

      vm.isAuthed = function() {
        return auth.isAuthed ? auth.isAuthed() : false;
      }
    }

})()
