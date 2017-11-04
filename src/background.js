'use strict';

const saveLocationParentFolderTitle = 'Other bookmarks';
const saveLocationFolderTitle = 'TabMatch-Macbook';
const notFoundId = -1;

var createBookmark = function(parentId, tab) {
   chrome.bookmarks.create({parentId: parentId, title: tab.title, url: tab.url});
};

var saveTabsToSaveLocation = function(saveLocationId) {
   chrome.windows.getAll({
      populate: true
   }, function(windows) {
      windows.forEach(function(window) {
         window.tabs.forEach(function(tab) {
            createBookmark(saveLocationId, tab);
         });
      });
   });
};

var findIdForTitle = function(bookmarks, titleToFind) {
   var found = false;
   var idOfTitle = -1;

   var findIdForTitleInternal = function(internalBookmarks, internalTitleToFind) {
      for (var ii = 0; ii < internalBookmarks.length; ++ii) {
         var bookmark = internalBookmarks[ii];
         if (bookmark.title.toUpperCase() === internalTitleToFind.toUpperCase()) {
            found = true;
            idOfTitle = bookmark.id;
            break;
         }
         if (bookmark.children) {
            findIdForTitleInternal(bookmark.children, internalTitleToFind);
            if (found) {
               break;
            }
         }
      }
   };

   findIdForTitleInternal(bookmarks, titleToFind);
   return idOfTitle;
};

var doSaveTabs = function() {
   chrome.bookmarks.getTree(function(bookmarks) {
      var saveLocationParentId = findIdForTitle(bookmarks, saveLocationParentFolderTitle);
      if (saveLocationParentId === notFoundId) {
         alert('Can\'t find ', saveLocationFolderTitle);
         return;
      }

      var saveLocationId = findIdForTitle(bookmarks, saveLocationFolderTitle);
      if (saveLocationId !== notFoundId) {
         chrome.bookmarks.removeTree(saveLocationId);
      }

      chrome.bookmarks.create(
         {parentId: saveLocationParentId, title: saveLocationFolderTitle},
         function(results) {
            saveTabsToSaveLocation(results.id);
         }
      );
   });
};

chrome.alarms.onAlarm.addListener(function() {
   doSaveTabs();
});

chrome.runtime.onMessage.addListener(function(msg, sender) {
   if (msg.message === 'saveNow') {
      doSaveTabs();
   }
});