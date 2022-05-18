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
    describe("createFromMysql", function () {
        it("should return an array of APageableData", function () {
            let result = BlogArticleData.createFromMysql([{}]);
            assert.equal(Array.isArray(result), true);
            assert.equal(result[0] instanceof BlogArticleData, true);
        });
        it("should return an array of APageableData with correct values", function () {
            let result = BlogArticleData.createFromMysql([{
                blog_article_id: 1,
                blog_article_data_preview_icon: "fr@previewIcon|||en@previewIcon",
                blog_article_data_preview_image: "fr@previewImage|||en@previewImage",
                blog_article_data_preview_text: "fr@title|||en@title",
                blog_article_data_title: "fr@title|||en@title",
                blog_author_first_name: "First Name",
                blog_author_last_name: "Last Name",
                blog_author_email: "Email",
                blog_category_title: "fr@Category|||en@Category",
            }]);
            assert.equal(result[0].previewIcon.fr, "previewIcon");
            assert.equal(result[0].previewImage.fr, "previewImage");
            assert.equal(result[0].previewText.fr, "title");
            assert.equal(result[0].title.fr, "title");
            assert.equal(result[0].author.firstName, "First Name");
            assert.equal(result[0].author.lastName, "Last Name");
            assert.equal(result[0].author.email, "Email");
            assert.equal(result[0].category.title.fr, "Category");
        });

    });
    describe("setMediaProperties", function () {
        it("should set the previewIcon as the first item of the array in params and the previewImage as the second item", function () {
            let data = new BlogArticleData();
            let medias = ["previewIcon", "previewImage"];
            data.setMediaProperties(medias, "fr");
            assert.equal(data.previewIcon["fr"], "previewIcon");
            assert.equal(data.previewImage["fr"], "previewImage");
        });
    });
    describe("toJSON", function () {
        it("should return an object", function () {
            let data = new BlogArticleData();
            let result = data.toJSON();
            assert.equal(typeof result, "object");
        });
        it("should return an object with empty string if not encoded", function () {
            let data = new BlogArticleData();
            data.previewIcon = "previewIcon";
            data.previewImage = "previewImage";
            data.previewText = "previewText";
            data.title = "title";
            data.author = {firstName:"firstName", lastName:"lastName", email:"email"};
            data.category = {title:"title"};
            let result = data.toJSON();
            assert.equal(result.previewIcon, "");
            assert.equal(result.previewImage, "");
            assert.equal(result.previewText, "");
            assert.equal(result.title, "");
            assert.equal(result.author.firstName, "firstName");
            assert.equal(result.author.lastName, "lastName");
            assert.equal(result.author.email, "email");
            assert.equal(result.category.title, "");
        });
        it("should return an object with correct values from the language passed in", function () {
            let data = new BlogArticleData();
            data.previewIcon = {
                fr:"previewIcon",
                en:"previewIconEn"
            };
            data.previewImage = {
                fr:"previewImage",
                en:"previewImageEn"
            };
            data.previewText = {
                fr:"previewText",
                en:"previewTextEn"
            };
            data.title = {
                fr:"title",
                en:"titleEn"
            };
            data.author = {firstName:"firstName", lastName:"lastName", email:"email"};
            data.category = {title:{
                fr:"title",
                en:"titleEn"
            }};
            let result = data.toJSON("fr");
            assert.equal(result.previewIcon, "previewIcon");
            assert.equal(result.previewImage, "previewImage");
            assert.equal(result.previewText, "previewText");
            assert.equal(result.title, "title");
            assert.equal(result.author.firstName, "firstName");
            assert.equal(result.author.lastName, "lastName");
            assert.equal(result.author.email, "email");
            assert.equal(result.category.title, "title");
        });
    });
});