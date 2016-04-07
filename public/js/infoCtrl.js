(function(){
  angular.module('allMovies')
    .controller('InfoController', InfoController)
    .directive('d3Chart', d3Chart)


    InfoController.$inject = ['movieService', '$stateParams']
    function InfoController(movieService, $stateParams){
      var vm = this
      vm.title = 'Info Controller'

      vm.getDetails = function(){
        movieService.show($stateParams.id).success(function(results){
          ///////// DECLARE VARIABLES TO BE SENT TO BACK END TO CREATE MOVIE MODEL////////////////

          vm.main = false
          vm.overview = false
          vm.movie = results
          vm.poster = results.poster_path
          vm.details = results.overview
          vm.uneditedDate = results.release_date
          vm.release = moment(vm.uneditedDate).format('MMMM DD, YYYY')
          vm.revenue = Math.floor(results.revenue/1000000)
          vm.rating = results.vote_average
          vm.budget = results.budget/1000000
          vm.title = results.title
          vm.runtime = results.runtime
          vm.id = results.id
          vm.company = results.production_companies[0].name
        })
      }

      vm.showBar = function(){
        vm.bar = true
        vm.data = {
          labels: [""],
          datasets: [
            {
              label: 'Revenue',
              fillColor: 'rgba(255,255,255,0.7)',
              strokeColor: 'rgba(54,23,23,0.8)',
              highlightFill: 'rgba(99,43,43,0.75)',
              highlightStroke: 'rgba(225,225,225,1)',
              data: [vm.revenue]
            },
            {
              label: 'Budget',
              fillColor: 'rgba(99,43,43,0.7)',
              strokeColor: 'rgba(54,23,23,0.8)',
              highlightFill: 'rgba(255,255,255,0.75)',
              highlightStroke: 'rgba(54,23,23,1)',
              data: [vm.budget]
            }
          ]
        }

        vm.options =  {
          responsive: true,
          scaleBeginAtZero : true,
          scaleShowGridLines : true,
          scaleGridLineColor : "rgba(255,255,255,0.5)",
          scaleGridLineWidth : 1,
          scaleFontColor: "white",
          barShowStroke : true,
          barStrokeWidth : 2,
          barValueSpacing : 5,
          barDatasetSpacing : 1
        }

        var ctx = document.querySelector("#bar").getContext("2d")
        var barChart = new Chart(ctx).Bar(vm.data, vm.options)

      }

      vm.addMovie = function(){
        movieService.add({title:vm.title, release:vm.release, poster: vm.poster,overview: vm.details,revenue:vm.revenue,budget: vm.budget,rating: vm.rating,runtime: vm.runtime, id: vm.id}).success(function(results){
          console.log(results)
        })
      }

      vm.findSimilar = function(){
        movieService.similar($stateParams.id).success(function(results){
          vm.similarFilms = results.results
          vm.similarPosters = results.results
          vm.similarPosters = []

          for(var i=0; i < vm.similarFilms.length; i++){
            vm.similarPosters.push(vm.similarFilms[i].poster_path)
          }
        })
      }
    }

    function d3Chart(){
      var directive = {
        restrict:'EA',
          scope: {
            revenue: '@',
            rating:'@',
            budget:'@'
          },
          link: function(scope,el){
            scope.$watch('revenue', function(data) {
              // Watch for scope changes and push new data
              if (data){
                    d3.select("#fill1")
                           .append("svg")
                           .attr("id", "fillgauge1")
                var config = liquidFillGaugeDefaultSettings();
                config.circleColor = "#AB4A4A";
                config.textColor = "black";
                config.waveTextColor = "black";
                config.waveColor = "#AB4A4A";
                config.circleThickness = 0.1;
                config.circleFillGap = 0.2;
                config.textVertPosition = 0.8;
                config.waveAnimateTime = 2000;
                config.waveHeight = 0.3;
                config.waveCount = 1;
                 var gauge1 = loadLiquidFillGauge("fillgauge1", data, config);
               }
            })

            scope.$watch('rating', function(data) {
              if(data){
                 d3.select("#fill2")
                            .append("svg")
                            .attr("id", "fillgauge2")
                 var config1 = newMax();
                  config1.circleColor = "#AB4A4A";
                  config1.textColor = "black";
                  config1.waveTextColor = "#DBDAD8";
                  config1.waveColor = "#AB4A4A";
                  config1.circleThickness = 0.1;
                  config1.textVertPosition = 0.2;
                  config1.waveAnimateTime = 1000;
                  var gauge2= loadLiquidFillGauge("fillgauge2", data, config1);

               }
            })

            scope.$watch('budget', function(data) {
              if(data){
                 d3.select("#fill3")
                            .append("svg")
                            .attr("id", "fillgauge3")
                 var config2 = liquidFillGaugeDefaultSettings();
                  config2.circleColor = "#AB4A4A";
                  config2.textColor = "black";
                  config2.waveTextColor = "black";
                  config2.waveColor = "#AB4A4A";
                  config2.circleThickness = 0.1;
                  config2.circleFillGap = 0.2;
                  config2.textVertPosition = 0.8;
                  config2.waveAnimateTime = 2000;
                  config2.waveHeight = 0.3;
                  config2.waveCount = 1;
                  var gauge3 = loadLiquidFillGauge("fillgauge3", data, config2);
               }
            })
          }
      }
      return directive
    }

//     function d3Graphic(){
//       var directive = {
//         restrict:'EA',
//           scope: {
//             poster: '@'
//           },
//           link: function(scope,el){
//
//             var p = scope.poster.replace(/((\[)|(\]))/g,"").split(",")
//             var poster = []
//             for(var i=0; i < p.length; i++){
//               var post = p[i].replace(/["']/g, "")
//               poster.push("http://image.tmdb.org/t/p/w500"+ post +"")
//             }
//
//             console.log(poster)
//
//
//             var w = 1200
//             var h = 450
//             var width = 60
//             var height = 100
//
//             // var fisheye = d3.fisheye.circular()
//             //               .radius(200)
//             //               .distortion(2);
//
//             var svg = d3.select("#graphic")
//                           .append("svg")
//                           .attr("width", w)
//                           .attr("height", h)
//                           .style("border", "1px solid black");
//
//               svg.selectAll("image")
//                   .data(poster)
//                   .enter()
//                   .append("image")
//                   .attr("xlink:href", function(d){ return d})
//                   .attr("x", function(d, i){ return i + '30px'})
//                   .attr("y", "60")
//                   .attr("width", width)
//                   .attr("height", height)
//
//
//
//       }
//   }
//     return directive
// }

})()
