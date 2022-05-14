const Field = require("../../../src/Pageable/Domain/Aggregate/Field");
const assert = require("assert");

describe("Field", function () {
    describe("toJSON()", function () {
        it("should return the correct JSON", function () {
            let field = new Field();
            field.name = "name";
            field.type = "type";
            field.value = "value";
            field.optionsValue = {
                property: "value"
            };
            field.data = {
                toJSON: function (language) {
                    return "data";
                }
            };
            let json = field.toJSON();
            assert.deepEqual(json, {
                name: "name",
                type: "type",
                value: "value",
                optionsValue: {
                    property: "value"
                },
                data: "data"
            });
        });
        it("should return an object with only the property of the language passed in", function () {
            let field = new Field();
            field.name = "name";
            field.type = "type";
            field.value = {
                fr: "value",
                en: "value"
            };
            field.optionsValue = {
                property: {
                    fr: "value",
                    en: "value"
                }
            };
            field.data = {};
            let json = field.toJSON("fr");
            assert.deepEqual(json, {
                name: "name",
                type: "type",
                value: "value",
                optionsValue: {
                    property: "value"
                },
                data: undefined
            });
        });
    });
});

