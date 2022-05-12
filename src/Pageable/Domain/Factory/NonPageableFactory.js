const FormData = require("../Entity/FieldData/FormData");
const FormInputData = require("../Entity/FieldData/FormInputData");
const Functions = require("../../../Functions");

module.exports = class NonPageableFactory {
    static createFormsDataFromMysql(rows) {
        let forms = {};
        for (let row of rows) {
            if (!forms[row.form_id]) {
                let formData = new FormData();
                formData.inputs = [];
                formData.id = row.form_id;
                formData.title = Functions.languageDecode(row.form_title);
                formData.subtitle = Functions.languageDecode(row.form_subtitle);
                formData.redirectUrl = row.form_redirect_url;
                formData.redirectType = Functions.languageDecode(row.form_redirect_type);
                forms[row.form_id] = formData;
            }
            let inputData = new FormInputData();
            inputData.id = row.input_id;
            inputData.title = Functions.languageDecode(row.input_title);
            inputData.placeholder = Functions.languageDecode(row.input_placeholder);
            inputData.options = row.input_options;
            inputData.required = Functions.languageDecode(row.input_required);
            inputData.order = row.input_order;
            inputData.type = row.input_type;
            forms[row.form_id].inputs.push(inputData);
        }
        return Object.values(forms);
    }
}