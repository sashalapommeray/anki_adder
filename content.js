chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "showAlert") {
    alert(`You selected:\n${msg.selectedText}`);
  }
});