const BlogArticleData = require("../../../src/Pageable/Domain/Entity/PageableData/BlogArticleData");
const CareerJobData = require("../../../src/Pageable/Domain/Entity/PageableData/CareerJobData");
const EventData = require("../../../src/Pageable/Domain/Entity/PageableData/EventData");
const MemberData = require("../../../src/Pageable/Domain/Entity/PageableData/MemberData");
const PageData = require("../../../src/Pageable/Domain/Entity/PageableData/PageData");
const ProductData = require("../../../src/Pageable/Domain/Entity/PageableData/ProductData");
const ProjectData = require("../../../src/Pageable/Domain/Entity/PageableData/ProjectData");
const ServiceData = require("../../../src/Pageable/Domain/Entity/PageableData/ServiceData");
const assert = require("assert");


describe("BlogArticleData", function () {
    describe("leftJoins", function () {
        it("should return an array", function () {
            let result = BlogArticleData.leftJoins();
            assert.equal(Array.isArray(result), true);
        });
        it("should return an array of object with property table and on", function () {
            let result = BlogArticleData.leftJoins();
            // foreach result
            result.forEach(function (item) {
                assert.equal(typeof item.table, "string");
                assert.equal(typeof item.on, "string");
            });
        });
    });
    describe("getReferenceForRequest", function () {
        it("should return an object", function () {
            let result = BlogArticleData.getReferenceForRequest();
            assert.equal(typeof result, "object");
        });
        it("should return an object with property table, prefix and name", function () {
            let result = BlogArticleData.getReferenceForRequest();
            assert.equal(typeof result.table, "string");
            assert.equal(typeof result.prefix, "string");
            assert.equal(typeof result.name, "string");
        });
    });
    describe("getMediaProperties", function () {
        it("should return an array", function () {
            let data = new BlogArticleData();
            let result = data.getMediaProperties();
            assert.equal(Array.isArray(result), true);
        });
        it("should return an array with 2 values (previewIcon and previewImage)", function () {
            let data = new BlogArticleData();
            data.previewIcon = {fr:"previewIcon"};
            data.previewImage = {fr:"previewImage"};
            let result = data.getMediaProperties("fr");
            assert.equal(result.length, 2);
            assert.equal(result[0], "previewIcon");
            assert.equal(result[1], "previewImage");
        });
    });
});