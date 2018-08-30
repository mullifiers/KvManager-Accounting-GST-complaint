(function ()
{
    'use strict';

    angular
        .module('app.notes')
        .factory('NotesService', NotesService);

    /** @ngInject */
    function NotesService(msApi,api, $state)
    {
        var service = {
            data      : [],
            addNote   : addNote,
            updateNote: updateNote,
            deleteNote: deleteNote,
            getData   : getData
        };
         

        function refresh(){
            $state.go('app.notes',{},{reload:'app.notes'})
        }
        /**
         * Add Note
         * @param note
         */
        function addNote(note)
        {
            api.notes.insert(note,function(d){console.log(d);})
            refresh()
        }

        /**
         * Update Note
         * @param note
         */
        function updateNote(note)
        {
              api.contacts.update({_id:vm.note._id},note,function(d){console.log(d)})
              refresh()
        }

        /**
         * Delete Note
         * @param note
         */
        function deleteNote(note)
        {
            api.notes.remove({_id:vm.note._id},function(d){console.log(d)})
            refresh()
        }

        /**
         * Get service data
         * @returns {Array}
         */
        function getData()
        {
            var promise=new Promise(function(resolve){
                api.notes.find({},function(err,d){
                    resolve(d)   
                });
            });
            return promise;  
        }

        return service;

    }
})();