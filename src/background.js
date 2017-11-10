'use strict';

const saveLocationParentFolderTitle = 'Other bookmarks';
const saveLocationFolderTitle = 'TabMatch-Windows';
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

var createParentAndSaveTabs = function(saveLocationParentId, folderTitle ) {
   chrome.bookmarks.create(
      {parentId: saveLocationParentId, title: folderTitle},
      function(results) {
         saveTabsToSaveLocation(results.id);
      }
   );
};

var doSaveTabs = function() {
   chrome.bookmarks.getTree(function(bookmarks) {
      var saveLocationParentId = findIdForTitle(bookmarks, saveLocationParentFolderTitle);

      var saveLocationId = findIdForTitle(bookmarks, saveLocationFolderTitle);
      if (saveLocationId === notFoundId) {
         createParentAndSaveTabs(saveLocationParentId, saveLocationFolderTitle);
      } else {
         chrome.bookmarks.removeTree(saveLocationId, createParentAndSaveTabs(saveLocationParentId, saveLocationFolderTitle));
      }
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

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
   if (changeInfo.status === 'loading') {
      if (tab.url === undefined) {
         alert('Tab loading and url is undefined');
      } else {
         doSaveTabs();
      }

   }
});

chrome.tabs.onRemoved.addListener(function() {
   doSaveTabs();
});

chrome.tabs.onReplaced.addListener(function() {
   doSaveTabs();
});