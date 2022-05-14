const AFieldData = require("../../Backbone/AFieldData");

module.exports = class BreadcrumbData extends AFieldData {
    constructor() {
        super();
        this.items = [];
    }

    setItems(items) {
        this.items = items;
    }

    toJSON(language) {
        let items = [];
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            items.push({
                title: item.title?.[language] ?? item.title,
                url: item.url
            });
        }
        return items;
    }
}