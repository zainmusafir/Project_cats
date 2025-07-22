

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
	console.log("🚀 Extension activated");

	const disposable = vscode.commands.registerCommand('min-katt.showCat', () => {
		console.log("🎯 Command min-katt.showCat triggered");

		const mediaPath = path.join(context.extensionPath, 'media');

		let files: string[];
		try {
			files = fs.readdirSync(mediaPath).filter(file => /\.(gif|png|jpe?g)$/i.test(file));
		} catch (err) {
			vscode.window.showErrorMessage(`Error reading media folder: ${err}`);
			return;
		}

		if (files.length === 0) {
			vscode.window.showErrorMessage("No cat images found in media/");
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
