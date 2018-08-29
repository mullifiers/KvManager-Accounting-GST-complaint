(function ()
{
    'use strict';

    angular
        .module('app.invoices')
        .controller('ProductController', ProductController);

    /** @ngInject */
    function ProductController($document,msApi,$mdDialog,$state,$http, Product,api,Categories)
    {
        var vm = this;

        // Data
        vm.saveProduct=function() {
               api.listfiles[$state.params.rid].update({_id:$state.params.pid},vm.product,function(err,d){
                   console.log(d);
                   console.log(err);
               })
        }
        console.log(vm.product)
        vm.deleteProduct=function(ev) {
            var confirm = $mdDialog.confirm()
                            .title('Delete '+vm.product.name+' Product Permanently? ')
                            .ariaLabel('remove this product')
                            .targetEvent(ev)
                            .ok('Confirm')
                            .cancel('Cancel');
                            
            $mdDialog.show(confirm).then(function() {
                api.remove({_id:vm.product.id},function(err){
                        console.log(err)
                });
            }, function() {})
            
        }

        vm.checkGstn = function (gst) {

        var factor = 2, sum = 0, checkCodePoint = 0, i, j, digit, mod, codePoint, cpChars, inputChars;
        cpChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        inputChars = gst.trim().toUpperCase();

        mod = cpChars.length;
        for (i = inputChars.length - 1; i >= 0; i = i - 1) {
            codePoint = -1;
            for (j = 0; j < cpChars.length; j = j + 1) {
                if (cpChars[j] === inputChars[i]) {
                    codePoint = j;
                }
            }

            digit = factor * codePoint;
            factor = (factor === 2) ? 1 : 2;
            digit = (digit / mod) + (digit % mod);
            sum += Math.floor(digit);
        }
        checkCodePoint = ((mod - (sum % mod)) % mod);

        return gst + cpChars[checkCodePoint];
    };
    


        vm.taToolbar = [
            ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote', 'bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
            ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent', 'html', 'insertImage', 'insertLink', 'insertVideo', 'wordcount', 'charcount']
        ];
        vm.product = Product[0]
        console.log(Product[0])
        vm.categories =Categories.list;
        vm.categoriesSelectFilter = '';
        vm.ngFlowOptions = {    
            // You can configure the ngFlow from here
            /*target                   : 'api/media/image',
             chunkSize                : 15 * 1024 * 1024,
             maxChunkRetries          : 1,
             simultaneousUploads      : 1,
             testChunks               : false,
             progressCallbacksInterval: 1000*/
        };
        vm.ngFlow = {
            // ng-flow will be injected into here through its directive
            flow: {}
        };
        vm.dropping = false;

        // Methods
        vm.gotoProducts = gotoProducts;
        vm.onCategoriesSelectorOpen = onCategoriesSelectorOpen;
        vm.onCategoriesSelectorClose = onCategoriesSelectorClose;
        vm.fileAdded = fileAdded;
        vm.upload = upload;
        vm.fileSuccess = fileSuccess;

        //////////

        init();

        /**
         * Initialize
         */
        function init()
        {
            // Select the correct product from the data.
            // This is an unnecessary step for a real world app
            // because normally, you would request the product
            // with its id and you would get only one product.
            // For demo purposes, we are grabbing the entire
            // json file which have more than one product details
            // and then hand picking the requested product from
            // it.
            var id = $state.params.id;

            for ( var i = 0; i < vm.product.length; i++ )
            {
                if ( vm.product[i].id === parseInt(id) )
                {
                    vm.product = vm.product[i];
                    break;
                }
            }
            // END - Select the correct product from the data
        }

        /**
         * Go to products page
         */
        function gotoProducts()
        {
            $state.go('app.invoices.products',{},{reload:true});
        }

        /**
         * On categories selector open
         */
        function onCategoriesSelectorOpen()
        {
            // The md-select directive eats keydown events for some quick select
            // logic. Since we have a search input here, we don't need that logic.
            $document.find('md-select-header input[type="search"]').on('keydown', function (e)
            {
                e.stopPropagation();
            });
        }

        /**
         * On categories selector close
         */
        function onCategoriesSelectorClose()
        {
            // Clear the filter
            vm.categoriesSelectFilter = '';

            // Unbind the input event
            $document.find('md-select-header input[type="search"]').unbind('keydown');
        }

        /**
         * File added callback
         * Triggers when files added to the uploader
         *
         * @param file
         */
        function fileAdded(file)
        {
            // Prepare the temp file data for media list
            var uploadingFile = {
                id  : file.uniqueIdentifier,
                file: file,
                type: 'uploading'
            };

            // Append it to the media list
            vm.product.images.unshift(uploadingFile);
        }

        /**
         * Upload
         * Automatically triggers when files added to the uploader
         */
        function upload()
        {
            // Set headers
            vm.ngFlow.flow.opts.headers = {
                'X-Requested-With': 'XMLHttpRequest',
                //'X-XSRF-TOKEN'    : $cookies.get('XSRF-TOKEN')
            };

            vm.ngFlow.flow.upload();
        }

        /**
         * File upload success callback
         * Triggers when single upload completed
         *
         * @param file
         * @param message
         */
        function fileSuccess(file, message)
        {
            // Iterate through the media list, find the one we
            // are added as a temp and replace its data
            // Normally you would parse the message and extract
            // the uploaded file data from it
            angular.forEach(vm.product.images, function (media, index)
            {
                if ( media.id === file.uniqueIdentifier )
                {
                    // Normally you would update the media item
                    // from database but we are cheating here!
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(media.file.file);
                    fileReader.onload = function (event)
                    {
                        media.url = event.target.result;
                    };

                    // Update the image type so the overlay can go away
                    media.type = 'image';
                }
            });
        }
    }
})();