const PHPUnserializer = require('php-unserialize');
module.exports = class Functions {
    // TOOLS maybe add it to abstract class or a Functions class
    static unserialize(value) {
        // unserialize from php serialization
        return PHPUnserializer.unserialize(value);
    }

    /** This function return a object like this:
     * {fr: "titre", en: "title"}
     * from fr@titre|||en@title
     */
    static languageDecode(value) {
        let result = {};
        if (typeof value === 'string') {
            let languages = value.split("|||");
            for (let i = 0; i < languages.length; i++) {
                let language = languages[i].split("@");
                result[language[0]] = language[1];
            }
        } else {
            result = value;
        }
        return result;
    }
}