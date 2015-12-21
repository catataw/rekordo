/**
 * Angular Route controller
 *  
 * */
// Module INI.
var angularRoutingApp = angular.module('angularRoutingApp', ['ngRoute']);

// routes settings
angularRoutingApp.config(function($routeProvider) {

    $routeProvider
        .when('/', {
            templateUrl : '../../views/home.html',
            controller  : 'mainController'
        })
        .when('/faq', {
            templateUrl : '../../views/faq.html',
            controller  : 'faqController'
        })
        .when('/help', {
            templateUrl : '../../views/help.html',
            controller  : 'helpController'
        })
        .when('/contact', {
            templateUrl : '../../views/contact.html',
            controller  : 'contactController'
        })
        .when('/tx/:id', {
            templateUrl : '../../views/txdetails.html',
            controller  : 'txdetailsController'
        })
        .when('/store/:hash', {
        	templateUrl : '../../views/store.html',
        	controller	: 'storeController'
        })
        .otherwise({
            redirectTo: '/'
        });
});

angularRoutingApp.controller('mainController', function($scope) {
    $scope.message = 'Drop files here or click for select.';
});
angularRoutingApp.controller('faqController', function($scope) {
    $scope.message = 'Frequently Asked Questions';
});
angularRoutingApp.controller('helpController', function($scope) {
    $scope.message = 'Help & How is the registration system in the blockchain?';
});
angularRoutingApp.controller('contactController', function($scope) {
    $scope.message = 'Send your FeedBack or Contact us';
});
angularRoutingApp.controller('txdetailsController', function($scope, $routeParams, $http) {
	function hex2a(hex) {
	    var str = '';
	    for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
	    return str;
	}
    $scope.txid = $routeParams.id
    $http.get("../api/tx/" + $routeParams.id)
    	.success(function(response) {
    		$scope.tx = response;
    		$scope.opReturn = {};
    		$scope.outputs = []
    			
    		angular.forEach($scope.tx.vout, function(value){
    			if (value.scriptPubKey.type==='nulldata'){
    				$scope.opReturn.asm = value.scriptPubKey.asm
    				var hex = value.scriptPubKey.hex.replace('6a40','')
    				$scope.opReturn.hex = hex2a(hex) 
    				
    			}
    			else {
    				$scope.outputs.push(value);
    			}
    		})
    		
    		});
});
angularRoutingApp.controller('storeController', function($scope, $routeParams, $http) {
	
    $http.get("/api/query/" + $routeParams.hash)
    
		.success(function(response) {
			$scope.data = response;
			var status = $scope.data.status
			var qruri = 'bitcoin:' + $scope.data.address + '?amount=' + $scope.data.amount /100000000
			/*text variables*/
			// 1.- If a document is new or exist in the database but was not paid. 
			var status00 = '<p>If you want, this document can be permanently inserted in the blockchain.</p>'
			var status01 = '<p>Please, send: <strong>' +  $scope.data.amount/100000000  + ' BTC</strong>, to address: <strong>' + $scope.data.address + '</strong> or Scan the QR code. When the request paid is confirmed the document: ' + $scope.data.document + ' , will be inserted.</p>'
			// 2.- The request was paid, the transaction is waiting for be send. 
			var status1 = '<p>The document: <strong>' + $scope.data.document + ' was paid and a transaction will be sent by our system, please wait some seconds.</p>'
			var status2 = '<p>The document: <strong>' + $scope.data.document + '</strong> can be part of the next block, inside of transaction: ' +  $scope.data.tx  +', please wait some minutes.</p>'
			// 3.- The request is completed, transaction is confirmed and was inserted in a block
			var status30 = '<p>This document is already registered in the blockchain &nbsp; <i style="color:#1D9D74;" class="fa fa-check-square fa-lg"></i></p>'
			var status31 = '<p>The hash: <strong>'+ $scope.data.document  + '</strong> was inserted correctly in the transaction:</p>'
			var status32 = '<p>Txid: <a href="#/tx/'+ $scope.data.tx +'">' + $scope.data.tx + '</a></p>'
			var status33 = '<p>Included in the Block: <a>'+ $scope.data.block +'</a></p>'
			// [error].- If error
			var statusErr = '<p>Something is wrong, please refresh or go to home. If the problem persist, send a feedback. Thank you for your patience'
			
			// select status 
				switch (status) {
			case 0:
				$('#block').html(status00 + status01)
				initialRes = 
				new QRCode(document.getElementById("qrcode"), qruri);
				break;
			case 1:
				$('#QRBlock').removeClass('col-md-4 col-sm-6')
				$('#txtBlock').removeClass('col-md-8 col-sm-6').addClass('col-md-12 col-sm-12')
				$('#block').html(status1)
				break;
			case 2:
				$('#QRBlock').removeClass('col-md-4 col-sm-6')
				$('#txtBlock').removeClass('col-md-8 col-sm-6').addClass('col-md-12 col-sm-12')
				$('#block').html(status2)
				break;
			case 3:
				$('#QRBlock').removeClass('col-md-4 col-sm-6')
				$('#txtBlock').removeClass('col-md-8 col-sm-6').addClass('col-md-12 col-sm-12')
				$('#block').html(status30 + status31 + status32 + status33)
				break;
			default:
				$('#block').html(statusErr)
			}

	});
});



