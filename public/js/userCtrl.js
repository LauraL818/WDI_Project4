(function(){
  angular.module('allMovies')
    .controller('UserController', UserCtrl)
    .directive('profileChart', profileChart)

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
        console.log(res.data)
        if(res.data){
          vm.message = res.data.message;
          vm.user = res.data.user
          vm.id = res.data.user._id
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

      vm.getUserMovies = function(){
        user.movies().success(function(results){
          vm.userMovies = results.movies
          ///////////// DATA FOR D3 CHARTS ///////////////////////////
          vm.revenues = []
          vm.budgets = []
          vm.ratings = []
          /////////// FOR LOOP TO GET DATA FOR D3 CHARTS/////////////
          for(var i = 0; i<vm.userMovies.length; i++){
            vm.revenues.push(vm.userMovies[i].revenue)
            vm.budgets.push(vm.userMovies[i].budget)
            vm.ratings.push(vm.userMovies[i].rating)
          }
        })
      }

      vm.removeMovie = function(){
        user.remove().success(function(results){
          console.log(results)
        })
      }
    }

    function profileChart(){
      var directive = {
        restrict:'EA',
          scope: {
            revenue: '@',
            rating:'@',
            budget:'@'
          },
          link: function(scope,el){
            /////////// START CONVERTING STRING DATA INTO INTEGERS////////////
              var rev = scope.revenue.replace(/((\[)|(\]))/g,"").split(",")
              var revenue = []
              for(var i=0; i < rev.length; i++){
                revenue.push(parseInt(rev[i]))
              }

              var bud = scope.budget.replace(/((\[)|(\]))/g,"").split(",")
              var budget = []
              for(var i=0; i < bud.length; i++){
                budget.push(parseInt(bud[i]))
              }

              var rat = scope.rating.replace(/((\[)|(\]))/g,"").split(",")
              var rating = []
              for(var i=0; i < rat.length; i++){
                rating.push(parseInt(rat[i]))
              }
                ///////////////////// END CONVERTING DATA //////////////////

                ///////////////////// START D3 BAR CHART //////////////////
                      var svg = d3.select("#profile")
                                    .append("svg")
                                    .attr("width", 900)
                                    .attr("height", 900)

                      var group = svg.selectAll("g")
                          .data(rating)
                          .enter()
                          .append("g")

                          group.append("rect")
                            .attr("width", "20px")
                            .attr("fill", "green")
                            .attr("height", function(d) {
                              return d + "px";
                            })
                            .attr("x", function(d, i) {
                              return i * 60;
                            })
                  ///////////////////// END D3 BAR CHART //////////////////
            }
      }
      return directive
    }



})()
