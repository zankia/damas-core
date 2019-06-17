const assert = require('assert');
const subject = require('../../../routes/utils.js');

function createReq(body, paramIds) {
    return {
        body: body,
        params: {
            id: paramIds
        }
    };
}

describe('routes/utils', () => {
    describe('isArray()', () => {
        it('should return true with an Array body', () => {
            let req = createReq([]);
            assert(isArray(req));
        });

        it('should return false with an Object body', () => {
            let req = createReq({});
            assert(!isArray(req));
        });

        it('should return false with a string body', () => {
            let req = createReq('');
            assert(!isArray(req));
        });

        it('should return true with two ids in params', () => {
            let req = createReq(null, '1,2');
            assert(isArray(req));
        });

        it('should return true with multiple ids in params', () => {
            let req = createReq(null, '1,2,3,4');
            assert(isArray(req));
        });

        it('should return false with one id in params', () => {
            let req = createReq(null, '1');
            assert(!isArray(req));
        });

        it('should return false with no data', () => {
            let req = createReq(null);
            assert(!isArray(req));
        });
    });

    describe('getBodyIds()', () => {
        it('should extract the id number from body', () => {
            let req = createReq(12);
            assert.deepStrictEqual(
                getBodyIds(req),
                [12]
            );
        });

        it('should extract the id string from body', () => {
            let req = createReq('abc');
            assert.deepStrictEqual(
                getBodyIds(req),
                ['abc']
            );
        });

        it('should extract multiple id numbers from body', () => {
            let req = createReq([12, 24]);
            assert.deepStrictEqual(
                getBodyIds(req),
                [12, 24]
            );
        });

        it('should extract multiple id strings from body', () => {
            let req = createReq(['abc', 'def']);
            assert.deepStrictEqual(
                getBodyIds(req),
                ['abc', 'def']
            );
        });

        it('should extract multiple id types from body', () => {
            let req = createReq(['abc', 12]);
            assert.deepStrictEqual(
                getBodyIds(req),
                ['abc', 12]
            );
        });

        it('should return false with empty body', () => {
            let req = createReq(null);
            assert(!getBodyIds(req));
        });
    });

    describe('getRequestIds()', () => {
        it('should extract the id from body', () => {
            let req = createReq(12);
            assert.deepStrictEqual(
                getRequestIds(req),
                [12]
            );
        });

        it('should extract the id from params', () => {
            let req = createReq(null, '12');
            assert.deepStrictEqual(
                getRequestIds(req),
                ['12']
            );
        });

        it('should extract two ids from params', () => {
            let req = createReq(null, '1,2');
            assert.deepStrictEqual(
                getRequestIds(req),
                ['1', '2']
            );
        });

        it('should extract multiple ids from params', () => {
            let req = createReq(null, '1,2,3,4');
            assert.deepStrictEqual(
                getRequestIds(req),
                ['1', '2', '3', '4']
            );
        });

        it('should return false with empty params', () => {
            let req = createReq(null, '');
            assert(!getRequestIds(getRequestIds(req)));
        });
    });

    describe('formatVersion()', () => {
        it('should format a file', () => {
            let name = 'abc.js';
            let suffix = 'def';
            assert.strictEqual(
                formatVersion(name, suffix),
                'abc_def.js'
            );
        });

        it('should format a unix path', () => {
            let name = '/a/b.c/abc.js';
            let suffix = 'def';
            assert.strictEqual(
                formatVersion(name, suffix),
                '/a/b.c/abc_def.js'
            );
        });

        it('should format a windows path', () => {
            let name = 'C:\\a\\b.c\\abc.js';
            let suffix = 'def';
            assert.strictEqual(
                formatVersion(name, suffix),
                'C:\\a\\b.c\\abc_def.js'
            );
        });

        it('should format a unix path without extension', () => {
            let name = '/a/b.c/abc';
            let suffix = 'def';
            assert.strictEqual(
                formatVersion(name, suffix),
                '/a/b.c/abc_def'
            );
        });

        it('should format a windows path without extension', () => {
            let name = 'C:\\a\\b.c\\abc';
            let suffix = 'def';
            assert.strictEqual(
                formatVersion(name, suffix),
                'C:\\a\\b.c\\abc_def'
            );
        });
    });

    describe('sendJSON()', () => {
        it('should send an object', () => {
            //TODO
        });
    });
});
