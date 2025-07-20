
/*
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "min-katt" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('min-katt.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from min_katt!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

*/

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
	console.log("🚀 Extension activated");
    const disposable = vscode.commands.registerCommand('min-katt.showCat', () => {
		console.log("🎯 Command min-katt.showCat triggered");
        const panel = vscode.window.createWebviewPanel(
            'minKattCatPanel',
            'Meow! 🐱',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))]
            }
        );

        const mediaPath = path.join(context.extensionPath, 'media');
        const files = fs.readdirSync(mediaPath).filter(file => /\.(gif|png|jpe?g)$/i.test(file));
        const randomFile = files[Math.floor(Math.random() * files.length)];
        //const catUri = vscode.Uri.file(path.join(mediaPath, randomFile)).with({ scheme: 'vscode-resource' });
		const catPath = vscode.Uri.file(path.join(mediaPath, randomFile));
		const catUri = panel.webview.asWebviewUri(catPath);

        panel.webview.html = getCatHtml(catUri.toString(), randomFile);

		console.log("Extension activated");

		console.log("All image files:", files); // <-- Add this
		if (files.length === 0) {
   		 vscode.window.showErrorMessage("No cat images found in media/");
    	return;
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
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                    color: #fff;
                    font-family: sans-serif;
                    flex-direction: column;
                }
                img {
                    max-width: 90%;
                    border-radius: 12px;
                    box-shadow: 0 0 20px #fff3;
                }
            </style>
        </head>
        <body>
            <h2>Here’s your random cat: ${name}</h2>
            <img src="${catUri}" alt="Random Cat"/>
        </body>
        </html>
    `;
}

export function deactivate() {}
