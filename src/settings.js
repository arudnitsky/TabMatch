var settings = (function() {

   var saveIntervalDefault = 5;
   var saveFolderDefault = '';
   var enableTimerDefault = false;

   return {
      setSaveIntervalMinutes: function(interval) {
         localStorage.setItem('saveIntervalMinutes', interval);
      },

      getSaveIntervalMinutes: function() {
         var interval = localStorage.getItem('saveIntervalMinutes');
         return JSON.parse(interval ? interval : saveIntervalDefault);
      },

      setSaveFolder: function(folder) {
         localStorage.setItem('saveFolder', folder);
      },

      getSaveFolder: function() {
         var saveFolder = localStorage.getItem('saveFolder');
         return saveFolder ? saveFolder : saveFolderDefault;
      },

      setEnableTimer: function(enable) {
         localStorage.setItem('enableTimer', JSON.stringify(enable));
      },

      getEnableTimer: function() {
         var enableTimer = localStorage.getItem('enableTimer');
         return JSON.parse(enableTimer ? enableTimer : enableTimerDefault);
      }
   };
}());