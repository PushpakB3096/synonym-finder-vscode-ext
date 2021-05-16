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
      const { data } = await axios(
        `https://api.datamuse.com/words?ml=${replaceSpacesAndInsert(
          selectedText
        )}`
      );

      // create a QuickPick obj
      const quickPick = vscode.window.createQuickPick();

      // setting the items to display inside the quickPick
      quickPick.items = data.map((word: any) => {
        return {
          label: word.word,
        };
      });

      // when any quickPick item is selected, call this function
      quickPick.onDidChangeSelection(([item]) => {
        if (item) {
          // replace the selected text with the one user selected
          editor.edit((editBuilder) => {
            editBuilder.replace(editorSelection, item.label);
          });
          // inform user that the change has been made
          vscode.window.showInformationMessage(
            `'${selectedText}' has been replaced with its synonym: '${item.label}'`
          );

          // delete quickPick obj after we are done with it
          quickPick.dispose();
        }
      });
      // disposes the quickPick object on clicking hide
      quickPick.onDidHide(() => quickPick.dispose());

      // show the quickPick
      quickPick.show();
    }
  );

  context.subscriptions.push(disposable);
}

// the following function replaces any whitespace characters in the text with '+'
const replaceSpacesAndInsert = (text: string) => {
  return text.replace(" ", "+");
};
// this method is called when your extension is deactivated
export function deactivate() {}
