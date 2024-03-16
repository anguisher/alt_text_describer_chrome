document.addEventListener('DOMContentLoaded', function() {
  var saveBtn = document.getElementById('saveBtn');
  var apiKeyInput = document.getElementById('apiKey');
  var languageSelect = document.getElementById('languageSelect');
  var links = document.querySelectorAll('a');
    Array.from(links).forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        chrome.tabs.create({url: this.href});
      });
    });
  chrome.storage.local.get(['apiKey', 'language'], function(result) {
    if (result.apiKey) {
      apiKeyInput.value = result.apiKey;
    }
    if (result.language) {
      languageSelect.value = result.language;
    }
  });
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	  if (message.action === "showModalMessage") {
	    openModal(message.message);
	  }
	});
  saveBtn.addEventListener('click', function() {
    var apiKey = apiKeyInput.value;
    var language = languageSelect.value;
    chrome.storage.local.set({ apiKey: apiKey, language: language });
  });
});