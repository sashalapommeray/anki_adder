import json
import urllib.request

# ----------------------------------------------------------------------
# Helper: call AnkiConnect (runs locally on http://127.0.0.1:8765)
# ----------------------------------------------------------------------
def invoke(action, params=None):
    """Send a JSON‑RPC request to AnkiConnect."""
    request_json = json.dumps({
        "action": action,
        "version": 6,
        "params": params or {}
    }).encode("utf-8")

    response = urllib.request.urlopen(
        urllib.request.Request(
            url="http://127.0.0.1:8765",
            data=request_json,
            headers={"Content-Type": "application/json"}
        )
    )
    result = json.load(response)
    if result.get("error"):
        raise Exception(result["error"])
    return result["result"]

# ----------------------------------------------------------------------
# 1️⃣  Make sure the target deck exists (creates it if missing)
# ----------------------------------------------------------------------
deck_name = "Default"                     # change to any deck you like
invoke("createDeck", {"deck": deck_name})

# ----------------------------------------------------------------------
# 2️⃣  Define the note (card) you want to add
# ----------------------------------------------------------------------
word      = "serendipity"                 # ← the word you want to send
definition = ("Finding something good without looking for it."
              " A happy accident.")     # ← optional back side text

note = {
    "deckName": deck_name,
    "modelName": "Basic",                # built‑in card type (front/back)
    "fields": {
        "Front": word,
        "Back": definition
    },
    "options": {
        "allowDuplicate": False         # set True if you want duplicates
    },
    "tags": ["example"]                  # optional tags
}

# ----------------------------------------------------------------------
# 3️⃣  Add the note to Anki
# ----------------------------------------------------------------------
added_note_ids = invoke("addNotes", {"notes": [note]})
print(f"Added note IDs: {added_note_ids}")
