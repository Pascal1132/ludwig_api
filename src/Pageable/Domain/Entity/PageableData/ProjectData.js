const APageableData = require("../../Backbone/APageableData");

module.exports = class ProjectData extends APageableData {

    static getReferenceForRequest() {
        return {
            name: 'project',
            table: 'projects',
            prefix: 'project_',
        };
    }

}