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
          vm.ratings = []
          vm.titles = []
          vm.userMovies = results.movies

          /////////// FOR LOOP TO GET DATA FOR D3 CHARTS/////////////
          for(var i = 0; i<vm.userMovies.length; i++){
            vm.revenues.push(vm.userMovies[i].revenue)
            vm.budgets.push(vm.userMovies[i].budget)
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

      vm.getChart = function(){
        vm.analyze = true
        vm.getUserMovies()
        // vm.data = {
        //   labels: vm.titles,
        //   datasets: [
        //     {
        //       label: 'Revenue',
        //       fillColor: 'rgba(255,255,255,0.7)',
        //       strokeColor: 'rgba(54,23,23,0.8)',
        //       highlightFill: 'rgba(99,43,43,0.75)',
        //       highlightStroke: 'rgba(54,23,23,1)',
        //       data: vm.revenues
        //     },
        //     {
        //       label: 'Budget',
        //       fillColor: 'rgba(99,43,43,0.7)',
        //       strokeColor: 'rgba(54,23,23,0.8)',
        //       highlightFill: 'rgba(255,255,255,0.75)',
        //       highlightStroke: 'rgba(54,23,23,1)',
        //       data: vm.budgets
        //     }
        //   ]
        // }
        //
        // vm.options =  {
        //   responsive: true,
        //   scaleBeginAtZero : true,
        //   scaleShowGridLines : true,
        //   scaleGridLineColor : "rgba(0,0,0,.05)",
        //   scaleGridLineWidth : 1,
        //   barShowStroke : true,
        //   barStrokeWidth : 2,
        //   barValueSpacing : 5,
        //   barDatasetSpacing : 1
        // }
        //
        // var ctx1 = document.querySelector("#chartjs").getContext("2d")
        // var myBarChart1 = new Chart(ctx1).Bar(vm.data, vm.options)
        //
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
            scope.$watch('title', function(newValue, oldValue){
              if(newValue != oldValue){
                d3.select("#scatter svg").remove()
                d3.select("#bar svg").remove()
              }

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
                  // var margin = {top: 20, right: 20, bottom: 30, left: 60}
                  // var ww = document.body.clientWidth
                  // var w = ww - margin.left - margin.right
                  // var h = 500 - margin.top - margin.bottom
                  var w = 1200
                  var h = 500
                  var padding = 60

                    var svg = d3.select("#scatter")
                                .append("svg")
                                .attr("width", w)
                                .attr("height", h)

                    var tooltip = d3.select("svg")
                                .append("text")
                                .attr("class", "tooltip")
                                .style("opacity", 0)
                                .style("text-anchor","middle")
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


                    circles.on("click", function(d) {
                            circles.style("opacity", .3)
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
                               .duration(150)
                               .style("opacity", 0);
                       })

                        svg.append("text")
                            .attr("class", "x label")
                            .attr("text-anchor", "start")
                            .attr("x", w/2)
                            .attr("y", h - 6)
                            .text("Budget")

                        svg.append("text")
                           .attr("transform", "rotate(-90)")
                           .attr("y", 0)
                           .attr("x",0 - (h / 2))
                           .attr("dy", "1em")
                           .style("text-anchor", "end")
                           .text("Revenue");

                         svg.append("g")
                           .attr("class", "axis")
                           .attr("transform", "translate(0," + (h - padding) + ")")
                           .call(xAxis)

                         svg.append("g")
                             .attr("class", "axis")
                             .attr("transform", "translate(" + padding + ",0)")
                             .call(yAxis)

                  //////////////////////// START D3 BAR CHART /////////////////////
                          var svg = d3.select("#bar")
                                        .append("svg")
                                        .attr("width", width)
                                        .attr("height", height)

                          var data = dataset

                          var margin = {top: 30, right: 30, bottom: 150, left: 120},
                              width = 600 - margin.left - margin.right,
                              height = 550 - margin.top - margin.bottom;

                          var x = d3.scale.ordinal()
                              .domain(data.map(function(d) { return d[3]; }))
                              .rangeRoundBands([0, width], .1);

                          var y = d3.scale.linear()
                              .domain([0, d3.max(data, function(d) { return d[2]; })])
                              .range([height, 0]);

                          var xAxis = d3.svg.axis()
                              .scale(x)
                              .orient("bottom");

                          var yAxis = d3.svg.axis()
                              .scale(y)
                              .orient("left");

                          var chart = svg.attr("width", width + margin.left + margin.right)
                              .attr("height", height + margin.top + margin.bottom)
                              .append("g")
                              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                          chart.selectAll(".bars")
                                .data(data)
                                .enter()
                                .append("rect")
                                .attr("class", "bar")
                                .attr("x", function(d) { return x(d[3]); })
                                .attr("y", function(d) { return y(d[2]); })
                                .attr("height", function(d) { return height - y(d[2]); })
                                .attr("width", x.rangeBand())
                                .attr("fill", "#913F33")

                          chart.append("g")
                              .attr("class", "y axis")
                              .call(yAxis)

                          // x axis and label
                          chart.append("g")
                              .attr("class", "x axis")
                              .attr("transform", "translate(0," + height + ")")
                              .call(xAxis)
                              .selectAll("text")
                              .style("text-anchor", "end")
                               .attr("dx", "-.8em")
                               .attr("dy", ".15em")
                               .attr("transform", "rotate(-40)" )

                          // chart title
                          chart.append("text")
                           .attr("x", (width / 2))
                           .attr("y", 0 - (margin.top / 2))
                           .attr("text-anchor", "middle")
                           .style("font-size", "16px")
                           .style("text-decoration", "underline")
                           .text("Revenue Breakdown");



                  // ///////////////////////// END D3 BAR CHART //////////////////

            }) // End $watch

          } // End link
      } // End directive
      return directive
    } // End function




})()
