const APageableData = require("../../Backbone/APageableData");

module.exports = class PageData extends APageableData {

    static getReferenceForRequest() {
        return {
            name: 'page',
            prefix: 'page_',
            table: 'pages',
            hasParentId: true
        }
    }
}