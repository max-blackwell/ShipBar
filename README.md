# ⚡ ShipBar

**Tactile control for your Cursor AI agent, right on your MacBook's Touch Bar.**

## What it is

ShipBar is a Cursor extension that turns your MacBook's Touch Bar into a
6-button command strip for Cursor's AI coding agent. Instead of reaching for
the mouse or hunting through menus every time the agent needs a decision from
you, you get instant, one-tap control right above your keyboard.

## Features


| Icon | Button     | Action                                                          | Command                               |
| ---- | ---------- | --------------------------------------------------------------- | ------------------------------------- |
|      | **Zap**    | Open the inline AI generate prompt (Cmd+K-style) at your cursor | `aipopup.action.modal.generate`       |
|      | **Check**  | Accept all pending edits from the agent                         | `editor.action.inlineDiffs.acceptAll` |
|      | **Close**  | Reject all pending edits from the agent                         | `editor.action.inlineDiffs.rejectAll` |
|      | **Branch** | Duplicate the current chat into a new thread                    | `composer.duplicateChat`              |
|      | **Mic**    | Toggle voice dictation on/off                                   | `composer.toggleVoiceDictation`       |
|      | **Chat**   | Start a brand new chat                                          | `aichat.newchataction`                |




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
- [Cursor](https://cursor.sh) (the commands above are Cursor-specific; they
won't exist in vanilla VS Code)



## Installation



### From a packaged `.vsix`

```bash
npm install -g @vscode/vsce
vsce package
```

Then in Cursor: `Extensions` → `...` menu → **Install from VSIX...** and pick
the generated `shipbar-0.0.1.vsix`.

### From source (for development)

```bash
git clone https://github.com/max-blackwell/shipbar.git
cd shipbar
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