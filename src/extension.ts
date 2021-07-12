import * as vscode from 'vscode';
import { getCrayonsMeta } from './crayons';

export function activate(context: vscode.ExtensionContext) {

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "crayons.highlight",
      () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          return;
        }
        getCrayonsMeta(editor).highlight();
      }
    ),
    vscode.commands.registerCommand(
      "crayons.clear",
      () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          return;
        }
        getCrayonsMeta(editor).clear();
      }
    ),
    vscode.workspace.onDidChangeTextDocument(() => { }),
    vscode.window.onDidChangeActiveTextEditor(() => { }),
  );

}

export function deactivate() { }
