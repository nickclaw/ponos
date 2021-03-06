angular.module('scaffold').directive('imageUpload', [
    '$timeout',
    'UploadCache',
    'handle',
    function($timeout, UploadCache, handle) {
        return {
            restrict: "E",
            replace: true,
            templateUrl: '/static/template/directive/image-upload.html',
            scope: {
                ngModel: '='
            },
            link: function($scope, elem, attr) {
                $scope.loading = true;
                $scope.error = "";

                var input = elem.find('input'),
                    image = angular.element(elem[0].querySelector('.image-upload-image'));

                $timeout(function() {
                    $scope.ngModel = $scope.ngModel + " "
                    $scope.loading = false;
                }, 1000);

                $scope.$watch('ngModel', function(value) {
                    if (!value) {
                        value = "";
                    } else {
                        value = "url(" + value +  ")";
                    }

                    angular.element(elem[0].querySelector('.image-upload-image')).css('backgroundImage', value);
                });

                /**
                 * Clear the current image
                 */
                $scope.clear = function() {
                    $scope.src = "";
                    input[0].value = null;
                    render();
                };

                //
                // Normal file upload
                //

                /**
                 * Start the upload flow
                 */
                $scope.upload = function() {
                    input[0].click();
                };

                input.on('change', function(evt) {
                    if (!evt.target.files.length) {
                        return;
                    }

                    upload(evt.target.files[0]);
                });


                //
                // File drop upload
                //
                elem.on('dragover dragleave', function(evt) {
                    evt.stopPropagation();
	                evt.preventDefault();

                    var isDragOver = evt.type === 'dragover';
                    elem[isDragOver ? 'addClass' : 'removeClass']('dragover');
                });

                elem.on('drop', function(evt) {
                    evt.stopPropagation();
	                evt.preventDefault();
                    elem.removeClass('dragover');

                    var files = evt.target.files || evt.originalEvent.dataTransfer.files;

                    if (files.length) upload(files[0]);
                });

                //
                // Upload implementation
                //
                function upload(file) {
                    $scope.loading = true;
                    $scope.ngModel = "";
                    $scope.error = "";
                    $scope.$digest();

                    UploadCache.get('/api/upload/image', file)
                        .then(
                            function(res) {
                                $scope.ngModel = res.data.file;
                            },
                            handle({
                                400: function(res) {
                                    $scope.error = res.data;
                                }
                            })
                        )
                        .finally(function() {
                            $scope.loading = false;
                        });
                }
            }
        };
    }
]);
