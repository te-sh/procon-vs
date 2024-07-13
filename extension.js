const vscode = require('vscode');
const fs = require('fs');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Congratulations, your extension "procon" is now active!');

	let disposable = vscode.commands.registerCommand('procon.copy', function () {
		const workspaceDir = vscode.workspace.workspaceFolders[0].uri.path;
		const libDir = workspaceDir + '/code/lib';

		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}
		
		const document = editor.document;
		const text = document.getText();
		const lines = text.split('\n');

		for (;;) {
			let hit = false;
			lines.some((line, index) => {
				const m = line.match(/^require "(.*)"/);
				if (!m) {
					return;
				}

				const file = m[1];
				if (!file.startsWith('procon')) {
					return;
				}

				hit = true;
				const lib = fs.readFileSync(libDir + '/' + file + '.cr', 'utf-8');
				const libLines = lib.split('\n').filter((libLine) => {
					return !libLine.match(/^\s*#/);
				});
				if (libLines[libLines.length - 1] == '\n') {
					libLines.pop()
				}

				lines.splice(index, 1, ...libLines);
				return true;
			});
			if (!hit) {
				break;
			}
		}

		const out = lines.join('\n');
		vscode.env.clipboard.writeText(out);
	});

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
