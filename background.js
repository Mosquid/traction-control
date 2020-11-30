"use strict"
function initParasitBehavior(parasites, redirect) {
  chrome.tabs.onUpdated.addListener(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0]
      if (!activeTab) return
      const { url, id } = activeTab

      for (let parasite of JSON.parse(parasites)) {
        if (url.includes(parasite)) {
          chrome.tabs.executeScript(id, {
            code: "window.stop();",
            runAt: "document_start",
          })
          chrome.tabs.update(id, { url: redirect })
          break
        }
      }
    })
  })
}

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.get(
    ["parasites", "redirect"],
    ({ parasites, redirect }) => {
      if (parasites && parasites.length) {
        initParasitBehavior(parasites, redirect)
      }
    }
  )
})
