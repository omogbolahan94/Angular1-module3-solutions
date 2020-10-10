(function () {
  'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .directive('foundItems', FoundItems)
  .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

  
  //DIRECTIVE FUNCTION(DDO => Directive Difinition Object)
  function FoundItems() {
    let ddo = {
      
      templateUrl: 'foundItems.html',
      scope: {
        items: '<', 
        onRemove: '&',
        //onError: '&',
        searchedTerm: '@'
      },
      controller:  foundItemsDirectiveController, //THIS DIRECTIVE WILL HAVE ACCESS TO ITS CONTROLLER METHOD 
      controllerAs: 'list',
      bindToController: true,
      transclude: true
    }
    return ddo;
  }

  //this direcive controller has no methods(the "list" varibale in it is just an instance of the DirectiveController)
  function foundItemsDirectiveController() {
    let list = this; 
  }

  
  //CONTROLLER FUNCTION THAT HAS SERVICE INJECTED INTO IT
  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    let ctrl = this;

    ctrl.searchTerm = "";

    ctrl.menu = function (searchTerm) {
      let promise = MenuSearchService.getMatchedMenuItems(searchTerm);
      
      promise.then( function(response) {
        var foundItems = response.data["menu_items"];
        ctrl.found = [];
        console.log(foundItems)
        if (searchTerm !== "" ) {
          for(var i=0; i < foundItems.length; i++) {
            let description = foundItems[i].description;
            if (description.toLowerCase().indexOf(searchTerm) !== -1) {
              ctrl.found.push(foundItems[i]);
            }
          }
        // } else {
        //     ctrl.errorFunc = function (searchTerm, found) {
        //       if (searchTerm === "") {
        //         console.log("error");
        //         return "Nothing found";
        //       }
        //   } 
        }
      })
      .catch( function(error) {
          console.log("Something went wrong. Check your connection");
      })
    }

    //the itemIndex parameter is passed the onRomve property of the directive scope  since it is a callback to this property
    ctrl.removeItem = function (itemIndex) {
      ctrl.found.splice(itemIndex, 1);
    };

  } //end of controller function

  
  
  //SERVICE FUNCTION THAT MAKES THE HTTP CALLS(so i hyave to inject the $http objct to make the API call)
  MenuSearchService.$inject = ['$http', 'ApiBasePath'];
  function MenuSearchService($http, ApiBasePath)  {
    let service = this

    service.getMatchedMenuItems = function (searchTerm) {
      var response = $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json"),//ApiBasePath + "/menu_items.json?category=searchTerm"
        // params: {
        //   category: searchTerm
        // }
      });
        
      return response; //$http function returns a promise
      
    }; //end of getMatchedMenuItems method

  }//end of MenuSearchService function

})();