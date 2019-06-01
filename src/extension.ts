"use strict";

import * as fs from "fs";
import * as vscode from "vscode";
import { ExtensionInformation, ExtInfo } from "./extinfo";

export async function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.listReadmes", () => {
      let extList: ExtensionInformation[] = [];
      extList = ExtInfo.CreateExtensionList();
      const readmes = extList.map(ext => {
        return { label: ext.name, filePath: ext.path };
      });
      vscode.window.showQuickPick(readmes).then(val => {
        if (fs.existsSync(val.filePath)) {
          vscode.workspace.openTextDocument(val.filePath).then(d => {
            vscode.commands.executeCommand(
              "workbench.action.closeEditorsInOtherGroups"
            );
            vscode.window
              .showTextDocument(d, 0, false)
              .then(() =>
                vscode.commands.executeCommand("markdown.showPreview")
              );
          });
        } else {
          vscode.window.showErrorMessage("Readme.md file not found!");
        }
      });
    })
  );
}
