(function () {
'use strict';

angular.module('GrowmatApp', [])
   .controller('ParamController', ParamController)
   .service('ParamService', ParamService)
   .constant('ApiBaseUrl', '127.0.0.1:8080');


ParamController.$inject = ['ParamService'];
function ParamController(ParamService) {
   var self = this;
   
   ParamService.getParams()
   .then(function (data) {
      self.temperature = data.temperature;
      self.humidity    = data.humidity;
      self.luminosity  = data.luminosity;
      self.soil        = data.soil;
      self.light       = data.light;
      self.fan         = data.fan;
   });
}

   
ParamService.$inject = ['$http', 'ApiBaseUrl'];
function ParamService($http, ApiBaseUrl) {
   
   this.getParams = function () {
      var response = $http({
         method: 'GET',
         url: (ApiBasePath + '/box_params.json')
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