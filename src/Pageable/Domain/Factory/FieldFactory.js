const BreadcrumbData = require("../Entity/FieldData/BreadcrumbData");
const Functions = require("../../../Functions");

module.exports = class FieldFactory {
    static createFieldData(field, raw, routes) {
        let data = null;
        switch (field){
            case 'Breadcrumb':
                data = new BreadcrumbData();
                // foreach raw, create an object with title and url
                const items = [];
                for (let i = 0; i < raw.length; i++) {
                    const item = raw[i];
                    items.push({
                        title: Functions.languageDecode(item.title),
                        url: item.url
                    });
                }
                data.setItems(items.reverse());
                break;

        }
        return data;
    }
}