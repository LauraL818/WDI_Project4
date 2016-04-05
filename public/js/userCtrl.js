(function(){
  angular.module('allMovies')
    .controller('User', UserCtrl)

    UserCtrl.$inject = ['user', 'auth', '$stateParams']

    function UserCtrl(user, auth, $stateParams){
      var vm = this;

      function handleRequest(res){
        var token = res.data ? res.data.token : null;
        console.log(res);
        if (token){
          console.log('JWT:', token);
        };
        vm.message = res.data.message;



        // If user found hit show route
        if(res.data.id){
          vm.id = res.data.id
          user.show(vm.id).success(function(results){
            console.log(results)
          })
        }




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

      vm.edit = function(){
          vm.editing = true
          vm.editingUser = {
            email: user.email
          }
        }

      vm.update = function(){
        console.log($stateParams)
        user.update($stateParams.id).success(function(results){
          vm.editing = false
          vm.user = results.user
          console.log(results)
        })
      }

    }

})()
