const APageableData = require("../../Backbone/APageableData");

module.exports = class ProductData extends APageableData {

    static getReferenceForRequest() {
        return {
            name: 'product',
            table: 'products',
            prefix: 'product_',
        };
    }

}