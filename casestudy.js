var app = angular.module("caseStudyApp", ['ngMaterial']);
app.service('caseStudyService', function() {
	/*function for removing HTML tags from string*/
	this.removeTags = function(q) {
		var x = q.replace(/<\/?[^>]+(>|$)/g, "");
		x = x.replace(/&nbsp;/gi,'');
		return x;
	};
});
app.controller('caseStudyController', function($scope, $http, $mdDialog, caseStudyService) {

		/*variables*/
		$scope.name = "Jombay";
		$scope.CompanyName = true;
		$scope.WelcomeMessage = false;
		$scope.QuestionLayout = false;
		$scope.currentQno = 0;
		var questionArray = [];

		/*request parameters for Access Token API call*/
		var params = {	
            scope: "user",
            grant_type: "password",
            client_id: "4874eafd0f7a240625e59b2b123a142a669923d5b0d31ae8743f6780a95187f5",
            client_secret: "908f6aee4d4cb27782ba55ae0c814bf43419f3220d696206212a29fe3a05cd88",
            auth_token: "azd4jXWWLagyb9KzgfDJ"
        };

        /*HTTP POST call to get Access Token*/
        $http({
        	method: 'POST',
			url: 'https://simulationapi.ur-nl.com/oauth/token.json',
			header: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: params,	
        }).then(function (response) {
        	$scope.accessToken = response.data.access_token;
        }).catch(function (response) {
            $scope.error = "Unable to fetch Access Token";
        });

        /*HTTP GET call to fetch questions*/
        $scope.fetchQuestions = function() {
        	$http({
	        	method: 'GET',
	        	url: 'https://simulationapi.ur-nl.com/case_study/companies/58cba141ba169e0eab2657c9/company_case_studies/595c859eba169ec47e4f20d4/user_company_case_studies/595ce021ba169edb9c733e90?include[company_case_study][include]=questions',
	        	headers: { 
	        				'Authorization': 'Bearer ' + $scope.accessToken,
	        				'Content-Type': 'application/json' 
	        			}
		        }).then(function (response) {

		        	$scope.questions = response.data.user_company_case_study.company_case_study.questions;

		        	angular.forEach($scope.questions, function(item){
		        		questionArray.push(caseStudyService.removeTags(item.body));
		        	});

		        	$scope.questionArray = questionArray;
		        	$scope.CompanyName = false;
		        	$scope.QuestionLayout = false
		        	$scope.WelcomeMessage = true;
		        	$scope.displayMessage = "Welcome to Jombay Case Study!";

		        }).catch(function (response) {
		        	$scope.error = "Unable to fetch Questions";
	        });
        }

        /*onclick function for displaying repective question*/
        $scope.displayQuestion = function(no) {
        	$scope.CompanyName = false;
        	$scope.WelcomeMessage = false;
        	$scope.QuestionLayout = true;
        	$scope.currentQno = no-1;
        	$scope.question = questionArray[no - 1];
        }

        /*onclick function for next button*/
        $scope.goToNext = function() {
        	$scope.currentQno = $scope.currentQno + 1;
        	$scope.question = questionArray[$scope.currentQno];
        }

        /*onclick function for previous button*/
        $scope.goToPrevious = function() {
        	$scope.currentQno = $scope.currentQno - 1;
        	$scope.question = questionArray[$scope.currentQno];
        }

        /*onclick function for submit button*/
        $scope.submitAnswers = function(e) {
        	 var confirm = $mdDialog.confirm()
		          .title('Are you sure you want to exit the case study? ')
		          .textContent('You will not be able to attempt the case study again.')
		          .targetEvent(e)
		          .ok('Submit!')
		          .cancel('Cancel');
           $mdDialog.show(confirm);
        }


});
