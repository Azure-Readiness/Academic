(function() {

    function mainController($http) {
        this.$http = $http;
        this.analysis = {
            inProgress: false
        };
        this.images = [];
        this.loadImageList();
    }
    mainController.prototype = {

        imageFileSelected: function(file) {
            var ctrl = this, formData;
            ctrl.analysis = {
                inProgress: true
            };
            formData = new FormData();
            formData.append('imageFile', file);
            ctrl.$http
                .post('/api/image-upload', formData, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .then(function(result) {
                    ctrl.analysis = {
                        inProgress: false,
                        result: result.data
                    };
                    ctrl.loadImageList();
                })
                .catch(function(err) {
                    ctrl.analysis = {
                        inProgress: false,
                        error: err.data || { message: err.statusText }
                    };
                });
        },

        loadImageList: function() {
            var ctrl = this;
            ctrl.$http.get('/api/images')
                .then(function(result) {
                    ctrl.images = result.data.entries || [];
                })
                .catch(function(err) {
                    alert(err.toString());
                });
        }
    };

    function fileContentBinderDirective() {
        return {
            restrict: 'A',
            scope: {
                onFileSelected: '&'
            },
            link: function(scope, element) {
                element.on('change', function() {
                    scope.$apply(function() {
                        scope.onFileSelected({
                            file: element[0].files[0]
                        });
                    });
                });
            }
        };
    }

    angular
        .module('myApp', [])
        .controller('mainCtrl', ['$http', mainController])
        .directive('onFileSelected', [fileContentBinderDirective]);

}());

