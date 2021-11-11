import * as fs from 'fs-extra';
import os from 'os';
import path, { basename } from 'path';
import walk from 'walk-sync';
import { CSStorageUnit } from '../common';

/**
 * Utils function
 * 
 * Created on 11/10/2021 by Reno Septa Pradana
 */

class CSUtil {
  public static strTemplatesPath: string = path.resolve(__dirname, '..', 'templates');

  public static isTemplateExists(strName: string): boolean {
    return fs.existsSync(path.join(CSUtil.strTemplatesPath, strName));
  }

  public static getTemplateList(): string[] {
    const directories: string[] = [];

    const paths = fs.readdirSync(CSUtil.strTemplatesPath);

    for (const strPath of paths) {
      if (fs.lstatSync(path.join(CSUtil.strTemplatesPath, strPath)).isDirectory()) {
        directories.push(strPath);
      }
    }

    return directories;
  }

  public static isDirectoryExists(strDir: string): boolean {
    return fs.pathExistsSync(path.join(process.cwd(), strDir));
  }

  public static getTemplateContentPaths(strName: string,): CSStorageUnit[] | null {
    if (!fs.existsSync(path.join(CSUtil.strTemplatesPath, strName))) {
      return null;
    }

    const trees = walk(path.join(CSUtil.strTemplatesPath, strName));
    const tree: CSStorageUnit[] = trees.map(strPath => {
      const bIsDirectory = fs.lstatSync(path.join(CSUtil.strTemplatesPath, strName, strPath)).isDirectory();
      const strFullPath = path.join(CSUtil.strTemplatesPath, strName, strPath);

      let strContent = '';
      if (!bIsDirectory) {
        strContent = fs.readFileSync(strFullPath).toString();
      }

      return {
        bIsDirectory,
        strPath,
        strFullPath,
        strContent
      };
    });

    tree.sort(CSUtil.sort);
    return tree;
  }

  public static generateStructureFromTree(tree: CSStorageUnit[], strTargetDir: string): void {
    for (const item of tree) {
      if (!item.bIsDirectory) {
        fs.ensureFileSync(path.join(strTargetDir, item.strFullPath));
        fs.writeFileSync(path.join(strTargetDir, item.strFullPath), item.strContent);
      }
    }
  }

  private static sort(a: CSStorageUnit, b: CSStorageUnit): number {
    if (a.bIsDirectory && !b.bIsDirectory) {
      return -1;
    }
    if (!a.bIsDirectory && b.bIsDirectory) {
      return 1;
    }
    return 0;
  }
}

export default CSUtil;
