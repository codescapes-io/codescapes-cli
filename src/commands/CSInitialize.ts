/**
 * 
 * 
 * 
 */

import path from 'path/posix';
import { CSVariableValue } from '../common/CSData';
import CSUtil from '../utils/CSUtil';

class CSInitialize {
    private inputs: string[];
    private;

    constructor() {

    }

    public initialize(): boolean {
        return true;
    }

    public finalize(): boolean {
        return true;
    }

    public run(input: any, ...flags): number {
        const strTemplateName = input[0];

        let strTargetDirectory = input[1];
        if (typeof strTargetDirectory === 'undefined') {
            strTargetDirectory = process.cwd();
        }
        else {
            strTargetDirectory = path.join(process.cwd(), strTargetDirectory);
        }

        if (typeof strTemplateName === 'undefined') {
            return 1;
        }

        const tree = CSUtil.getTemplateContentPaths(strTemplateName);
        if (tree === null) {
            return 1;
        }

        const variables: string[] = [];

        const regex = new RegExp('{{(.*?)}}', 'gm');
        const regexContent = /c{{(.*?)}}/gim;

        for (const treeItem of tree!) {
            // check file and folder names

            const regexExecOnName = regex.exec(treeItem.strPath);
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

        // Check which variables are already filled by flags.
        const filledVariables: CSVariableValue[] = variables.map(varString => {
            return {
                strName: varString,
                strValue: flags[varString] || ''
            };
        });

        const getVar = (name: string) => {
            for (const item of filledVariables) {
                if (item.strName === name) {
                    return item.strValue;
                }
            }
            return '';
        };

        // replace all variables inside of file and folder names
        for (const v of variables) {
            const regex = new RegExp('{{\\s*' + v + '\\s*}}', 'gm');
            for (const treeItem of tree!) {
                treeItem.strPath = treeItem.strPath.replace(regex, getVar(v));
            }
        }

        // replace all variables in all files' content
        for (const v of variables) {
            // 'c' in front of the regex in order to prevent collisions with other mustache like syntax that may occur in boilerplate files
            const regex = new RegExp('c{{\\s*' + v + '\\s*}}', 'gm');
            for (const treeItem of tree!) {
                if (treeItem.bIsDirectory === false) {
                    treeItem.strContent = treeItem.strContent.replace(regex, getVar(v));
                }
            }
        }

        CSUtil.generateStructureFromTree(tree, strTargetDirectory);

        return 0;
    }
}

export default CSInitialize;
