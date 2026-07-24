const vscode = require('vscode');

const SLOT_IDS = ['slot1', 'slot2', 'slot3', 'slot4', 'slot5', 'slot6'];

const DEFAULTS = {
  slot1: { enabled: true, command: 'aipopup.action.modal.generate' },
  slot2: { enabled: true, command: 'editor.action.inlineDiffs.acceptAll' },
  slot3: { enabled: true, command: 'editor.action.inlineDiffs.rejectAll' },
  slot4: { enabled: true, command: 'composer.duplicateChat' },
  slot5: { enabled: true, command: 'composer.toggleVoiceDictation' },
  slot6: { enabled: true, command: 'aichat.newchataction' }
};

function activate(context) {
  // Each slot command reads its *current* target command from settings at
  // invocation time — no reload needed when the user edits shipbar.buttons.
  for (const slotId of SLOT_IDS) {
    const commandId = `shipbar.${slotId}`;
    context.subscriptions.push(
      vscode.commands.registerCommand(commandId, async () => {
        const config = vscode.workspace.getConfiguration();
        const buttons = config.get('shipbar.buttons', DEFAULTS);
        const slotConfig = buttons[slotId] || DEFAULTS[slotId];
        const target = slotConfig && slotConfig.command;

        if (!target) {
          vscode.window.showWarningMessage(
            `ShipBar: ${slotId} has no command configured. Set "shipbar.buttons.${slotId}.command" in settings.`
          );
          return;
        }

        try {
          await vscode.commands.executeCommand(target);
        } catch (err) {
          vscode.window.showErrorMessage(`ShipBar (${slotId} → ${target}) failed: ${err.message}`);
        }
      })
    );
  }
}

function deactivate() {}

module.exports = { activate, deactivate };