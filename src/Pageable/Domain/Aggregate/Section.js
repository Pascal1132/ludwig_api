const Field = require("./Field");

module.exports = class Section {
    code;
    view;
    fields;
    sectionDataId;
    constructor() {
    }

    toJSON(language = undefined) {
        return {
            code: this.code,
            view: this.view,
            fields: this.fields.map(field => field.toJSON(language)),
            sectionDataId: this.sectionDataId
        }
    }

    static fromJSON(data) {
        let section = new Section();
        section.code = data.code;
        section.view = data.view;
        section.fields = data.fields.map(field => Field.fromJSON(field));
        section.sectionDataId = data.sectionDataId;
        return section;
    }
}
