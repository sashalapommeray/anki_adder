browser.contextMenus.create({
  id: "send-to-anki",
  title: "Send to Anki",
  contexts: ["selection"]
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== "send-to-anki") return;

  const raw = info.selectionText.trim();
  if (!raw) return;

  // Split into non-empty lines
  const lines = raw.split(/\r?\n+/).map(l => l.trim()).filter(l => l.length > 0);

  // Ensure even number of lines (JP/EN pairs)
  if (lines.length < 2) return;

  // Create notes in JP/EN pairs
  for (let i = 0; i < lines.length - 1; i += 2) {
    const jp = lines[i];
    const en = lines[i + 1];

    const note = {
      deckName: "WaniKani Sentences",
      modelName: "WaniKani Sentences",
      fields: { Front: jp, Back: en },
      options: {
        allowDuplicate: false,
        duplicateScope: "deck"
      }
    };

    await fetch("http://127.0.0.1:8765", {
      method: "POST",
      body: JSON.stringify({
        action: "addNote",
        version: 6,
        params: { note }
      })
    });
  }
});
