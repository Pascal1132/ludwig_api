const mediaHost = process.env.MEDIA_HOST;
module.exports = class MediaBundle {
    constructor(id = undefined, medias = {}) {
        this.id = id;
        this.medias = medias;
    }

    static fromJSON(data) {
        let mediaBundle = new MediaBundle();
        mediaBundle.id = data.id;
        mediaBundle.medias = data.medias;
        return mediaBundle;
    }

    toJSON() {
        return {
            id: this.id,
            medias: this.medias
        };
    }

    getUrlObject() {
        let urlObject = {};
        for (let mediaId in this.medias) {
            let media = this.medias[mediaId];
            urlObject[mediaId] = mediaHost + media.url;
        }
        return urlObject;
    }
}