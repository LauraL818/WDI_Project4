(function(){
  angular.module('allMovies')
    .controller('User', UserCtrl)

    UserCtrl.$inject = ['user', 'auth']

    function UserCtrl(user, auth){
      var vm = this;

      function handleRequest(res){
        var token = res.data ? res.data.token : null;
        console.log(res);
        if (token){
          console.log('JWT:', token);
        };

        // Set user and user id based on user that is sent back
        vm.message = res.data.message;
        vm.user = res.data.user
        vm.id = res.data.user._id
      }

      vm.login = function() {
        user.login(vm.email, vm.password)
          .then(handleRequest, handleRequest);
      }

      vm.register = function() {
        user.register(vm.email, vm.password)
          .then(handleRequest, handleRequest);
      }

      vm.logout = function() {
        auth.logout && auth.logout();
        vm.message = 'You are logout now';
      }

      vm.isAuthed = function() {
        return auth.isAuthed ? auth.isAuthed() : false;
      }

      vm.edit = function(){
        // set new user email variable
          vm.editing = true
          vm.editingUser = {
            email: vm.email
          }
        }

      vm.update = function(){
        user.update(vm.id,  vm.editingUser).success(function(results){
          console.log(results)
          vm.editing = false
          vm.email = results.email
        })
      }
    }

})()
