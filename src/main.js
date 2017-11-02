const saveLocationParentFolderTitle = 'Other bookmarks';
const saveLocationFolderTitle = 'TabMatch-Windows';
const notFoundId = -1;

createBookmark = function(parentId, tab) {
   chrome.bookmarks.create({parentId: parentId, title: tab.title, url: tab.url}
      // , function(newBookmark) {console.log("added bookmark: " + newBookmark.title);}
   );
};

saveTabsToSaveLocation = function(saveLocationId) {
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

findIdForTitle = function(bookmarks, titleToFind) {
   var found = false;
   var idOfTitle = -1;

   findIdForTitleInternal = function(internalBookmarks, internalTitleToFind) {
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

doSaveTabs = function() {
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

// chrome.alarms.create( "myAlarm", { delayInMinutes: 1, periodInMinutes: 1});
// chrome.alarms.onAlarm.addListener(doSaveTabs);

document.addEventListener('DOMContentLoaded', () => {
   document.querySelector('#save-tabs-button').addEventListener('click', doSaveTabs);
});