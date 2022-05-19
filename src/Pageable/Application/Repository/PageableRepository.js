const MediaRepository = require('../../../Media/Application/Repository/MediaRepository');
const ARepository = require('../../../Utility/Backbone/ARepository');
const FieldFactory = require('../../Domain/Factory/FieldFactory');
const PageableFactory = require('../../Domain/Factory/PageableFactory');

module.exports = class PageableRepository extends ARepository {
    routes;

    async fetchPageable(dataReference, referenceId) {
        const { table, prefix } = dataReference;
        this.language = cache.get('language');
        let sql = this._generateBaseSqlPageable(table, prefix);
        sql += ` WHERE ${prefix}id = ?`;
        let result = this.query(sql, [referenceId]);
        this.routes = cache.getJson('routes');
        let data = PageableFactory.prepareDataForFactory(await result, await this.routes);
        let mediaRepository = new MediaRepository(this.query);
        data = mediaRepository.fetchForPageableFactory(await data);
        data = await this._fieldsFetchCustomData(await data, dataReference);
        let pageable = PageableFactory.factory(await data, await this.routes);
        return pageable;
    }

    _generateBaseSqlPageable(
        table,
        prefix
    ) {
        let select = `SELECT CONCAT(sections.section_property, sections.section_relationship, sections.section_availability, sections.section_code) as code,
        sections.section_view,
        fields.field_name,
        fields.field_type,
        ${table}_fields_data.${prefix}field_data_value as field_data_value,
        CAST(${table}_sections_data.${prefix}section_data_id as CHAR) as section_data_id,
        ${table}_fields_data.${prefix}field_data_options_value as field_data_options_value,
        CAST(${prefix}id as CHAR) as pageable_id,
        modules_types.module_type_view as layout,
        ${table}_data.${prefix}data_title as title,
        ${table}_data.${prefix}data_preview_text as preview_text`;
        let sql = ` FROM ${table} 
        LEFT JOIN ${table}_data ON ${table}_data.${prefix}data_reference_id = ${table}.${prefix}id AND ${table}_data.${prefix}data_created_at = ${table}.${prefix}version
        LEFT JOIN modules_types ON modules_types.module_type_id = ${table}_data.${prefix}data_module_type_id
        LEFT JOIN ${table}_sections_data ON ${table}_sections_data.${prefix}section_data_reference_id = ${prefix}id AND ${table}_sections_data.${prefix}section_data_created_at = ${table}.${prefix}version
        LEFT JOIN sections ON sections.section_id = ${table}_sections_data.${prefix}section_data_section_id
        LEFT JOIN ${table}_fields_data ON ${prefix}section_data_id = ${prefix}field_data_reference_id AND ${table}_fields_data.${prefix}field_data_created_at = ${table}.${prefix}version
        LEFT JOIN fields ON ${table}_fields_data.${prefix}field_data_field_id = fields.field_id AND ${table}_fields_data.${prefix}field_data_created_at = ${table}.${prefix}version `;

        return select + sql;
    }

    async _fieldsFetchCustomData(rows, dataReference) {
        // foreach rows 
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            let rawData;
            switch (row.field_type) {
                case 'Breadcrumb':
                    rawData = await this._fetchBreadcrumbDataFromId(row.pageable_id, dataReference);
                    break;
            }
            row.data = FieldFactory.createFieldData(row.field_type, rawData, this.routes);
        }
        return rows;
    }

    async _fetchBreadcrumbDataFromId(pageableId, { table, name, prefix, hasParentId }) {
        // get parent by parent id if hasParentId is defined in dataReference
        if (hasParentId) {
            // CTE recursive to fetch all parents
            let sql = `WITH RECURSIVE parents AS (
                SELECT * FROM ${table}
                LEFT JOIN ${table}_data ON ${table}_data.${prefix}data_reference_id = ${table}.${prefix}id AND ${table}_data.${prefix}data_created_at = ${table}.${prefix}version
                WHERE ${table}.${prefix}id = ?
                UNION
                SELECT ${table}.*, ${table}_data.* FROM ${table}
                LEFT JOIN ${table}_data ON ${table}_data.${prefix}data_reference_id = ${table}.${prefix}id AND ${table}_data.${prefix}data_created_at = ${table}.${prefix}version
                JOIN parents ON parents.${prefix}parent_id = ${table}.${prefix}id
            )
            SELECT CAST(${prefix}id AS CHAR) as pageable_id, ${prefix}data_title as title FROM parents`;

            let rows = await this.query(sql, [pageableId]);
            // foreach rows, get the route with referenceId = pageableId

            const language = await this.language;
            for (let i = 0; i < rows.length; i++) {
                let row = rows[i];
                let route = (await this.routes).find(route => route.url_reference_id == row.pageable_id && route.url_language == language);
                if (route && pageableId !== row.pageable_id) {
                    row.url = '/' + route.url_url;
                }
            }
            return rows;
        }
    }

    // Fetch objects for field with objects
    async fetchPageableObjects(dataReference, language, params) {
        const { ids } = params;
        const { table, prefix } = dataReference.getReferenceForRequest();
        const leftJoins = dataReference.leftJoins();
        let sql = `SELECT ${dataReference.select()} FROM ` + table;
        for (let i = 0; i < leftJoins.length; i++) {
            let { table, on } = leftJoins[i];
            sql += ` LEFT JOIN ${table} ON ${on}`;
        }

        let sqlParams = [];
        let conditions = [];
        if (ids && ids.length > 0) {
            let str = (`${prefix}id IN (`);
            for (let i = 0; i < ids.length; i++) {
                str += (`?, `);
                sqlParams.push(ids[i]);
            }
            str = `${str.substring(0, str.length - 2)})`;
            conditions.push(str);
        }
        conditions = dataReference.requestFilters(params, conditions);
        if (conditions.length > 0) {
            sql += ` WHERE ` + conditions.join(' AND ');
        }
        let objects = dataReference.createFromMysql(await this.query(sql, sqlParams));
        const mediaRepository = new MediaRepository(this.query);
        // FIXME: optimized to make one request
        for (let i = 0; i < objects.length; i++) {
            let ids = objects[i].getMediaProperties(language);
            let medias = await mediaRepository.fetchMediasByIds(ids);
            objects[i].setMediaProperties(ids.map(id => medias.find(media => media.id == id)), language);
        }
        return objects;
    }
}