const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Congratulations, your extension "procon" is now active!');

	let disposable = vscode.commands.registerCommand('procon.copy', function () {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const text = editor.document.getText();
			const lines = text.split("\n");

			const out = lines.join("\n")
			vscode.env.clipboard.writeText(out)
		}
	});

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
