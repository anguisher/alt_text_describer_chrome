chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "showAndCopyImageDescription",
      title: "Show and copy image description",
      contexts: ["image"]
    });

    chrome.contextMenus.create({
      id: "onlyShowImageDescription",
      title: "Only show image description",
      contexts: ["image"]
    });
  });
});

function ensureContentScript(tabId, callback) {
  chrome.scripting.executeScript({
    target: {tabId: tabId},
    files: ['content.js']
  }, callback);
}
function sendMsg(tabId, message) {
  ensureContentScript(tabId, () => {
    chrome.tabs.sendMessage(tabId, {type: "showModal", message: message});
  });
}
function copyText(tabId, text){
  ensureContentScript(tabId, () => {
    chrome.tabs.sendMessage(tabId, {type: "copyText", message: text});
  });
}
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "showAndCopyImageDescription" || info.menuItemId === "onlyShowImageDescription") {
    if (tab.id) sendMsg(tab.id, "Please wait...");
    chrome.storage.local.get(['apiKey', 'language'], function(result) {
      if (!result.apiKey || !result.language) {
        if (tab.id) sendMsg(tab.id, "API key is not set, please set it in extension settings.");
        return;
      }
      const data = {
        api_key: result.apiKey,
        language: result.language,
        image_url: info.srcUrl
      };
      fetch("https://api.prisakaru.lt/request_description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        if(data.status == "error"){
          if(data.type == "no_credits"){
            if(tab.id) sendMsg(tab.id, data.content);
            return;
          }
          if(tab.id) sendMsg(tab.id, data.content.error.message);
          return;
        }
        if (info.menuItemId === "showAndCopyImageDescription") {
          if (tab.id) copyText(tab.id, data);
        }
        else{
          if (tab.id) sendMsg(tab.id, data.content);
        }
      })
      .catch(error => {
        console.error("Error fetching description: ", error);
      });
    });
  }
});
