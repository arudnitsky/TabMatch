'use strict';

var sendSaveNowMessage = function() {
   chrome.runtime.sendMessage({message: 'saveNow'});
   window.close();
};

var enableTimerCheckboxClicked = function() {
   var intervalContainer = document.querySelector('.timer-interval-container');
   if (isEnableTimerCheckboxSelected()) {
      settings.setEnableTimer(true);
      intervalContainer.style.display = 'inline-block';
      chrome.alarms.create('saveIntervalTimer', {when: Date.now(), periodInMinutes: 5});
   } else {
      settings.setEnableTimer(false);
      chrome.alarms.clear('saveIntervalTimer');
      intervalContainer.style.display = 'none';
   }
};

var isEnableTimerCheckboxSelected = function() {
   return document.querySelector('#enable-timer-checkbox').checked;
};

var setEnableTimerCheckbox = function(value) {
   document.querySelector('#enable-timer-checkbox').checked = value;
};

var saveFolderTextChanged = function(event) {
   setting.setSaveFolder(this.value);
};

var getSaveFolderText = function() {
   return document.querySelector('#save-location').value;
};

var setSaveFolderText = function(value) {
   document.querySelector('#save-location').value = value;
};

var setSaveIntervalTime = function(time) {
   settings.setSaveIntervalMinutes(time);
};

var getSaveIntervalTime = function() {
   return settings.getSaveIntervalMinutes();
};

var saveIntervalChanged = function(event) {
   settings.setSaveIntervalMinutes(this.value);
};

document.addEventListener('DOMContentLoaded', () => {
   var saveFolder = settings.getSaveFolder();
   var saveInterval = settings.getSaveIntervalMinutes();
   setSaveFolderText(saveFolder);
   setSaveIntervalTime(saveInterval);

   if (saveFolder && (saveInterval > 0)) {
      setSaveIntervalTime(settings.getSaveInterval());
      setEnableTimerCheckbox(settings.getEnableTimer());
   } else {
      setEnableTimerCheckbox(false);
   }
   enableTimerCheckboxClicked();

   document.querySelector('#save-tabs-button').addEventListener('click', sendSaveNowMessage);
   document.querySelector('#enable-timer-checkbox').addEventListener('click', enableTimerCheckboxClicked);
   document.querySelector('#timer-interval').addEventListener('change', saveIntervalChanged);
   document.querySelector('#save-location').addEventListener('change', saveFolderTextChanged);
});
