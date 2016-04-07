(function(){
  angular.module('allMovies')
    .controller('GlobalController', GlobalController)

    GlobalController.$inject = ['user', 'auth','$state', '$window']

    function GlobalController(user,auth,$state, $window){
      var vm = this;

      vm.loginUser = {}

      function handleRequest(res){
        var token = res.data ? res.data.token : null;
        console.log(res);
        if (token){
          console.log('JWT:', token);
        }
          console.log(res)
          $window.localStorage['currentUser'] = res.data.user._id
          vm.user = res.data.user

      }

      vm.login = function() {
        user.login(vm.loginUser.email, vm.loginUser.password)
          .then(handleRequest, handleRequest)
          $state.go('movie')
      }

      vm.register = function() {
        user.register(vm.registerUser.email, vm.registerUser.password)
          .then(handleRequest, handleRequest)
      }

      vm.logout = function() {
        auth.logout && auth.logout();
        $window.localStorage.removeItem('currentUser')
      }

      vm.isAuthed = function() {
        return auth.isAuthed ? auth.isAuthed() : false;
      }

    }

})()
