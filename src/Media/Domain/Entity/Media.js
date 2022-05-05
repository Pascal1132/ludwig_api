module.exports = class Media {
    constructor() {
        this.id = undefined;
        this.name = undefined;
        this.type = undefined;
        this.url = undefined;
        this.size = undefined;
        this.width = undefined;
        this.height = undefined;
        this.extension = undefined;
        this.credits = undefined;
        this.alt = undefined;
        this.title = undefined;

    }

    static fromJSON(data) {
        let media = new Media();
        media.id = data.id;
        media.name = data.name;
        media.type = data.type;
        media.url = data.url;
        media.size = data.size;
        media.width = data.width;
        media.height = data.height;
        media.extension = data.extension;
        media.credits = data.credits;
        media.alt = data.alt;
        media.title = data.title;
        return media;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            url: this.url,
            size: this.size,
            width: this.width,
            height: this.height,
            extension: this.extension,
            credits: this.credits,
            alt: this.alt,
            title: this.title
        };
    }
}