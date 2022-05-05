const ARepository = require("../../../Utility/Backbone/ARepository");

module.exports = class RoutingRepository extends ARepository {
    async fetchRoutes() {
        return await this.query(`SELECT
            CAST(url_id as CHAR) as url_id,
            CAST(url_reference_id as CHAR) as url_reference_id,
            url_slug,
            url_method,
            url_reference_type,
            url_language,
            getUrl(url_id) as url_url
            FROM urls WHERE
            url_reference_type != "administration"
            AND url_is_view = 1`);
    }
}