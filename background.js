"use strict";

chrome.tabs.onUpdated.addListener(() => {
  chrome.storage.sync.get(
    ["parasites", "redirect", "isActive"],
    ({ parasites, redirect, isActive }) => {
      if (!isActive || !parasites || !parasites.length) return;

      chrome.tabs.query(
        { active: true, currentWindow: true },
        function named(tabs) {
          const activeTab = tabs[0];
          if (!activeTab) return;
          const { url: currentTabUrl, id } = activeTab;
          try {
            const parasiteList = JSON.parse(parasites);

            for (let parasite of parasiteList) {
              if (currentTabUrl.includes(parasite)) {
                chrome.tabs.update(id, { url: redirect });
                break;
              }
            }
          } catch (error) {
            console.error(error);
          }
        }
      );
    }
  );
});
