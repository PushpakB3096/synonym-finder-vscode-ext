import * as vscode from "vscode";
import axios from "axios";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "synonym-finder-vscode-ext.findSynonyms",
    async () => {
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

      // making a call to DataMuse API to get the synonyms
      const resp = await axios(
        `https://api.datamuse.com/words?ml=${selectedText}`
      );

      console.log(resp.data[0].word);
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
