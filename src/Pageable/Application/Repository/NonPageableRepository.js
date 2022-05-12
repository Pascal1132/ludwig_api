const Functions = require("../../../Functions");
const RoutingService = require("../../../Routing/Application/Service/RoutingService");
const ARepository = require("../../../Utility/Backbone/ARepository");
const NonPageableFactory = require("../../Domain/Factory/NonPageableFactory");


module.exports = class NonPageableRepository extends ARepository {

    async fetchObjectsForField(name, ids, language) {
        // switch case name
        switch (name) {
            case "forms":
                return await this._fetchFormDataFromIds(ids);
                break;
        }
        return null;
    }

    /**
     * Fetch forms from ids
     * @param array formIds 
     * @returns 
     */
    async _fetchFormDataFromIds(ids) {
        let select = `cast(form_id as CHAR) as form_id, form_title, form_subtitle, form_redirect_url, form_redirect_type, cast(input_id as CHAR) as input_id, input_title, input_placeholder, input_options, input_required, input_type, input_order`;

        let sql = `SELECT ${select} FROM forms LEFT JOIN form_inputs ON form_inputs.input_form_id = forms.form_id WHERE form_id IN (`;
        // In case of multiple ids with ?
        let sqlParams = [];
        for (let i = 0; i < ids.length; i++) {
            sql += `?, `;
            sqlParams.push(ids[i]);
        }
        sql = sql.substring(0, sql.length - 2) + `)`;
        let rows = await this.query(sql, sqlParams);
        console.log(rows);
        let routes = await (new RoutingService()).getRoutes();
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            let form_redirect_url = Functions.languageDecode(row.form_redirect_url);
            // foreach key in form_redirect_url
            for (let key in form_redirect_url) {
                let referenceId = form_redirect_url[key];
                // if key is a route
                let r = routes.find(r => r.url_reference_id === referenceId && r.url_language === key);
                if (r) {
                    form_redirect_url[key] = r.url_url;
                }
            }
            row.form_redirect_url = form_redirect_url;
        }
        return NonPageableFactory.createFormsDataFromMysql(rows);
    }
}