import * as vscode from 'vscode';

export class CatFaceViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'catFace.view';

  private _view?: vscode.WebviewView;

  constructor(private readonly _context: vscode.ExtensionContext) {}

  resolveWebviewView(
    view: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = view;

    view.webview.options = {
      enableScripts: true
    };

    view.webview.html = this._getHtmlForWebview();
  }

  private _getHtmlForWebview(): string {
    const catImage = 'https://i.imgur.com/NZ2wz3F.jpg'; // change to a local image if needed
    return `
      <html>
        <body style="text-align:center;font-family:sans-serif;">
          <img src="${catImage}" style="width:80%;border-radius:8px;margin:10px 0;" />
          <h3>CatFace Diagnostics</h3>
          <div id="diagnostics">No errors yet 🐾</div>
        </body>
      </html>
    `;
  }
}
