'use strict';

var sendSaveNowMessage = function() {
   chrome.runtime.sendMessage({message: 'saveNow'});
   window.close();
};

var checkboxClicked = function() {
   var intervalContainer = document.querySelector('.timer-interval-container');
   if (isCheckboxSelected()) {
      intervalContainer.style.display = 'inline-block';
      chrome.alarms.create('saveIntervalTimer', {when: Date.now(), periodInMinutes: 5});
   } else {
      chrome.alarms.clear('saveIntervalTimer');
      intervalContainer.style.display = 'none';
   }
};

var isCheckboxSelected = function() {
   return document.querySelector('#enable-timer-checkbox').checked;
};

document.addEventListener('DOMContentLoaded', () => {
   document.querySelector('#enable-timer-checkbox').checked = true;
   checkboxClicked();

   document.querySelector('#save-tabs-button').addEventListener('click', sendSaveNowMessage);
   document.querySelector('#enable-timer-checkbox').addEventListener('click', checkboxClicked);
});
