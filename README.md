# ⚡ ShipBar

**Tactile control for your Cursor AI agent, right on your MacBook's Touch Bar.**

## What it is
 
ShipBar is a Cursor extension that turns your MacBook's Touch Bar into a
6-button command strip for Cursor's AI coding agent. Instead of reaching for
the mouse or hunting through menus every time the agent needs a decision from
you, you get instant, one-tap control right above your keyboard.

## Features

| Icon | Button | Action | Command |
|------|--------|--------|---------|
| <img src="icons/zap.png" width="20" height="20" alt="Zap" /> | **Zap** | Open the inline AI generate prompt (Cmd+K-style) at your cursor | `aipopup.action.modal.generate` |
| <img src="icons/circle-check.png" width="20" height="20" alt="Check" /> | **Check** | Accept all pending edits from the agent | `editor.action.inlineDiffs.acceptAll` |
| <img src="icons/circle-x.png" width="20" height="20" alt="Close" /> | **Close** | Reject all pending edits from the agent | `editor.action.inlineDiffs.rejectAll` |
| <img src="icons/split.png" width="20" height="20" alt="Branch" /> | **Branch** | Duplicate the current chat into a new thread | `composer.duplicateChat` |
| <img src="icons/mic.png" width="20" height="20" alt="Mic" /> | **Mic** | Toggle voice dictation on/off | `composer.toggleVoiceDictation` |
| <img src="icons/sparkles.png" width="20" height="20" alt="Chat" /> | **Chat** | Start a brand new chat | `aichat.newchataction` |

## Configuration

Every button is remappable, and any button can be hidden.

**Easiest way:** `Cmd+Shift+P` → **"ShipBar: Configure Buttons"**. Pick a
slot, then choose to change its command (from a preset list or a custom
command ID), hide it, or reset it to default. No file editing required.

**Manual way:** add a `shipbar.buttons` block to your settings.json
(`Cmd+Shift+P` → **Preferences: Open User Settings (JSON)**):

```jsonc
{
  "shipbar.buttons": {
    "slot4": {
      "enabled": true,
      "command": "workbench.action.terminal.toggleTerminal"
    },
    "slot5": {
      "enabled": false
    }
  }
}
```

- `command` — any Cursor or VS Code command ID. Changes apply immediately,
  no reload required.
- `enabled` — `false` removes the button from the Touch Bar entirely.
- Only override the slots you want to change; unspecified slots keep their
  defaults.

Slot-to-icon mapping is fixed (slot1 = Zap icon, slot2 = Check icon, and so
on) — icons can't be swapped live from settings, only the command each slot
runs and whether it's shown.

See [`examples/settings.example.jsonc`](examples/settings.example.jsonc) for
a fully annotated example covering every slot.

## Why use it
 
Working with an AI coding agent means making the same few decisions over and
over: generate, accept, reject, branch, dictate, or start fresh. Each of
these normally costs you a window switch, a click hunt, or a trip to the
command palette.
 
ShipBar collapses all of that into a single tap:
 
- **Faster than the palette** — one press beats `Cmd+Shift+P` and typing a
  command name
- **Zap for quick edits** — jump straight into inline generate without
  leaving the keyboard
- **Uses hardware you already have** — no extra device to buy, just the
  Touch Bar sitting idle on your MacBook

## Requirements

- macOS with a physical Touch Bar
- [Cursor](https://cursor.com) (the commands above are Cursor-specific; they
  won't exist in vanilla VS Code)

## Installation

### From a packaged `.vsix`

```bash
npm install -g @vscode/vsce
vsce package --no-dependencies
```

*(`--no-dependencies` is required — ShipBar has no runtime dependencies, and
`vsce`'s dependency-resolution step fails on projects without one.)*

Then in Cursor: `Extensions` → `...` menu → **Install from VSIX...** and pick
the generated `shipbar-0.1.0.vsix`.

### From source (for development)

```bash
git clone https://github.com/max-blackwell/ShipBar.git
cd ShipBar
```

Open the folder in Cursor and press `F5` to launch an Extension Development
Host with ShipBar loaded.

## Regenerating icons

Icons are sourced from [Lucide](https://lucide.dev) and rendered to PNG:

```bash
brew install librsvg   # provides rsvg-convert
./icons-download.sh
```

## Contributing

Issues and PRs welcome. Since ShipBar wraps internal Cursor commands, if a
command ID changes in a Cursor update and an action stops working, please
open an issue with the Cursor version you're on.

## License

[MIT](LICENSE)