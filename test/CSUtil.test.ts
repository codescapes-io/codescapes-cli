import { expect } from 'chai';
import { CSStorageUnit } from '../src/common';
import CSUtil from '../src/utils/CSUtil';
import CSInitialize from '../src/commands/CSInitialize';
import path from 'path';
import fs from 'fs-extra';

describe('CSUtil Test Suite', () => {
    it('directory should exists', () => {
        expect(CSUtil.isDirectoryExists('./test/templates/template1')).to.be.true;
    });

    it('directory should not exists', () => {
        expect(CSUtil.isDirectoryExists('./test/templates/template3')).to.be.false;
    });
});

describe('testtttt', () => {
    beforeEach(function () {
        const paths2 = path.resolve('./test/result');
        fs.rmdirSync(paths2, { recursive: true });
        fs.mkdirSync(paths2);
    });

    it('get template content paths', () => {
        const paths = path.resolve('./test/templates/template2');
        const paths2 = path.resolve('./test/result');
        const pInit = new CSInitialize(paths, paths2, { name: 'test2' });
        pInit.run();
    });

    it.only('get template content paths 2', () => {

        // const content = CSUtil.getTemplateContentPaths('./test/templates/template2');
        // CSUtil.generateStructureFromTree(content as CSStorageUnit[], './results');

        const paths = path.resolve('./test/templates/template1');
        const paths2 = path.resolve('./test/result');
        const pInit = new CSInitialize(paths, paths2, { name: 'test1' });
        pInit.run();
    });
});
