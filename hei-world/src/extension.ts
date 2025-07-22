/*
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "hei-world" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('hei-world.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Salam World from hei_world!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}


*/



import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { CatFaceViewProvider } from './catFaceViewProvider';


export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
  vscode.window.registerWebviewViewProvider(
    CatFaceViewProvider.viewType,
    new CatFaceViewProvider(context)
  )
);


	vscode.window.registerWebviewViewProvider(
  'minKattView', // View ID you declare in `package.json`
  new CatFaceViewProvider(context)
 	);

	vscode.languages.onDidChangeDiagnostics(e => {
 	 const diagnostics = vscode.languages.getDiagnostics();
  // Pass this data to your Webview HTML
	});
	console.log("🚀 Extension activated");


	const disposable = vscode.commands.registerCommand('hei-world.showCat', () => {
		console.log("🎯 Command hei-world.showCat triggered");

		const mediaPath = path.join(context.extensionPath, 'media');

		let files: string[];
		try {
			files = fs.readdirSync(mediaPath).filter(file => /\.(gif|png|jpe?g)$/i.test(file));
		} catch (err) {
			vscode.window.showErrorMessage(`Error reading media folder: ${err}`);
			return;
		}

		if (files.length === 0) {
			vscode.window.showErrorMessage("No cat images found in media/ 🐾");
			return;
		}

		const randomFile = files[Math.floor(Math.random() * files.length)];
		const filePath = path.join(mediaPath, randomFile);
		const fileUri = vscode.Uri.file(filePath);

		const panel = vscode.window.createWebviewPanel(
			'minKattCatPanel',
			'Meow! 🐱',
			vscode.ViewColumn.One,
			{
				enableScripts: true,
				localResourceRoots: [vscode.Uri.file(mediaPath)]
			}
		);

		const catWebviewUri = panel.webview.asWebviewUri(fileUri);
		console.log("🐱 Selected cat:", catWebviewUri.toString());

		panel.webview.html = getCatHtml(catWebviewUri.toString(), randomFile);

		



	});


	vscode.languages.onDidChangeDiagnostics(event => {
	const activeEditor = vscode.window.activeTextEditor;
	if (!activeEditor) return;

	const fileUri = activeEditor.document.uri;
	const diagnostics = vscode.languages.getDiagnostics(fileUri);

	const hasErrors = diagnostics.some(d => d.severity === vscode.DiagnosticSeverity.Error);

	if (hasErrors) {
		vscode.commands.executeCommand('hei-world.showCat');
	}
	



	});
	

	context.subscriptions.push(disposable);
}



function getCatHtml(catUri: string, name: string) {
	return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<style>
				body {
					background-color: #1e1e1e;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					color: white;
					height: 100vh;
				}
				img {
					max-width: 90%;
					border-radius: 12px;
					box-shadow: 0 0 20px #fff3;
				}
			</style>
		</head>
		<body>
			<h2>woah woah woah meow: ${name}</h2>
			<img src="${catUri}" />
		</body>
		</html>
	`;
}

export function deactivate() {}
