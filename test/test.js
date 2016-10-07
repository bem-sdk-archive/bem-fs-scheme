var expect = require('chai').expect,
    scheme = require('..');

describe('path', function() {
    describe('default', function() {
        it('should return path + tech', function() {
            expect(scheme().path({ block: 'a' }, 'js'))
                .eql('a/a.js');
        });

        it('should return nested scheme by default', function() {
            expect(scheme().path({ block: 'a', elem: 'e1' }, 'js'))
                .eql('a/__e1/a__e1.js');
        });

        it('should return error', function() {
            var s = scheme;
            expect(s.bind(s, 'scheme-not-found')).to.throw(/Scheme not found/);
        });
    });

    it('should support optional naming style', function() {
        expect(
            scheme('nested').path({
                block: 'a',
                elem: 'e1',
                modName: 'mn',
                modVal: 'mv'
            }, 'js', { naming: { elem: '%%%', mod: '###' }})
        ).eql('a/%%%e1/###mn/a%%%e1###mn###mv.js');
    });

    describe('lib/schemes/nested', function() {
        it('should return path for a block', function() {
            expect(scheme('nested').path({ block: 'a' }, 'js'))
                .eql('a/a.js');
        });

        it('should return path for a block with modifier', function() {
            expect(
                scheme('nested').path({
                    block: 'a', modName: 'mn', modVal: 'mv'
                }, 'js')
            ).eql('a/_mn/a_mn_mv.js');
        });

        it('should return path for a block with boolean modifier', function() {
            expect(
                scheme('nested').path({
                    block: 'a', modName: 'mn', modVal: true
                }, 'js')
            ).eql('a/_mn/a_mn.js');
        });

        it('should return path for a block with modifier without value', function() {
            expect(
                scheme('nested').path({
                    block: 'a', modName: 'mn'
                }, 'js')
            ).eql('a/_mn/a_mn.js');
        });

        it('should return path for elem', function() {
            expect(
                scheme('nested').path({ block: 'a', elem: 'e1' }, 'js')
            ).eql('a/__e1/a__e1.js');
        });

        it('should return path for modName elem', function() {
            expect(
                scheme('nested').path({
                    block: 'a',
                    elem: 'e1',
                    modName: 'mn',
                    modVal: 'mv'
                }, 'js')
            ).eql('a/__e1/_mn/a__e1_mn_mv.js');
        });

        it('should support optional naming style', function() {
            expect(
                scheme('nested').path({
                    block: 'a',
                    elem: 'e1',
                    modName: 'mn',
                    modVal: 'mv'
                }, 'js', { naming: { elem: '%%%', mod: '###' }})
            ).eql('a/%%%e1/###mn/a%%%e1###mn###mv.js');
        });
    });

    describe('lib/schemes/flat', function() {
        it('should return path for a block', function() {
            expect(scheme('flat').path({ block: 'a' }, 'js'))
                .eql('a.js');
        });

        it('should return path for a block with modifier', function() {
            expect(
                scheme('flat').path({
                    block: 'a', modName: 'mn', modVal: 'mv'
                }, 'js')
            ).eql('a_mn_mv.js');
        });

        it('should return path for elem', function() {
            expect(
                scheme('flat').path({ block: 'a', elem: 'e1' }, 'js')
            ).eql('a__e1.js');
        });

        it('should return path for modName elem', function() {
            expect(
                scheme('flat').path({
                    block: 'a',
                    elem: 'e1',
                    modName: 'mn',
                    modVal: 'mv'
                }, 'js')
            ).eql('a__e1_mn_mv.js');
        });

        it('should support optional naming style', function() {
            expect(
                scheme('flat').path({
                    block: 'a',
                    elem: 'e1',
                    modName: 'mn',
                    modVal: 'mv'
                }, 'js', { naming: { elem: '%%%', mod: '###' }})
            ).eql('a%%%e1###mn###mv.js');
        });
    });
});

describe('parse', function() {
    describe('default', function() {

    });

    describe('nested', function() {
        it('should parse block', function() {
            var expected = { entity: { block: 'b1' }, tech: '' };

            expect(scheme().parse('b1')).eql(expected);
            expect(scheme().parse('b1/')).eql(expected);
        });

        it('should parse elem', function() {
            var expected = { entity: { block: 'b1', elem: 'e1' }, tech: '' };

            expect(scheme().parse('b1__e1')).eql(expected);
            expect(scheme().parse('b1/__e1')).eql(expected);
            expect(scheme().parse('b1/__e1/')).eql(expected);
            expect(scheme().parse('b1/__e1/b1__e1')).eql(expected);
        });

        it('should parse block with boolean modifier', function() {
            var expected = { entity: { block: 'b1', modName: 'm1', modVal: true }, tech: '' };

            expect(scheme().parse('b1_m1')).eql(expected);
            expect(scheme().parse('b1/_m1')).eql(expected);
            expect(scheme().parse('b1/_m1/')).eql(expected);
            expect(scheme().parse('b1/_m1/b1_m1')).eql(expected);
        });

        it('should parse block with key-value modifier', function() {
            var expected = { entity: { block: 'b1', modName: 'm1', modVal: 'v1' }, tech: '' };

            expect(scheme().parse('b1_m1_v1')).eql(expected);
            expect(scheme().parse('b1/_m1/b1_m1_v1')).eql(expected);
        });

        it('should parse elem with boolean modifier', function() {
            var expected = { entity: { block: 'b1', elem: 'e1', modName: 'm1', modVal: true }, tech: '' };

            expect(scheme().parse('b1__e1_m1')).eql(expected);
            expect(scheme().parse('b1/__e1/_m1')).eql(expected);
            expect(scheme().parse('b1/__e1/_m1/')).eql(expected);
            expect(scheme().parse('b1/__e1/_m1/b1__e1_m1')).eql(expected);
        });

        it('should parse elem with key-value modifier', function() {
            var expected = { entity: { block: 'b1', elem: 'e1', modName: 'm1', modVal: 'v1' }, tech: '' };

            expect(scheme().parse('b1__e1_m1_v1')).eql(expected);
            expect(scheme().parse('b1/__e1/_m1/b1__e1_m1_v1')).eql(expected);
        });

        it('should parse tech', function() {
            var expectedBlock = { entity: { block: 'b1' }, tech: 'spec.js' },
                expectedBlockMod = { entity: { block: 'b1', modName: 'm1', modVal: true }, tech: 'spec.js' },
                expectedElem = { entity: { block: 'b1', elem: 'e1' }, tech: 'spec.js' },
                expectedElemMod = { entity: { block: 'b1', elem: 'e1', modName: 'm1', modVal: 'v1' }, tech: 'spec.js' };

            expect(scheme().parse('b1.spec.js')).eql(expectedBlock);
            expect(scheme().parse('b1/b1.spec.js')).eql(expectedBlock);

            expect(scheme().parse('b1_m1.spec.js')).eql(expectedBlockMod);
            expect(scheme().parse('b1/_m1/b1_m1.spec.js')).eql(expectedBlockMod);

            expect(scheme().parse('b1__e1.spec.js')).eql(expectedElem);
            expect(scheme().parse('b1/__e1/b1__e1.spec.js')).eql(expectedElem);

            expect(scheme().parse('b1__e1_m1_v1.spec.js')).eql(expectedElemMod);
            expect(scheme().parse('b1/__e1/_m1/b1__e1_m1_v1.spec.js')).eql(expectedElemMod);
        });

        it('should not parse wrong paths', function() {
            expect(scheme().parse('b1/b2')).eql(undefined);
            expect(scheme().parse('b1/b2/b3')).eql(undefined);
            expect(scheme().parse('b1/b2/b1')).eql(undefined);
            expect(scheme().parse('b1/b2/b1__e1')).eql(undefined);
            expect(scheme().parse('b1/b2/b1__e1.t1')).eql(undefined);
            expect(scheme().parse('b1/_m1/__e1/b1__e1_m1.t1')).eql(undefined);
            expect(scheme().parse('blah/b1/_m1/__e1/b1__e1_m1.t1')).eql(undefined);
            expect(scheme().parse('blah/b1/_m1/__e1/b1__e1_m1/b1__e1_m1.t1')).eql(undefined);
        });
    });

    describe('flat', function() {
        it('should parse block', function() {
            var expected = { entity: { block: 'b1' }, tech: '' };

            expect(scheme('flat').parse('b1')).eql(expected);
        });

        it('should parse elem', function() {
            var expected = { entity: { block: 'b1', elem: 'e1' }, tech: '' };

            expect(scheme('flat').parse('b1__e1')).eql(expected);
        });

        it('should parse block with boolean modifier', function() {
            var expected = { entity: { block: 'b1', modName: 'm1', modVal: true }, tech: '' };

            expect(scheme('flat').parse('b1_m1')).eql(expected);
        });

        it('should parse block with key-value modifier', function() {
            var expected = { entity: { block: 'b1', modName: 'm1', modVal: 'v1' }, tech: '' };

            expect(scheme('flat').parse('b1_m1_v1')).eql(expected);
        });

        it('should parse elem with boolean modifier', function() {
            var expected = { entity: { block: 'b1', elem: 'e1', modName: 'm1', modVal: true }, tech: '' };

            expect(scheme('flat').parse('b1__e1_m1')).eql(expected);
        });

        it('should parse elem with key-value modifier', function() {
            var expected = { entity: { block: 'b1', elem: 'e1', modName: 'm1', modVal: 'v1' }, tech: '' };

            expect(scheme('flat').parse('b1__e1_m1_v1')).eql(expected);
        });

        it('should parse tech', function() {
            var expectedBlock = { entity: { block: 'b1' }, tech: 'spec.js' },
                expectedBlockMod = { entity: { block: 'b1', modName: 'm1', modVal: true }, tech: 'spec.js' },
                expectedElem = { entity: { block: 'b1', elem: 'e1' }, tech: 'spec.js' },
                expectedElemMod = { entity: { block: 'b1', elem: 'e1', modName: 'm1', modVal: 'v1' }, tech: 'spec.js' };

            expect(scheme('flat').parse('b1.spec.js')).eql(expectedBlock);
            expect(scheme('flat').parse('b1_m1.spec.js')).eql(expectedBlockMod);
            expect(scheme('flat').parse('b1__e1.spec.js')).eql(expectedElem);
            expect(scheme('flat').parse('b1__e1_m1_v1.spec.js')).eql(expectedElemMod);
        });
    });
});
