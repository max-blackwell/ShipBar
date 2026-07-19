const vscode = require('vscode');

function activate(context) {
  const handlers = {
    // ⚡ Zap — quick generate (inline Cmd+K-style edit)
    'shipbar.zap': async () => {
      try {
        await vscode.commands.executeCommand('aipopup.action.modal.generate');
      } catch (err) {
        vscode.window.showErrorMessage(`Couldn't generate: ${err.message}`);
      }
    },

    // ✓ Check — accept edits
    'shipbar.check': async () => {
      try {
        await vscode.commands.executeCommand('editor.action.inlineDiffs.acceptAll');
      } catch (err) {
        vscode.window.showErrorMessage(`Couldn't accept: ${err.message}`);
      }
    },

    // ✕ X — reject/cancel edits
    'shipbar.close': async () => {
      try {
        await vscode.commands.executeCommand('editor.action.inlineDiffs.rejectAll');
      } catch (err) {
        vscode.window.showErrorMessage(`Couldn't cancel: ${err.message}`);
      }
    },

    // ↗ Branch — fork current thread into a new one
    'shipbar.branch': async () => {
      try {
        await vscode.commands.executeCommand('composer.duplicateChat');
      } catch (err) {
        vscode.window.showErrorMessage(`Couldn't branch: ${err.message}`);
      }
    },

    // 💬 Chat — new chat
    'shipbar.chat': async () => {
      try {
        await vscode.commands.executeCommand('aichat.newchataction');
      } catch (err) {
        vscode.window.showErrorMessage(`Couldn't start chat: ${err.message}`);
      }
    },

    // 🎙 Mic — toggle voice dictation
    'shipbar.mic': async () => {
      try {
        await vscode.commands.executeCommand('composer.toggleVoiceDictation');
      } catch (err) {
        vscode.window.showErrorMessage(`Couldn't toggle voice: ${err.message}`);
      }
    }
  };

  for (const [id, handler] of Object.entries(handlers)) {
    context.subscriptions.push(vscode.commands.registerCommand(id, handler));
  }
}

function deactivate() {}

module.exports = { activate, deactivate };