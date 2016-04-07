(function(){
  angular.module('allMovies')
    .controller('UserController', UserController)
    .directive('profileChart', profileChart)

    UserController.$inject = ['user', 'auth', '$stateParams', '$window']

    function UserController(user, auth, $stateParams, $window){
      var vm = this;
      vm.analyze = false

      vm.getUserMovies = function(){
        user.movies().success(function(results){
          vm.userMovies= null
          vm.revenues = []
          vm.budgets = []
          vm.revAdj = []
          vm.revBud = []
          vm.ratings = []
          vm.titles = []
          vm.userMovies = results.movies

          /////////// FOR LOOP TO GET DATA FOR D3 CHARTS/////////////
          for(var i = 0; i<vm.userMovies.length; i++){
            vm.revenues.push(vm.userMovies[i].revenue)
            vm.budgets.push(vm.userMovies[i].budget)
            vm.revAdj.push(vm.userMovies[i].revenue/10)
            vm.revBud.push(vm.userMovies[i].budget/10)
            vm.ratings.push(vm.userMovies[i].rating)
            vm.titles.push(vm.userMovies[i].title)
          }
        })
      }

      vm.display = function(){
        vm.active = true
        // console.log($window.localStorage.currentUser)
        // console.log($stateParams.id)
        user.display($window.localStorage.currentUser).success(function(results){
          vm.user = results
          console.log(results)
        })
      }

      vm.edit = function(){
          vm.active = true
          vm.editing = true
          vm.editingUser = {
            email: vm.email
          }
        }

      vm.update = function(){
        user.update($window.localStorage.currentUser,  vm.editingUser).success(function(results){
          vm.editing = false
          vm.email = results.email
          vm.user = results
        })
      }

      vm.delete = function(){
        user.delete($window.localStorage.currentUser).success(function(results){
          $window.localStorage.removeItem('currentUser')
          $window.localStorage.removeItem('jwtToken')
        })
      }

      vm.removeMovie = function(film){
        user.remove(film._id).success(function(results){
          var index = vm.userMovies.indexOf(film)
          vm.userMovies.splice(index,1)
        })
      }

      vm.getBarChart = function(){
        vm.analyze = true
        vm.getUserMovies()
        vm.data = {
          labels: vm.titles,
          datasets: [
            {
              label: 'Revenue',
              fillColor: 'rgba(255,255,255,0.7)',
              strokeColor: 'rgba(54,23,23,0.8)',
              highlightFill: 'rgba(99,43,43,0.75)',
              highlightStroke: 'rgba(54,23,23,1)',
              data: vm.revAdj
            },
            {
              label: 'Budget',
              fillColor: 'rgba(99,43,43,0.7)',
              strokeColor: 'rgba(54,23,23,0.8)',
              highlightFill: 'rgba(255,255,255,0.75)',
              highlightStroke: 'rgba(54,23,23,1)',
              data: vm.revBud
            }
          ]
        }

        vm.options =  {
          responsive: true,
          scaleBeginAtZero : true,
          scaleShowGridLines : true,
          scaleGridLineColor : "rgba(0,0,0,.05)",
          scaleGridLineWidth : 1,
          barShowStroke : true,
          barStrokeWidth : 2,
          barValueSpacing : 5,
          barDatasetSpacing : 1
        }

        var ctx1 = document.querySelector("#chartjs").getContext("2d")
        var myBarChart1 = new Chart(ctx1).Bar(vm.data, vm.options)

      }
    }

    function profileChart(){
      var directive = {
        restrict:'EA',
          scope: {
            revenue: '@',
            rating:'@',
            budget:'@',
            title:'@'
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

              var t = scope.title.replace(/((\[)|(\]))/g,"").split(",")
              var title = []
              for(var i=0; i < rat.length; i++){
                title.push(t[i].replace(/["']/g, ""))
              }

              ///////////////////////// END CONVERTING DATA ////////////////////

              ///////////////////////// DATA FOR SCATTER PLOT //////////////////
              var dataset = []
              for(var i = 0; i < rating.length; i ++){
                var arr = []
                arr.push(rating[i])
                arr.push(budget[i])
                arr.push(revenue[i])
                arr.push(title[i])
                dataset.push(arr)
              }

              ///////////////////////// END SCATTER PLOT //////////////////////

              //////////////////////// START D3 SCATTER PLOT /////////////////////
              var w = 1200
              var h = 450

              var padding = 60

              console.log(scope.revenue)

                var svg = d3.select("#scatter")
                            .append("svg")
                            .attr("width", w)
                            .attr("height", h)

                var tooltip = d3.select("svg")
                            .append("text")
                            .attr("class", "tooltip")
                            .style("opacity", 0)
                            .style("text-anchor","end")
                            .attr("startOffset","100%")
                            .attr("fill", "black")

                var rScale = d3.scale.linear()
                             .domain([0, d3.max(dataset, function(d) { return d[0] })])
                             .range([2, 20]);

                var xScale = d3.scale.linear()
                              .domain([0, d3.max(dataset, function(d){ return d[1] }) + 10])
                              .range([padding, w - padding * 2])

                var yScale = d3.scale.linear()
                              .domain([0, d3.max(dataset, function(d){ return d[2] })])
                              .range([h - padding, padding])

                var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(8)

                var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .ticks(8)


                var circles = svg.selectAll("circle")
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
                    return rScale(d[0])
                  })
                  .attr("fill", "#E8A8A8")
                  .style("opacity", 1)
                  .style('stroke', '#632B2B')
                  .style('stroke-width', '3')

                circles.on("mouseover", function(d) {
                        circles.style("opacity", .1)
                        tooltip.transition()
                            .duration(200)
                            .style("opacity", 1);
                        tooltip.text(d[3])
                            .attr("x", xScale(d[1]))
                            .attr("y", yScale(d[2]))

                    })
                  .on("mouseout", function(d) {
                       circles.style("opacity", 1)
                       tooltip.transition()
                           .duration(200)
                           .style("opacity", 0);
                   })

                    svg.append("text")
                        .attr("class", "x label")
                        .attr("text-anchor", "end")
                        .attr("x", w/2)
                        .attr("y", h - 6)
                        .text("Budget")

                    svg.append("text")
                       .attr("transform", "rotate(-90)")
                       .attr("y", 0)
                       .attr("x",0 - (h / 2))
                       .attr("dy", "1em")
                       .style("text-anchor", "middle")
                       .text("Revenue");

                     svg.append("g")
                       .attr("class", "axis")
                       .attr("transform", "translate(0," + (h - padding) + ")")
                       .call(xAxis)

                     svg.append("g")
                         .attr("class", "axis")
                         .attr("transform", "translate(" + padding + ",0)")
                         .call(yAxis)

              // var svg = d3.select("#scatter")
              //             .append("svg")
              //             .attr("width", w)
              //             .attr("height", h)
              //
              // var tooltip = d3.select("svg")
              //             .append("text")
              //             .attr("class", "tooltip")
              //             .style("opacity", 0)
              //             .style("text-anchor","end")
              //             .attr("startOffset","100%")
              //             .attr("fill", "black")
              //
              // var rScale = d3.scale.linear()
              //              .domain([0, d3.max(dataset, function(d) { return d[0] })])
              //              .range([2, 20]);
              //
              // var xScale = d3.scale.linear()
              //               .domain([0, d3.max(dataset, function(d){ return d[1] }) + 10])
              //               .range([padding, w - padding * 2])
              //
              // var yScale = d3.scale.linear()
              //               .domain([0, d3.max(dataset, function(d){ return d[2] })])
              //               .range([h - padding, padding])
              //
              // var xAxis = d3.svg.axis()
              //     .scale(xScale)
              //     .orient("bottom")
              //     .ticks(8)
              //
              // var yAxis = d3.svg.axis()
              //     .scale(yScale)
              //     .orient("left")
              //     .ticks(8)
              //
              //
              // var circles = svg.selectAll("circle")
              //   .data(dataset)
              //   .enter()
              //   .append("circle")
              //   .attr("cx", function(d){
              //     return xScale(d[1])
              //   })
              //   .attr("cy", function(d){
              //     return yScale(d[2])
              //   })
              //   .attr("r", function(d){
              //     return rScale(d[0])
              //   })
              //   .attr("fill", "grey")
              //   .style("opacity", 1)
              //   .style('stroke', 'black')
              //   .style('stroke-width', '3')
              //
              // circles.on("mouseover", function(d) {
              //         circles.style("opacity", .1)
              //         tooltip.transition()
              //             .duration(200)
              //             .style("opacity", 1);
              //         tooltip.text(d[3])
              //             .attr("x", xScale(d[1]))
              //             .attr("y", yScale(d[2]))
              //
              //     })
              //   .on("mouseout", function(d) {
              //        circles.style("opacity", 1)
              //        tooltip.transition()
              //            .duration(200)
              //            .style("opacity", 0);
              //    })
              //
              //     svg.append("text")
              //         .attr("class", "x label")
              //         .attr("text-anchor", "end")
              //         .attr("x", w/2)
              //         .attr("y", h - 6)
              //         .text("Budget")
              //
              //     svg.append("text")
              //        .attr("transform", "rotate(-90)")
              //        .attr("y", 0)
              //        .attr("x",0 - (h / 2))
              //        .attr("dy", "1em")
              //        .style("text-anchor", "middle")
              //        .text("Revenue");
              //
              //      svg.append("g")
              //        .attr("class", "axis")
              //        .attr("transform", "translate(0," + (h - padding) + ")")
              //        .call(xAxis)
              //
              //      svg.append("g")
              //          .attr("class", "axis")
              //          .attr("transform", "translate(" + padding + ",0)")
              //          .call(yAxis)

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
