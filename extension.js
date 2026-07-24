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

// Friendly labels + a curated preset list, so most users never have to type
// a raw command ID.
const SLOT_LABELS = {
  slot1: 'Slot 1 (Zap icon)',
  slot2: 'Slot 2 (Check icon)',
  slot3: 'Slot 3 (Close icon)',
  slot4: 'Slot 4 (Branch icon)',
  slot5: 'Slot 5 (Mic icon)',
  slot6: 'Slot 6 (Chat icon)'
};

const PRESETS = [
  { label: 'Generate (inline AI prompt)', command: 'aipopup.action.modal.generate' },
  { label: 'Accept all edits', command: 'editor.action.inlineDiffs.acceptAll' },
  { label: 'Reject all edits', command: 'editor.action.inlineDiffs.rejectAll' },
  { label: 'Duplicate chat', command: 'composer.duplicateChat' },
  { label: 'Toggle voice dictation', command: 'composer.toggleVoiceDictation' },
  { label: 'New chat', command: 'aichat.newchataction' },
  { label: 'Toggle terminal', command: 'workbench.action.terminal.toggleTerminal' },
  { label: 'Open command palette', command: 'workbench.action.showCommands' }
];

function getButtons(config) {
  const stored = config.get('shipbar.buttons', DEFAULTS);
  // Fill in any slot missing from the user's override with its default, so
  // partial configs never lose the other slots.
  const merged = {};
  for (const slotId of SLOT_IDS) {
    merged[slotId] = (stored && stored[slotId]) || DEFAULTS[slotId];
  }
  return merged;
}

async function runConfigureWizard() {
  const config = vscode.workspace.getConfiguration();
  const buttons = getButtons(config);

  // Step 1: pick which slot to edit
  const slotPick = await vscode.window.showQuickPick(
    SLOT_IDS.map((slotId) => {
      const b = buttons[slotId];
      const status = b.enabled ? '$(check) enabled' : '$(circle-slash) disabled';
      const commandLabel = PRESETS.find((p) => p.command === b.command)?.label || b.command || '(none set)';
      return {
        label: SLOT_LABELS[slotId],
        description: `${status} — ${commandLabel}`,
        slotId
      };
    }),
    { title: 'ShipBar: Configure Buttons', placeHolder: 'Pick a Touch Bar slot to edit' }
  );
  if (!slotPick) return;
  const { slotId } = slotPick;

  // Step 2: what to do with this slot
  const action = await vscode.window.showQuickPick(
    [
      { label: '$(list-selection) Change command', action: 'change' },
      {
        label: buttons[slotId].enabled ? '$(circle-slash) Hide this button' : '$(check) Show this button',
        action: 'toggle'
      },
      { label: '$(discard) Reset to default', action: 'reset' }
    ],
    { title: SLOT_LABELS[slotId], placeHolder: 'What do you want to do?' }
  );
  if (!action) return;

  const updated = { ...buttons };

  if (action.action === 'toggle') {
    updated[slotId] = { ...updated[slotId], enabled: !updated[slotId].enabled };
  } else if (action.action === 'reset') {
    updated[slotId] = { ...DEFAULTS[slotId] };
  } else if (action.action === 'change') {
    const CUSTOM = '$(edit) Enter a custom command ID…';
    const presetPick = await vscode.window.showQuickPick(
      [...PRESETS.map((p) => ({ label: p.label, description: p.command, command: p.command })), { label: CUSTOM, command: null }],
      { title: `${SLOT_LABELS[slotId]} — choose a command`, placeHolder: 'Pick a preset, or enter a custom command ID' }
    );
    if (!presetPick) return;

    let chosenCommand = presetPick.command;
    if (chosenCommand === null) {
      chosenCommand = await vscode.window.showInputBox({
        title: 'Custom command ID',
        placeHolder: 'e.g. workbench.action.files.save',
        prompt: 'Find command IDs via Cmd+Shift+P → "Preferences: Open Keyboard Shortcuts (JSON)"',
        value: buttons[slotId].command || ''
      });
      if (!chosenCommand) return;
    }
    updated[slotId] = { ...updated[slotId], command: chosenCommand, enabled: true };
  }

  await config.update('shipbar.buttons', updated, vscode.ConfigurationTarget.Global);
  vscode.window.showInformationMessage(`ShipBar: ${SLOT_LABELS[slotId]} updated.`);
}

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('shipbar.configure', runConfigureWizard)
  );

  // Each slot command reads its *current* target command from settings at
  // invocation time — no reload needed when the user edits shipbar.buttons.
  for (const slotId of SLOT_IDS) {
    const commandId = `shipbar.${slotId}`;
    context.subscriptions.push(
      vscode.commands.registerCommand(commandId, async () => {
        const config = vscode.workspace.getConfiguration();
        const buttons = getButtons(config);
        const target = buttons[slotId] && buttons[slotId].command;

        if (!target) {
          vscode.window.showWarningMessage(
            `ShipBar: ${slotId} has no command configured. Run "ShipBar: Configure Buttons" to set one.`
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