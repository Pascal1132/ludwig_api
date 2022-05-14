const AFieldData = require("../../Backbone/AFieldData");
const FormInputData = require("./FormInputData");

module.exports = class FormData extends AFieldData {
    /**
     * 
     * @param {object} id
     * @param {object} title
     * @param {object} subtitle
     * @param {object} redirectUrl
     * @param {object} redirectType
     * @param {FormInputData[]} inputs
     * 
     */
    constructor(id, title, subtitle, redirectUrl, redirectType, inputs = []) {
        super();
        this.id = id;
        this.title = title;
        
        this.subtitle = subtitle;
        this.redirectUrl = redirectUrl;
        this.redirectType = redirectType;
        this.inputs = inputs;
        
    }

    toJSON(language) {
        return {
            id: this.id,
            title: this.title?.[language] ?? this.title,
            subtitle: this.subtitle?.[language] ?? this.subtitle,
            redirectUrl: this.redirectUrl?.[language] ?? this.redirectUrl,
            redirectType: this.redirectType?.[language] ?? this.redirectType,
            inputs: this.inputs.map(input => input.toJSON(language))
        };
    }
}