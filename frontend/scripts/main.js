var app = angular.module("rainyDay", []);

app.controller("mainCtrl", ['$scope', '$http', function($scope, $http) {
	$scope.week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
	$scope.phoneNum;
	$scope.activeDay = [false, false, false, false, false];
	$scope.userTimes = [];

	$scope.submit = function() {
		for (var i = 0; i < 5; i++) {
			if (!$scope.activeDay[i]) {
				$scope.userTimes[i] = '';
			}
		}
		var requestBody = {
			recipient	: $scope.phoneNum,
			data		: $scope.userTimes
		};

		console.log(requestBody);
		
		$http({
			method	: "POST",
			url		: "localhost:3000/",
			data	: requestBody
		}).then(function mySuccess(response) {
			console.log(response);
		}, function myError(response) {
			console.log(response);
		});
	}

}]);