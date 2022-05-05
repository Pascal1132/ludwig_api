const APageableData = require("../../Backbone/APageableData");

module.exports = class ServiceData extends APageableData {
    static getReferenceForRequest() {
        return {
            name: 'service',
            table: 'services_page',
            prefix: 'service_page_',
        };
    }
}