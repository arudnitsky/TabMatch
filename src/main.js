'use strict';

const saveIntervalTimerName = 'saveIntervalTimer';

var sendSaveNowMessage = function() {
   chrome.runtime.sendMessage({message: 'saveNow'});
   window.close();
};

var saveFolderTextBoxChanged = function(event) {
   settings.setSaveFolder(this.value);
};

var saveIntervalChanged = function(event) {
   settings.setSaveIntervalMinutes(this.value);
};

var enableTimerCheckboxClicked = function() {
   var intervalContainer = document.querySelector('.timer-interval-container');
   if (isEnableTimerCheckboxSelected()) {
   // if save folder is not set, then flash save folder, set enable timer to false and return
      settings.setEnableTimer(true);
      intervalContainer.style.display = 'inline-block';
      chrome.alarms.clear(saveIntervalTimerName);
      chrome.alarms.create(saveIntervalTimerName, {when: Date.now(), periodInMinutes: settings.getSaveIntervalMinutes()});
   } else {
      settings.setEnableTimer(false);
      chrome.alarms.clear(saveIntervalTimerName);
      intervalContainer.style.display = 'none';
   }
};

var isEnableTimerCheckboxSelected = function() {
   return document.querySelector('#enable-timer-checkbox').checked;
};

var setEnableTimerCheckbox = function(value) {
   document.querySelector('#enable-timer-checkbox').checked = value;
};

var restoreUiFromSavedSettings = function() {
   var saveFolder = settings.getSaveFolder();
   var saveIntervalMinutes = settings.getSaveIntervalMinutes();
   var enableTimer = settings.getEnableTimer();

   document.querySelector('#save-location').value = saveFolder;
   document.querySelector('#timer-interval').value = saveIntervalMinutes;

   if (saveFolder && (saveIntervalMinutes > 0)) {
      setEnableTimerCheckbox(enableTimer);
   } else {
      setEnableTimerCheckbox(false);
   }
   enableTimerCheckboxClicked();
};

document.addEventListener('DOMContentLoaded', () => {
   restoreUiFromSavedSettings();

   document.querySelector('#save-tabs-button').addEventListener('click', sendSaveNowMessage);
   document.querySelector('#enable-timer-checkbox').addEventListener('click', enableTimerCheckboxClicked);
   document.querySelector('#timer-interval').addEventListener('change', saveIntervalChanged);
   document.querySelector('#save-location').addEventListener('change', saveFolderTextBoxChanged);
});
