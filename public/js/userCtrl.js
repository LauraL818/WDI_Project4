(function(){
  angular.module('allMovies')
    .controller('User', UserCtrl)

    function UserCtrl(user, auth){
      var vm = this;

      function handleRequest(res){
        var token = res.data ? res.data.token : null;
        console.log(res);
        if (token){
          console.log('JWT:', token);
        };
        vm.message = res.data.message;
      }

      vm.login = function() {
        user.login(vm.email, vm.password)
          .then(handleRequest, handleRequest);
      }

      vm.register = function() {
        user.register(vm.email, vm.password)
          .then(handleRequest, handleRequest);
      }

      vm.getUsers = function() {
        user.getUsers()
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
