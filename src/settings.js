var settings = (function() {

   var saveInterval = 6;
   var saveFolder = '';
   var enableTimer = false;

   return {
      setSaveIntervalMinutes: function(interval) {
         saveInterval = interval;
      },

      getSaveIntervalMinutes: function() {
         return saveInterval;
      },

      setSaveFolder: function(folder) {
         saveFolder = folder;
      },

      getSaveFolder: function() {
         return saveFolder;
      },

      getEnableTimer: function() {
         return enableTimer;
      },

      setEnableTimer: function(enable) {
         enableTimer = enable;
      }
   };
}());