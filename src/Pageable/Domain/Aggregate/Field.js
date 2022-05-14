module.exports = class Field {
    name;
    type;
    value;
    optionsValue;
    data;
    constructor() {
    }

    // format before sending to the client
    toJSON(language = undefined) {
        // For options value, for each property of the optionsValue object, we need to decode the value
        let optionsValue = {};
        if (this.optionsValue !== undefined) {
            for (let property in this.optionsValue) {
                optionsValue[property] = (language !== undefined) ? this.optionsValue[property][language] : this.optionsValue[property];
            }
        }

        return {
            name: this.name,
            type: this.type,
            value: (language && this.value) ? (this.value[language] ?? '') : this.value,
            optionsValue: optionsValue,
            data: (this.data?.toJSON instanceof Function) ? this.data?.toJSON(language) : undefined
        }
    }

    static fromJSON(data) {
        let field = new Field();
        field.name = data.name;
        field.type = data.type;
        field.value = data.value;
        field.optionsValue = data.optionsValue;
        field.data = data.data;
        return field;
    }
}
