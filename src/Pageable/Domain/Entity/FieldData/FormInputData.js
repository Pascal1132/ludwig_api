const AFieldData = require("../../Backbone/AFieldData");
module.exports = class FormInputData extends AFieldData {
    constructor(title, placeholder, options, required, order, id, type) {
        super();
        this.title = title;
        this.placeholder = placeholder;
        this.options = options;
        this.required = required;
        this.order = order;
        this.id = id;
        this.type = type;
    }
    toJSON(language) {
        return {
            title: this.title[language] ?? this.title,
            placeholder: this.placeholder[language] ?? this.placeholder,
            options: this.options?.[language] ?? this.options,
            required: this.required[language] ?? this.required,
            order: this.order,
            id: this.id,
            type: this.type
        };
    }
}