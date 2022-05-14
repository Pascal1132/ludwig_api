const NonPageableFactory = require("../../../src/Pageable/Domain/Factory/NonPageableFactory");
const assert = require("assert");
const FormData = require("../../../src/Pageable/Domain/Entity/FieldData/FormData");

// test createFormsDataFromMysql from NonPageableFactory.js:
describe("NonPageableFactory", function () {
    describe("createFormsDataFromMysql", function () {
        it("should return an array", function () {
            let rows = [{
                form_id: 1,
                form_title: "fr@title|||en@title",
                form_redirect_url: "redirect_url",
                form_redirect_type: "fr@redirect_type|||en@redirect_type",
                input_id: 1,
                input_title: "fr@title|||en@title",
                input_placeholder: "fr@placeholder|||en@placeholder",
                input_options: "options",
                input_required: "fr@1|||en@0",
                input_order: 1,
                input_type: "LastNameInput"
            }];
            let result = NonPageableFactory.createFormsDataFromMysql(rows);
            assert.equal(typeof result, "object");
            assert.equal(result.length, 1);
            assert.equal(result[0].id, 1);
            assert.equal(result[0].title['fr'], "title");
            assert.equal(result[0].redirectUrl, "redirect_url");
            assert.equal(result[0].redirectType["fr"], "redirect_type");
            assert.equal(result[0].inputs.length, 1);
            assert.equal(result[0].inputs[0].id, 1);
            assert.equal(result[0].inputs[0].title['fr'], "title");
            assert.equal(result[0].inputs[0].placeholder['fr'], "placeholder");
            assert.equal(result[0].inputs[0].options, "options");
            assert.equal(result[0].inputs[0].required['fr'], "1");
            assert.equal(result[0].inputs[0].order, 1);
            assert.equal(result[0].inputs[0].type, "LastNameInput");
        });
        it("should return an array of objects instance of FormData", function () {
            let rows = [{
                form_id: 1,
                form_title: "fr@title|||en@title",
                form_redirect_url: "redirect_url",
                form_redirect_type: "fr@redirect_type|||en@redirect_type",
                input_id: 1,
                input_title: "fr@title|||en@title",
                input_placeholder: "fr@placeholder|||en@placeholder",
                input_options: "options",
                input_required: "fr@1|||en@0",
                input_order: 1,
                input_type: "LastNameInput"
            }];
            let result = NonPageableFactory.createFormsDataFromMysql(rows);
            assert.equal(result[0] instanceof FormData, true);
        });
    });
});
