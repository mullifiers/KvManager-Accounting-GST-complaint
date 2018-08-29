(function ()
{
    'use strict';

    angular
        .module('app.ratelists')
        .controller('RatelistDialogController', RatelistDialogController)
    


    /** @ngInject */
    function RatelistDialogController($mdDialog,RatelistServ,api,POS, Ratelist, User, msUtils)
    {
        var vm = this;
        vm.states=POS;
        vm.serv=RatelistServ;
        
        vm.title = 'Edit Ratelist';
        vm.ratelist =Ratelist;
       
        vm.user = User;
        vm.newRatelist = false;
        vm.allFields = false;

        if ( !vm.ratelist )
        {
            
            vm.title = 'New Ratelist';
            vm.newRatelist = true;
        }
        vm.addRatelist = addRatelist;
        vm.saveRatelist = saveRatelist;
        vm.deleteRatelistConfirm = deleteRatelistConfirm;
        vm.closeDialog = closeDialog;
        vm.toggleInArray = msUtils.toggleInArray;
        vm.exists = msUtils.exists;

        //////////

        /**
         * Add new ratelist
         */
        function addRatelist()
        {
            RatelistServ.getList(vm.ratelist);
        }
        /**
         * Save ratelist
         */
        function saveRatelist()
        {
        
            api.ratelists.update({_id:vm.ratelist._id},vm.ratelist,function(err,d){console.log(d)})
            closeDialog();
        }

        /**
         * Delete Ratelist Confirm Dialog
         */
        function deleteRatelistConfirm(ev)
        {
            var confirm = $mdDialog.confirm()
                .title('Are you sure want to delete the ratelist?')
                .htmlContent('<b>' + vm.ratelist.name + ' ' + vm.ratelist.lastName + '</b>' + ' will be deleted.')
                .ariaLabel('delete ratelist')
                .targetEvent(ev)
                .ok('OK')
                .cancel('CANCEL');

            $mdDialog.show(confirm).then(function ()
            {
                
                 api.ratelists.remove({_id:vm.ratelist._id},function(d){console.log(d)})
                //vm.ratelists.splice(vm.ratelists.indexOf(Ratelist), 1);

            });
        }

        /**
         * Close dialog
         */
        function closeDialog()
        {
            $mdDialog.hide();
        }

    }
})();