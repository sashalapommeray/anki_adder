chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "show-selection-alert",
    title: "Show selected text",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== "show-selection-alert") return;

  // Inject the content script (if not already present)
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  }, () => {
    // Send the selected text to the content script
    chrome.tabs.sendMessage(tab.id, {
      action: "showAlert",
      selectedText: info.selectionText
    });
  });
});