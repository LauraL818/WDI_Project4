(function(){
  angular.module('allMovies')
    .controller('UserController', UserController)
    .directive('profileChart', profileChart)

    UserController.$inject = ['user', 'auth', '$stateParams']

    function UserController(user, auth, $stateParams){
      var vm = this;
      vm.analyze = false
      // function handleRequest(res){
      //   var token = res.data ? res.data.token : null;
      //   console.log(res);
      //   if (token){
      //     console.log('JWT:', token);
      //   };
      //   // Set user and user id based on user that is sent back
      //   console.log(res.data)
      //   if(res.data){
      //     vm.message = res.data.message;
      //     vm.user = res.data.user
      //     vm.id = res.data.user._id
      //   }
      // }
      //
      // vm.login = function() {
      //   user.login(vm.email, vm.password)
      //     .then(handleRequest, handleRequest);
      // }
      //
      // vm.register = function() {
      //   user.register(vm.email, vm.password)
      //     .then(handleRequest, handleRequest);
      // }
      //
      // vm.logout = function() {
      //   auth.logout && auth.logout();
      //   vm.message = 'You are logout now';
      // }
      //
      // vm.isAuthed = function() {
      //   return auth.isAuthed ? auth.isAuthed() : false;
      // }

      vm.show = function(){
        vm.show = true
        user.show($stateParams.id).success(function(results){
          vm.user = results
        })
      }

      vm.edit = function(){
          vm.editing = true
          vm.editingUser = {
            email: vm.email
          }
        }

      vm.update = function(){
        user.update($stateParams.id,  vm.editingUser).success(function(results){
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

      vm.removeMovie = function(film){
        console.log(film)
        user.remove(film._id).success(function(results){
          var index = vm.userMovies.indexOf(film)
          vm.userMovies.splice(index,1)
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
                revenue.push(parseInt(rev[i])/10)
              }

              var bud = scope.budget.replace(/((\[)|(\]))/g,"").split(",")
              var budget = []
              for(var i=0; i < bud.length; i++){
                budget.push(parseInt(bud[i])/10)
              }

              var rat = scope.rating.replace(/((\[)|(\]))/g,"").split(",")
              var rating = []
              for(var i=0; i < rat.length; i++){
                rating.push(parseInt(rat[i]))
              }
              ///////////////////////// END CONVERTING DATA ////////////////////

              ///////////////////////// DATA FOR SCATTER PLOT //////////////////
              var dataset = []
              for(var i = 0; i < rating.length; i ++){
                var arr = []
                arr.push(rating[i])
                arr.push(budget[i])
                arr.push(revenue[i])
                dataset.push(arr)
              }
              // dataset.push(rating)
              // dataset.push(budget)
              // dataset.push(revenue)
              // console.log(arr)
              console.log(dataset)
              ///////////////////////// END SCATTER PLOT //////////////////////

              //////////////////////// START D3 SCATTER PLOT /////////////////////
              var w = 1200;
              var h = 200;

              var svg = d3.select("#scatter")
                          .append("svg")
                          .attr("width", w)
                          .attr("height", h)

              var xScale = d3.scale.linear()
                            .domain([0, d3.max(dataset, function(d){ return d[1] }) + 10])
                            .range([0, w])

              var yScale = d3.scale.linear()
                            .domain([0, d3.max(dataset, function(d){ return d[2] }) + 10])
                            .range([0, h])


              svg.selectAll("circle")
                .data(dataset)
                .enter()
                .append("circle")
                .attr("cx", function(d){
                  return xScale(d[1])
                })
                .attr("cy", function(d){
                  return yScale(d[2])
                })
                .attr("r", function(d){
                  return d[0] * 2
                })

                svg.selectAll("text")
                  .data(dataset)
                  .enter()
                  .append("text")
                  .text(function(d) {
                        return d[0]
                   })
                   .attr("x", function(d) {
                        return xScale(d[1])
                   })
                   .attr("y", function(d) {
                        return yScale(d[2])
                   })
                   .attr("font-family", "sans-serif")
                   .attr("font-size", "11px")
                   .attr("fill", "white");








              //////////////////////// START D3 BAR CHART /////////////////////
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
              // ///////////////////////// END D3 BAR CHART //////////////////
            }
      }
      return directive
    }



})()
