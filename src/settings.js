var settings = (function() {

   var saveIntervalDefault = 5;
   var saveFolderDefault = '';
   var enableTimerDefault = false;

   return {
      setSaveIntervalMinutes: function(interval) {
         localStorage.saveIntervalMinutes = JSON.stringify(interval);
      },

      getSaveIntervalMinutes: function() {
         var value = localStorage.saveIntervalMinutes ? localStorage.saveIntervalMinutes : saveIntervalDefault;
         return JSON.parse(value);
      },

      setSaveFolder: function(folder) {
         localStorage.saveFolder = folder;
      },

      getSaveFolder: function() {
         return localStorage.saveFolder ? localStorage.saveFolder : saveFolderDefault;
      },

      setEnableTimer: function(enable) {
         localStorage.enableTimer = JSON.stringify(enable);
      },

      getEnableTimer: function() {
         value = localStorage.enableTimer ? localStorage.enableTimer : enableTimerDefault;
         return JSON.parse(value);
      }
   };
}());