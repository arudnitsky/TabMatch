'use strict';

var sendClickMessage = function() {
   chrome.runtime.sendMessage({message: 'saveNowClick'});
};

document.addEventListener('DOMContentLoaded', () => {
   document.querySelector('#save-tabs-button').addEventListener('click', sendClickMessage);
});

chrome.alarms.create({delayInMinutes: 1, periodInMinutes: 5});
