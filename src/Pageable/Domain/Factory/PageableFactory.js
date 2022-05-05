const Pageable = require("../Aggregate/Pageable");
const Section = require("../Aggregate/Section");
const Field = require("../Aggregate/Field");
const Functions = require("../../../Functions");

const encodedColumns = {
    language: [
        "title",
        "preview_text",
    ], serialized: [
        "field_data_value",
        "field_data_options_value",
    ]
}
const languages = process.env.LANGUAGES.split(",");
const mediaHost = process.env.MEDIA_HOST;

module.exports = class PageableFactory {
    static factory(data) {
        let pageable = new Pageable();
        pageable.id = data[0].id;
        pageable.sections = this.factorySections(data);
        pageable.title =data[0].title;
        pageable.layout = data[0].layout;
        pageable.previewText =data[0].preview_text;
        return pageable;
    }

    static async prepareDataForFactory(rows = [], routes = []) {
        rows.forEach(row => {
            // decode the language fields
            encodedColumns.language.forEach(column => {
                row[column] = Functions.languageDecode(row[column]);
            });
            // decode the serialized fields
            encodedColumns.serialized.forEach(column => {
                row[column] = Functions.unserialize(row[column]);
            });
            // Set the url for links
            switch (row.field_type) {
                case 'Link':
                    for (let language in row.field_data_value) {
                        let type = row.field_data_options_value.type;
                        if ((type ? type[language] : '') == 'internal') {
                            let route = routes.find(r => r.url_reference_id === row.field_data_value[language]);
                            if (route) {
                                row.field_data_value[language] = '/' + route.url_url;
                            }
                        }
                    }
                    break;
            }
        });
        return rows;
    }

    static factorySections(data) {
        let sections = [];
        for (let i = 0; i < data.length; i++) {
            // if section is not already in the array, add it
            if (!sections.some(section => section.sectionDataId === data[i].section_data_id)) {
                let section = new Section();
                section.code = data[i].code;
                section.view = data[i].section_view;
                section.sectionDataId = data[i].section_data_id;
                section.fields = this.factoryFields(data, section.sectionDataId);
                sections.push(section);
            }
        }
        return sections;
    }

    static factoryFields(data, sectionDataId) {
        let fields = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].section_data_id === sectionDataId) {
                let field = new Field();
                field.name = data[i].field_name;
                field.type = data[i].field_type;
                field.value = data[i].field_data_value;
                field.optionsValue = data[i].field_data_options_value;
                field.data = data[i].data;
                fields.push(field);
            }
        }
        return fields;
    }



}