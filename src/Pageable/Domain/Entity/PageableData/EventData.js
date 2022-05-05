const APageableData = require("../../Backbone/APageableData");

module.exports = class EventData extends APageableData {
    static getReferenceForRequest() {
        return {
            name: 'event',
            prefix: 'event_page_',
            table: 'events_page',
            hasParentId: false
        }
    }
}