module.exports = class ARepository {
    language;
    query;
    constructor(query, language) {
        this.query = query;
        this.language = language;
    }
}