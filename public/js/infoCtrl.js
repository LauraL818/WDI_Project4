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

        })
      }

      vm.addMovie = function(){
        movieService.add({title:vm.title, release:vm.release, poster: vm.poster,overview: vm.details,revenue:vm.revenue,budget: vm.budget,rating: vm.rating,runtime: vm.runtime, id: vm.id}).success(function(results){
          console.log(results)
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
                config.circleColor = "blue";
                config.textColor = "white";
                config.waveTextColor = "white";
                config.waveColor = "blue";
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
                  config1.circleColor = "#FF7777";
                  config1.textColor = "#FF4444";
                  config1.waveTextColor = "#FFAAAA";
                  config1.waveColor = "#FFDDDD";
                  config1.circleThickness = 0.2;
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
                  config2.circleColor = "blue";
                  config2.textColor = "#553300";
                  config2.waveTextColor = "#805615";
                  config2.waveColor = "blue";
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

})()
