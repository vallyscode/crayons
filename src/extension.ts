import * as vscode from 'vscode';
import { getCrayons } from './crayons';

export function activate(context: vscode.ExtensionContext) {

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "crayons.highlight",
      () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          return;
        }
        getCrayons(editor).highlight();
      }
    ),
    vscode.commands.registerCommand(
      "crayons.clear",
      () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          return;
        }
        getCrayons(editor).clear();
      }
    ),
    vscode.workspace.onDidChangeTextDocument((event) => {
      console.log("onDidChangeTextDocument", event);
    }),
    vscode.window.onDidChangeActiveTextEditor((event) => {
      console.log("onDidChangeActiveTextEditor", event);
    }),
  );

}

export function deactivate() { }
