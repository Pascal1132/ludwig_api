module.exports = class APageableData {

    static leftJoins() {
        return [];
    }
    static createFromMysql(rows) {
        return rows.map(row => {
            let data = new APageableData();
            return data;
        });
    }

    static getReferenceForRequest() {
        return {
            name: 'APageableData',
            prefix: '',
            table: '',
            hasParentId: false,
        }
    }

    static requestFilters(params = {}, requestConditions = [], sqlParams = []) {
        return requestConditions;
    }

    static select() { return '*'; }

    getMediaProperties() {
        return [];
    }
    setMediaProperties(medias) {
        return;
    }


    toJSON(language = undefined) {
        return {};
    }
}