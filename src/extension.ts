import * as vscode from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "synonym-finder-vscode-ext.findSynonyms",
    () => {
      // get access to the active editor
      const editor = vscode.window.activeTextEditor;

      // show error if unable to get the editor
      if (!editor) {
        vscode.window.showErrorMessage(
          "Could not get the editor! Please restart VSCode!"
        );
        return;
      }

      // gets the selected text from the editor
      const editorSelection = editor.selection;
      const selectedText = editor.document.getText(editorSelection);

      vscode.window.showInformationMessage(
        `The selectetd text is ${selectedText}`
      );
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
