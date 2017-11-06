'use strict';

var sendSaveNowMessage = function() {
   chrome.runtime.sendMessage({message: 'saveNow'});
   window.close();
};

var enableTimerCheckboxClicked = function() {
   var intervalContainer = document.querySelector('.timer-interval-container');
   if (isEnableTimerCheckboxSelected()) {
      intervalContainer.style.display = 'inline-block';
      chrome.alarms.create('saveIntervalTimer', {when: Date.now(), periodInMinutes: 5});
   } else {
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

var getSaveLocation = function() {
   return document.querySelector('#save-location').value;
};

var setSaveLocation = function(value) {
   document.querySelector('#save-location').value = value;
};

document.addEventListener('DOMContentLoaded', () => {
   setEnableTimerCheckbox(true);
   enableTimerCheckboxClicked();

   document.querySelector('#save-tabs-button').addEventListener('click', sendSaveNowMessage);
   document.querySelector('#enable-timer-checkbox').addEventListener('click', enableTimerCheckboxClicked);
});
