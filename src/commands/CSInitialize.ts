/**
 * 
 * 
 * 
 */

import { AnyFlags, TypedFlags } from 'meow';
import path from 'path';
import { CSVariableValue } from '../common';
import CSUtil from '../utils/CSUtil.js';

class CSInitialize {
    private strTemplateName: string;
    private strTargetDir: string;
    private flags: TypedFlags<AnyFlags> & Record<string, unknown>;

    constructor(strTemplateName: string, strTargetDir: string, flags: TypedFlags<AnyFlags> & Record<string, unknown>) {
        this.flags = flags;

        this.strTemplateName = strTemplateName;
        this.strTargetDir = this.parseTargetDir(strTemplateName);
    }

    private parseTargetDir(strTemplateName: string): string {
        const strTargetDirectory = strTemplateName;

        if (typeof strTargetDirectory === 'undefined') {
            return process.cwd();
        }

        return path.join(process.cwd(), strTargetDirectory);
    }

    public run(): number {
        if (typeof this.strTemplateName === 'undefined') {
            return 1;
        }

        const tree = CSUtil.getTemplateContentPaths(this.strTemplateName);
        if (tree === null) {
            return 2;
        }

        const variables: string[] = [];

        const regexName = new RegExp('{{(.*?)}}', 'gm');
        const regexContent = /c{{(.*?)}}/gim;
        for (const treeItem of tree) {
            // check file and folder names

            const regexExecOnName = regexName.exec(treeItem.strPath);
            if (regexExecOnName !== null) {
                const varName = regexExecOnName[1].trimLeft().trimRight();
                if (!variables.includes(varName)) {
                    variables.push(varName);
                }
            }

            if (!treeItem.bIsDirectory) {
                const regexMatchOnContent = treeItem.strContent.match(regexContent);
                if (regexMatchOnContent !== null) {
                    for (const item of regexMatchOnContent) {
                        const splitItem: string = item;
                        const varName = splitItem
                            .split('c{{')[1]
                            .split('}}')[0]
                            .trimLeft()
                            .trimRight();
                        if (!variables.includes(varName)) {
                            variables.push(varName);
                        }
                    }
                }
            }
        }

        const filledVariables: CSVariableValue[] = variables.map(varString => {
            return {
                strName: varString,
                strValue: this.flags[varString] || ''
            };
        });

        const blankVariableNames: string[] = [];

        for (const v of filledVariables) {
            if (v.strValue === '') {
                blankVariableNames.push(v.strName);
            }
        }

        const getVar = (name: string): string => {
            for (const item of filledVariables) {
                if (item.strName === name) {
                    return item.strValue as string;
                }
            }
            return '';
        };

        // replace all variables inside of file and folder names
        for (const v of variables) {
            const regex = new RegExp('{{\\s*' + v + '\\s*}}', 'gm');
            for (const treeItem of tree) {
                treeItem.strPath = treeItem.strPath.replace(regex, getVar(v));
            }
        }

        for (const v of variables) {
            const regex = new RegExp('c{{\\s*' + v + '\\s*}}', 'gm');
            for (const treeItem of tree) {
                if (treeItem.bIsDirectory === false) {
                    treeItem.strContent = treeItem.strContent.replace(regex, getVar(v));
                }
            }
        }

        CSUtil.generateStructureFromTree(tree, this.strTargetDir);

        return 0;
    }
}

export default CSInitialize;
