const APageableData = require("../../Backbone/APageableData");

module.exports = class MemberData extends APageableData {
    static getReferenceForRequest() {
        return {
            name: 'member',
            table: 'members',
            prefix: 'member_',
        };
    }
}