const Section = require("./Section");

module.exports = class Pageable {
    id;
    sections;
    title;
    layout;
    previewText;
    data;
    breadcrumb;
    constructor() {

    }

    toJSON(language = undefined) {
        return {
            id: this.id,
            sections: this.sections.map(section => section.toJSON(language)),
            title: (language) ? (this.title[language] ?? '') : this.title,
            layout: this.layout,
            previewText: (language) ? (this.previewText[language] ?? '') : this.previewText,
            data: this.data,
            breadcrumb: this.breadcrumb,
        };
    }

    static fromJSON(data) {
        let pageable = new Pageable();
        pageable.id = data.id;
        pageable.sections = data.sections.map(section => Section.fromJSON(section));
        pageable.title = data.title;
        pageable.layout = data.layout;
        pageable.previewText = data.previewText;
        pageable.data = data.data;
        pageable.breadcrumb = data.breadcrumb;
        return pageable;
    }
}