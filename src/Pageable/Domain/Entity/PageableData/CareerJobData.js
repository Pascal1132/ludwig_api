const APageableData = require("../../Backbone/APageableData");

module.exports = class CareerJobData extends APageableData {
    static getReferenceForRequest() {
        return {
            name: 'career',
            table: 'career_jobs',
            prefix: 'career_job_',
        };
    }
}