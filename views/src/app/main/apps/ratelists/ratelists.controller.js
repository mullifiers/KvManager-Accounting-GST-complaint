(function ()
{
    'use strict';

    angular
        .module('app.ratelists')
        .controller('RatelistsController', RatelistsController);

    /** @ngInject */
    function RatelistsController($scope,RatelistServ,$http,port,api,Ratelists,POS, $mdSidenav, User, msUtils, $mdDialog, $document ,$state)
    {
        
        var vm = this;
        
        vm.ratelists = Ratelists;
        vm.user =   {
                    "avatar": "assets/images/avatars/profile.jpg",
                    "starred": [],
                    "frequentRatelists": [],
                    "groups":[]
                    };
        vm.filterIds = null;
        vm.listType = 'all';
        vm.listOrder = 'name';
        vm.listOrderAsc = false;
        vm.selectedRatelists = [];
        vm.newGroupName = '';

        // Methods
        vm.filterChange = filterChange;
        vm.openRatelistDialog = openRatelistDialog;
        vm.deleteRatelistConfirm = deleteRatelistConfirm;
        vm.deleteRatelist = deleteRatelist;
        vm.deleteSelectedRatelists = deleteSelectedRatelists;
        vm.toggleSelectRatelist = toggleSelectRatelist;
        vm.deselectRatelists = deselectRatelists;
        vm.selectAllRatelists = selectAllRatelists;
        vm.deleteRatelist = deleteRatelist;
        vm.addNewGroup = addNewGroup;
        vm.deleteGroup = deleteGroup;
        vm.toggleSidenav = toggleSidenav;
        vm.toggleInArray = msUtils.toggleInArray;
        vm.exists = msUtils.exists;

        //////////

        /**
         * Change Ratelists List Filter
         * @param type
         */
        function filterChange(type)
        {

            vm.listType = type;

            if ( type === 'all' )
            {
                vm.filterIds = null;
            }
            else if ( type === 'frequent' )
            {
                vm.filterIds = vm.user.frequentRatelists;
            }
            else if ( type === 'starred' )
            {
                vm.filterIds = vm.user.starred;
            }
            else if ( angular.isObject(type) )
            {
                vm.filterIds = type.ratelistIds;
            }

            vm.selectedRatelists = [];

        }

        /**
         * Open new ratelist dialog
         *
         * @param ev
         * @param ratelist
         */
        function openRatelistDialog(ratelist)
        {
            $mdDialog.show({
                controller         : 'RatelistDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/apps/ratelists/dialogs/ratelist/ratelist-dialog.html',
                //parent             : angular.element($document.find('#content-container')),
                //targetEvent        : ev,
                clickOutsideToClose: true,
                locals             : {
                    Ratelist : ratelist,
                    User    : vm.user,
                    POS     : POS
                },
               
            });
        }

        /**
         * Delete Ratelist Confirm Dialog
         */
        function deleteRatelistConfirm(ratelist, ev)
        {
            var confirm = $mdDialog.confirm()
                .title('Are you sure want to delete the ratelist?')
                .htmlContent('<b>' + ratelist.name + ' ' + ratelist.lastName + '</b>' + ' will be deleted.')
                .ariaLabel('delete ratelist')
                .targetEvent(ev)
                .ok('OK')
                .cancel('CANCEL');

            $mdDialog.show(confirm).then(function ()
            {

                deleteRatelist(ratelist);
                vm.selectedRatelists = [];

            }, function ()
            {

            });
        }

        /**
         * Delete Ratelist
         */
        function deleteRatelist(ratelist)
        {
             api.ratelists.remove({_id:ratelist._id},function(err){
                        console.log(err)
                        api.load();
                        api.delete(ratelist._id);
                        $state.go('app.ratelists',{},{reload:'app.ratelists'});
                });                           
        }

        /**
         * Delete Selected Ratelists
         */
        function deleteSelectedRatelists(ev)
        {
            var confirm = $mdDialog.confirm()
                .title('Are you sure want to delete the selected ratelists?')
                .htmlContent('<b>' + vm.selectedRatelists.length + ' selected</b>' + ' will be deleted.')
                .ariaLabel('delete ratelists')
                .targetEvent(ev)
                .ok('OK')
                .cancel('CANCEL');

            $mdDialog.show(confirm).then(function ()
            {

                vm.selectedRatelists.forEach(function (ratelist)
                {
                    deleteRatelist(ratelist);
                });

                vm.selectedRatelists = [];

            });

        }

        /**
         * Toggle selected status of the ratelist
         *
         * @param ratelist
         * @param event
         */
        function toggleSelectRatelist(ratelist, event)
        {
            if ( event )
            {
                event.stopPropagation();
            }

            if ( vm.selectedRatelists.indexOf(ratelist) > -1 )
            {
                vm.selectedRatelists.splice(vm.selectedRatelists.indexOf(ratelist), 1);
            }
            else
            {
                vm.selectedRatelists.push(ratelist);
            }
        }

        /**
         * Deselect ratelists
         */
        function deselectRatelists()
        {
            vm.selectedRatelists = [];
        }

        /**
         * Sselect all ratelists
         */
        function selectAllRatelists()
        {
            vm.selectedRatelists = $scope.filteredRatelists;
        }

        /**
         *
         */
        function addNewGroup()
        {
            if ( vm.newGroupName === '' )
            {
                return;
            }

            var newGroup = {
                'id'        : msUtils.guidGenerator(),
                'name'      : vm.newGroupName,
                'ratelistIds': []
            };

            vm.user.groups.push(newGroup);
            vm.newGroupName = '';
        }

        /**
         * Delete Group
         */
        function deleteGroup(ev)
        {
            var group = vm.listType;

            var confirm = $mdDialog.confirm()
                .title('Are you sure want to delete the group?')
                .htmlContent('<b>' + group.name + '</b>' + ' will be deleted.')
                .ariaLabel('delete group')
                .targetEvent(ev)
                .ok('OK')
                .cancel('CANCEL');

            $mdDialog.show(confirm).then(function ()
            {

                vm.user.groups.splice(vm.user.groups.indexOf(group), 1);

                filterChange('all');
            });

        }

        /**
         * Toggle sidenav
         *
         * @param sidenavId
         */
        function toggleSidenav(sidenavId)
        {
            $mdSidenav(sidenavId).toggle();
        }

    }

})();