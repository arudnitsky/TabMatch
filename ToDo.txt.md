### Think about it
- [x] How to keep two browsers from stepping on each other's saved tabs?
- [x] How to Split up tabs by window when saving
- [ ] How to onboard new users on initial install to add dest folder, help text?
- [ ] Marketing text for extension page in Chrome Store

### Tooling
- [ ] Install Markdown all in One extension
Uninstall -g typescript tslint tslint-eslint-rules
- [ ] How to set up local settings for vscode and use tslint, etc. per project?

### Bugs
- [ ] Can enter or paste negative numbers in timer interval field
- [ ] The timer is not changed when you change the save interval

### Next steps
- [ ] Split up tabs by window
- [ ] if save folder is not set, then flash save folder, set enable timer to false and return
- [ ] add "javascript.format.insertSpaceAfterFunctionKeywordForAnonymousFunctions": false to mac settings
- [x] Save and retrieve all settings from local storage


### VSCode settings
```
Windows:
{
    "typescript.npm": "c:/program files/nodejs/npm.cmd",
    "editor.minimap.enabled": false,
    "editor.fontSize": 12,
    "editor.tabSize": 3,
    "editor.formatOnPaste": true,
    "terminal.integrated.fontSize": 12,
    "workbench.iconTheme": "vscode-great-icons",
    "tslint.trace.server": "off",
    "tslint.jsEnable": true,
    "files.autoSave": "afterDelay",
    "javascript.format.insertSpaceAfterFunctionKeywordForAnonymousFunctions": false,
    "markdown.extension.preview.autoShowPreviewToSide": true
}