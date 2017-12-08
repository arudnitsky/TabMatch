'use strict';

const saveLocationParentFolderTitle = 'Other bookmarks';
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
            console.log('saveTabsToSaveLocation createBookmark');
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

var createParentAndSaveTabs = function(saveLocationParentId, folderTitle ) {
   chrome.bookmarks.create(
      {parentId: saveLocationParentId, title: folderTitle},
      function(results) {
         saveTabsToSaveLocation(results.id);
      }
   );
};

var doSaveTabs = function() {
   console.log('Entering doSaveTabs()');
   var saveLocation = settings.getSaveFolder();
   if (! saveLocation) {
      return;
   }

   chrome.bookmarks.getTree(function(bookmarks) {
      console.log('Entering getTree callback');
      var saveLocationParentId = findIdForTitle(bookmarks, saveLocationParentFolderTitle);
      if (saveLocationParentId === notFoundId) {
         return;
      }

      var saveLocationId = findIdForTitle(bookmarks, saveLocation);
      if (saveLocationId !== notFoundId) {
         console.log('Trying to remove tree with id ' + saveLocationId)
         chrome.bookmarks.removeTree(saveLocationId);
         console.log('Removed tree');
      }
      createParentAndSaveTabs(saveLocationParentId, saveLocation);
      console.log('Exiting getTree callback');
   });
   console.log('Exiting doSaveTabs()');
};

chrome.alarms.onAlarm.addListener(function() {
   doSaveTabs();
});

chrome.runtime.onMessage.addListener(function(msg, sender) {
   if (msg.message === 'saveNow') {
      doSaveTabs();
   }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
   console.log('tabs.onUpdated ' + changeInfo.status);
   if (changeInfo.status === 'loading') {
      if (tab.url === undefined) {
         alert('Tab loading and url is undefined');
      } else {
         doSaveTabs();
      }

   }
});

chrome.tabs.onRemoved.addListener(function() {
   console.log('tabs.onRemoved');
   doSaveTabs();
});

chrome.tabs.onReplaced.addListener(function() {
   console.log('tabs.onReplaced');
   doSaveTabs();
});

