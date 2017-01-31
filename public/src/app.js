(function () {
'use strict';

angular.module('GrowmatApp', [])
   .controller('ParamController', ParamController)
   .service('ParamService', ParamService);


ParamController.$inject = ['ParamService'];
function ParamController(ParamService) {
   var self = this;
   
   ParamService.getParams()
      .then(function (data) {
         self.temperature = data.temperature;
         self.humidity = data.humidity;
         self.luminosity = data.luminosity;
         self.soil = data.soil;
         self.light = data.light;
         self.fan = data.fan;
      });
}

  
ParamService.$inject = ['$http'];
function ParamService($http) {
   
   this.getParams = function () {
      return $http({
         method: 'GET',
         url: ('api/box_params.json')
      })
      .then(function(response) {
         return response.data;
      })
      .catch(function(error) {
         console.error('Service error: ', error);
      });
   };
}   
   
})();