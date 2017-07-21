(function () {
'use strict';

angular.module('GrowmatApp', [])
   .controller('ParamController', ParamController)
   .service('ParamService', ParamService)
   .component('spinner', {
      template: '<img ng-if="$ctrl.showSpinner" id="loading-icon" src="img/loading.gif" alt="Loading">',
      controller: SpinnerController
   })


ParamController.$inject = ['ParamService', '$rootScope'];
function ParamController(ParamService, $rootScope) {
   var self = this;
   
   $rootScope.$broadcast('growmat:processing', { on: true });
   ParamService.getParams()
      .then(function (data) {
         self.temperature = data.temperature;
         self.humidity = data.humidity;
         self.luminosity = data.luminosity;
         self.soil = data.soil;
         self.light = data.light;
         self.fan = data.fan;
      })
      .finally(function () {         
         $rootScope.$broadcast('growmat:processing', { on: false });
      });
}

  
ParamService.$inject = ['$http'];
function ParamService($http) {
   
   this.getParams = function () {
      return $http({
         method: 'GET',
         url: ('api/params.json')
      })
      .then(function(response) {
         return response.data;
      })
      .catch(function(error) {
         console.error('Service error: ', error);
      });
   };
}   


SpinnerController.$inject = ['$rootScope'];
function SpinnerController($rootScope) {
   var $ctrl = this;

   $ctrl.showSpinner = true;

   var cancelListener = $rootScope.$on('growmat:processing', function (event, data) {
      if (data.on) {
         $ctrl.showSpinner = true;
      }
      else {
         $ctrl.showSpinner = false;
      }
   });

   $ctrl.$onDestroy = function () {
      cancelListener();
   };
}   


})();