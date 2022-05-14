const BreadcrumbData = require("../../../src/Pageable/Domain/Entity/FieldData/BreadcrumbData");
const assert = require("assert");
const FormData = require("../../../src/Pageable/Domain/Entity/FieldData/FormData");
const FormInputData = require("../../../src/Pageable/Domain/Entity/FieldData/FormInputData");

describe("BreadcrumbData", function () {
    describe("toJSON", function () {
        it("should return an object", function () {
            let data = new BreadcrumbData();
            let result = data.toJSON();
            assert.equal(typeof result, "object");
        });
        it("should return an object with the correct values", function () {
            let data = new BreadcrumbData();
            data.setItems([{
                title: {
                    fr: "titre",
                    en: "title"
                },
                url: "url"
            }]);
            let items = data.toJSON();
            assert.equal(items[0].title['fr'], "titre");
            assert.equal(items[0].url, 'url');
        });
        it("should return an object with the correct values and with the language passed as parameter", function () {
            let data = new BreadcrumbData();
            data.setItems([{
                title: {
                    fr: "titre",
                    en: "title"
                },
                url: "url"
            }]);
            let items = data.toJSON("en");
            assert.equal(items[0].title, "title");
            assert.equal(items[0].url, 'url');
        });
    });
});

describe("FormData", function () {
    describe("toJSON", function () {
        it("should return an object", function () {
            let data = new FormData();
            let result = data.toJSON();
            assert.equal(typeof result, "object");
        });
        it("should return an object with the correct values", function () {
            let data = new FormData(
                'id',
                {
                    fr: "titre",
                    en: "title"
                },
                {
                    fr: "sous-titre",
                    en: "subtitle"
                },
                {
                    fr: "redirection",
                    en: "redirection"
                },
                {
                    fr: "type de redirection",
                    en: "redirection type"
                },
                [
                    new FormInputData(
                        {
                            fr: "titre",
                            en: "title"
                        },
                        {
                            fr: "placeholder",
                            en: "placeholder"
                        },
                        {
                            fr: ["option1", "option2"],
                            en: ["option1", "option2"]
                        },
                        {
                            fr: "0",
                            en: "0"
                        },
                        "0",
                        "0",
                        "LastNameInput"
                    )
                ]
            );
            let { id, title, subtitle, redirectUrl, redirectType, inputs } = data.toJSON();
            assert.equal(id, 'id');
            assert.equal(title['fr'], "titre");
            assert.equal(title['en'], "title");
            assert.equal(subtitle['fr'], "sous-titre");
            assert.equal(subtitle['en'], "subtitle");
            assert.equal(redirectUrl['fr'], "redirection");
            assert.equal(redirectUrl['en'], "redirection");
            assert.equal(redirectType['fr'], "type de redirection");
            assert.equal(redirectType['en'], "redirection type");
            assert.equal(inputs[0].title['fr'], "titre");
            assert.equal(inputs[0].title['en'], "title");
            assert.equal(inputs[0].placeholder['fr'], "placeholder");
            assert.equal(inputs[0].placeholder['en'], "placeholder");
            assert.equal(inputs[0].options['fr'][0], "option1");
            assert.equal(inputs[0].options['fr'][1], "option2");
            assert.equal(inputs[0].options['en'][0], "option1");
            assert.equal(inputs[0].options['en'][1], "option2");
        });
        it("should return an object with the correct values and with the language passed as parameter", function () {
            let data = new FormData(
                'id',
                {
                    fr: "titre",
                    en: "title"
                },
                {
                    fr: "sous-titre",
                    en: "subtitle"
                },
                {
                    fr: "redirect",
                    en: "redirect"
                },
                {
                    fr: "type de redirect",
                    en: "redirect type"
                },
                [
                    new FormInputData(
                        {
                            fr: "titre",
                            en: "title"
                        },
                        {
                            fr: "placeholder",
                            en: "placeholder"
                        },
                        {
                            fr: { "options": ["option1", "option2"] },
                            en: { "options": ["option1", "option2"] }
                        },
                        {
                            fr: "0",
                            en: "0"
                        },
                        "0",
                        "0",
                        "LastNameInput"
                    )
                ]
            );
            let { id, title, subtitle, redirectUrl, redirectType, inputs } = data.toJSON("en");
            assert.equal(id, 'id');
            assert.equal(title, "title");
            assert.equal(subtitle, "subtitle");
            assert.equal(redirectUrl, "redirect");
            assert.equal(redirectType, "redirect type");
            assert.equal(inputs[0].title, "title");
            assert.equal(inputs[0].placeholder, "placeholder");
            assert.equal(inputs[0].options['options'][0], "option1");
            assert.equal(inputs[0].options['options'][1], "option2");
        });
    });
});