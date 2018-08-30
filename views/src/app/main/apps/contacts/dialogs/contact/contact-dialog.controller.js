(function ()
{
    'use strict';

    angular
        .module('app.contacts')
        .controller('ContactDialogController', ContactDialogController)
    


    /** @ngInject */
    function ContactDialogController($mdDialog,api,POS, Contact, User, msUtils)
    {
        var vm = this;
        vm.states=POS;
    
        vm.getState=function()
        {
                var len = vm.states.length;
                for(i=0;i<len;i++)
                {
                    if(vm.states[i].name==vm.contact.city)
                    {
                        var t= vm.states[i].state;
                        vm.contact.state=t;
                        break;
                    }
                }
        };
       
        vm.title = 'Edit Contact';
        vm.contact =Contact;
       
        vm.user = User;
        vm.newContact = false;
        vm.allFields = false;

        if ( !vm.contact )
        {
            vm.contact = {
                'name'    : '',
                'lastName': '',
                'avatar'  : 'assets/images/avatars/profile.jpg',
                'nickname': '',
                'company' : '',
                'jobTitle': '',
                'email'   : '',
                'phone'   : '',
                'address' : '',
                'birthday': null,
                'notes'   : ''
            };

            vm.title = 'New Contact';
            vm.newContact = true;
            vm.contact.tags = [];
        }

        // Methods
        vm.addNewContact = addNewContact;
        vm.saveContact = saveContact;
        vm.deleteContactConfirm = deleteContactConfirm;
        vm.closeDialog = closeDialog;
        vm.toggleInArray = msUtils.toggleInArray;
        vm.exists = msUtils.exists;

        //////////

        /**
         * Add new contact
         */
        function addNewContact()
        {
           // vm.contacts.unshift(vm.contact);
            api.contacts.insert(vm.contact,function(d){console.log(d);})
            closeDialog();
        }

        /**
         * Save contact
         */
        function saveContact()
        {
        
            api.contacts.update({_id:vm.contact._id},vm.contact,function(d){console.log(d)})
            closeDialog();
        }

        /**
         * Delete Contact Confirm Dialog
         */
        function deleteContactConfirm(ev)
        {
            var confirm = $mdDialog.confirm()
                .title('Are you sure want to delete the contact?')
                .htmlContent('<b>' + vm.contact.name + ' ' + vm.contact.lastName + '</b>' + ' will be deleted.')
                .ariaLabel('delete contact')
                .targetEvent(ev)
                .ok('OK')
                .cancel('CANCEL');

            $mdDialog.show(confirm).then(function ()
            {
                
                 api.contacts.remove({_id:vm.contact._id},function(d){console.log(d)})
                //vm.contacts.splice(vm.contacts.indexOf(Contact), 1);

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