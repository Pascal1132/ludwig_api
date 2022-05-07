const MediaBundle = require("../Aggregate/MediaBundle");
const Media = require("../Entity/Media");
const mediaHost = process.env.MEDIA_HOST;
module.exports = class MediaFactory {
    static factory(row) {
        let media = new Media();
        media.id = row.media_id;
        media.name = row.media_name;
        media.type = row.media_type;
        media.url = mediaHost + row.media_url;
        media.size = row.media_size;
        media.width = row.media_width;
        media.height = row.media_height;
        media.extension = row.media_extension;
        media.credits = row.media_credits;
        media.alt = row.media_alt;
        media.title = row.media_title;
        return media;
    }

    static bundleCollectionFactory(data) {
        // Foreach medias in data, lets create a Media object and a bundle for each that have the same reference_id
        let bundles = {};
        for (let row of data) {
            // if reference_id is not in bundles, create a new bundle
            if (!bundles[row.reference_id]) {
                bundles[row.reference_id] = new MediaBundle();
                bundles[row.reference_id].id = row.reference_id;
                bundles[row.reference_id].medias = {};
            }
            // add media to bundle
            bundles[row.reference_id].medias[row.dimension_id] = this.factory(row);
        }
        return bundles;
    }

    static collectionFactory(data) {
        let collection = [];
        for (let row of data) {
            collection.push(this.factory(row));
        }
        return collection;
    }
}