const Functions = require("../../src/Functions");
const assert = require("assert");

describe("Functions", function () {
    describe("unserialize", function () {
        it("should return an object", function () {
            let value = 'a:1:{s:3:"foo";s:3:"bar";}';
            let result = Functions.unserialize(value);
            assert.equal(typeof result, "object");
        });
        it("should return an object with the correct values", function () {
            let value = 'a:1:{s:3:"foo";s:3:"bar";}';
            let result = Functions.unserialize(value);
            assert.equal(result.foo, "bar");
        });
    });

    describe("languageDecode", function () {
        it("should return an object", function () {
            let value = 'fr@titre|||en@title';
            let result = Functions.languageDecode(value);
            assert.equal(typeof result, "object");
        });
        it("should return an object with the correct values", function () {
            let value = 'fr@titre|||en@title';
            let result = Functions.languageDecode(value);
            assert.equal(result.fr, "titre");
            assert.equal(result.en, "title");
        });
        it("should return null if the value is not a string", function () {
            let value = null;
            let result = Functions.languageDecode(value);
            assert.equal(result, null);
        });
        it("should return empty object if the value is a string unencoded", function () {
            let value = "";
            let result = Functions.languageDecode(value);
            assert.equal(typeof result, "object");
            assert.equal(Object.keys(result).length, 0);
            value = "titre";
            result = Functions.languageDecode(value);
            assert.equal(typeof result, "object");
            assert.equal(Object.keys(result).length, 0);
        });
    });
});