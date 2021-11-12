/**
 * All interfaces
 * 
 * Created on 11/10/2021 by Reno Septa Pradana
 */

export interface CSStorageUnit {
    bIsDirectory: boolean;
    strPath: string;
    strFullPath: string;
    strContent: string;
}

export interface CSVariableValue {
    strName: string;
    strValue: unknown;
}
