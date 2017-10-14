const saveLocationParentFolder = 'Other bookmarks';
const saveLocationFolderTitle = 'TabMatch';
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

createSaveLocation = function(parentId) {
   chrome.bookmarks.create({
      parentId: parentId,
      title: 'Extension bookmarks'
   });
};

findIdForTitle = function(bookmarks, titleToFind) {
   var found = false;
   var idOfTitle = -1;

   findIdForTitleInternal = function(internalBookmarks, internalTitleToFind) {
      for (var ii = 0; ii < internalBookmarks.length; ++ii) {
         var bookmark = internalBookmarks[ii];
         if (bookmark.title === internalTitleToFind) {
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
      // if has save location saveLocation
      //     delete it
      //     recreate it
      // endif∏

      var saveLocationId = findIdForTitle(bookmarks, saveLocationFolderTitle);
      if (saveLocationId !== notFoundId) {
         // deleteSaveLocation(saveLocationId);
      }
      // createSaveLocation(saveLocationFolderTitle);
      saveTabsToSaveLocation(saveLocationId);
   });
};

// chrome.alarms.create( "myAlarm", { delayInMinutes: 1, periodInMinutes: 1});
// chrome.alarms.onAlarm.addListener(doSaveTabs);

document.addEventListener('DOMContentLoaded', () => {
   document.getElementById('container').addEventListener('click', doSaveTabs);
});