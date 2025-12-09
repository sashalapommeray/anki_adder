browser.contextMenus.create({
  id: "send-to-anki",
  title: "Send to Anki",
  contexts: ["selection"]
});

async function anki(action, params = {}) {
  const res = await fetch("http://127.0.0.1:8765", {
    method: "POST",
    body: JSON.stringify({ action, version: 6, params })
  });
  return res.json();
}

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== "send-to-anki") return;

  const raw = info.selectionText.trim();
  if (!raw) return;

  const lines = raw.split(/\r?\n+/).map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length < 2) return;

  const deck = "WaniKani Sentences";

  // ensure deck exists
  const decks = await anki("deckNames");
  if (!decks.result.includes(deck)) {
    await anki("createDeck", { deck });
  }

  // check for model, fall back if needed
  const desiredModel = "WaniKani Sentences";
  const models = await anki("modelNames");

  let modelToUse = desiredModel;

  if (!models.result.includes(desiredModel)) {
    modelToUse = models.result[0]; // fallback to user's first model
    console.warn(`Model "${desiredModel}" not found. Falling back to "${modelToUse}".`);
  }

  for (let i = 0; i < lines.length - 1; i += 2) {
    const jp = lines[i];
    const en = lines[i + 1];

    const note = {
      deckName: deck,
      modelName: modelToUse,
      fields: { Front: jp, Back: en },
      options: {
        allowDuplicate: false,
        duplicateScope: "deck"
      }
    };

    await anki("addNote", { note });
  }
});
