import { expect } from 'chai';
import CSUtil from '../src/utils/CSUtil';

describe('CSUtil Test Suite', () => {
    it('test', () => {
        expect(CSUtil.getTemplateList()).to.be.true;
    });
});
