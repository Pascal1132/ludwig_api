const FieldFactory = require("../../../src/Pageable/Domain/Factory/FieldFactory");
const assert = require("assert");
const BreadcrumbData = require("../../../src/Pageable/Domain/Entity/FieldData/BreadcrumbData");

// Test that the createFieldData functions works properly
describe("FieldFactory", function () {
    describe("createFieldData", function () {
        describe("BreadcrumbData", function () {
            it("should return an object", function () {
                let field = "Breadcrumb";
                let raw = [{
                    title: "fr@titre|||en@title",
                    url: "url"
                }];
                let result = FieldFactory.createFieldData(field, raw);
                assert.equal(typeof result, "object");
            });
            it("should return an object instance of Breadcrumb", function () {
                let field = "Breadcrumb";
                let raw = [{
                    title: "fr@titre|||en@title",
                    url: "url"
                }];
                let result = FieldFactory.createFieldData(field, raw);
                assert.equal(result instanceof BreadcrumbData, true);
            });
            it("should return an object with the correct values", function () {
                let field = "Breadcrumb";
                let raw = [{
                    title: "fr@titre|||en@title",
                    url: "url"
                }];
                let result = FieldFactory.createFieldData(field, raw);
                assert.equal(result.items[0].title['fr'], "titre");
                assert.equal(result.items[0].url, 'url');
            });
            it("should return an object with the items in reverse order", function () {
                let field = "Breadcrumb";
                let raw = [{
                    title: "fr@titre|||en@title",
                    url: "url"
                }, {
                    title: "fr@titre2|||en@title2",
                    url: "url2"
                }];
                let result = FieldFactory.createFieldData(field, raw);
                assert.equal(result.items[0].title['fr'], "titre2");
                assert.equal(result.items[0].url, 'url2');
                assert.equal(result.items[1].title['fr'], "titre");
                assert.equal(result.items[1].url, 'url');
            });
        });
    });
});

