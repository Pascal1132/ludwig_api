const ARepository = require("../../../Utility/Backbone/ARepository");
const MediaFactory = require("../../Domain/Factory/MediaFactory");


module.exports = class MediaRepository extends ARepository {
    async fetchForPageableFactory(data = []) {
        let bundleMediaReferenceIds = [];
        let mediaReferenceIds = [];
        for (let i = 0; i < data.length; i++) {
            let row = data[i];
            if (row.field_type == 'ImageUpload') {
                
                // foreach field_data_value LANGUAGE
                for (let language in row.field_data_value) {
                    let mediaReferenceId = row.field_data_value[language];
                    if (mediaReferenceId) {
                        bundleMediaReferenceIds.push(mediaReferenceId);
                    }
                }
            }
            if (row.field_type == 'FileUpload') {
                // foreach field_data_value LANGUAGE
                for (let language in row.field_data_value) {
                    let mediaReferenceId = row.field_data_value[language];
                    if (mediaReferenceId) {
                        mediaReferenceIds.push(mediaReferenceId);
                    }
                }
            }
        }
        let medias = await this.fetchMediasByIds(mediaReferenceIds);
        let adaptedBundleMedias = await this.fetchAdaptedBundleMedias(bundleMediaReferenceIds);
        for (let i = 0; i < data.length; i++) {
            let row = data[i];
            if (row.field_type == 'ImageUpload') {
                row.field_data_options_value['medias'] = {};
                // foreach field_data_value LANGUAGE
                let bundle = {};
                row.field_data_options_value['isBundle'] = {};
                row.field_data_options_value['bundle'] = {};
                for (let language in row.field_data_value) {
                    bundle[language] = {};
                    let mediaReferenceId = row.field_data_value[language];
                    if (mediaReferenceId) {
                        bundle[language] = adaptedBundleMedias[mediaReferenceId]?.getUrlObject() || undefined;
                    }
                    // Add isBundle to options value
                    row.field_data_options_value['isBundle'][language] = true;
                    row.field_data_options_value['bundle'][language] = adaptedBundleMedias[mediaReferenceId] || undefined;
                }
                row.field_data_value = bundle;
                
            }
            if (row.field_type == 'FileUpload') {
                row.field_data_options_value['medias'] = {};
                // foreach field_data_value LANGUAGE
                row.field_data_options_value['isBundle'] = {};
                for (let language in row.field_data_value) {
                    let mediaReferenceId = row.field_data_value[language];
                    if (mediaReferenceId) {
                        const foundMedia = medias.filter(media => media.id == mediaReferenceId)[0] || null;
                        if (foundMedia) {
                            row.field_data_value[language] = foundMedia.url;
                            row.field_data_options_value['medias'][language] = foundMedia;
                        }
                    }
                    // Add isBundle to options value
                    row.field_data_options_value['isBundle'][language] = false;
                }
            }
        }
        return data;
    }
    async fetchAdaptedBundleMedias(bundleMediaReferenceIds) {
        let bundles = [];
        if (bundleMediaReferenceIds.length > 0) {
            let sql = 'SELECT adapted_bundle_media_reference_dimension_id as dimension_id, CAST(adapted_bundle_media_reference_bundle_id as CHAR) as reference_id, CONCAT(media_path, CAST(media_id as CHAR), ".", media_extension) as media_url, CAST(media_id as CHAR) as media_id, media_extension, media_alt, media_path, media_extension, media_type FROM adapted_bundle_medias_reference LEFT JOIN medias ON adapted_bundle_media_reference_media_id = media_id WHERE adapted_bundle_media_reference_bundle_id IN ';
            // str repeat number of references
            let references = [];
            for (let i = 0; i < bundleMediaReferenceIds.length; i++) {
                references.push('?');
            }
            sql += `(${references.join(',')})`;
            let result = await this.query(sql, bundleMediaReferenceIds);
            bundles = MediaFactory.bundleCollectionFactory(result);
        }
        return bundles;
    }

    async fetchMediasByIds(mediaIds) {
        let medias = [];
        if (mediaIds.length > 0) {
            let sql = 'SELECT CONCAT(media_path, CAST(media_id as CHAR), ".", media_extension) as media_url, CAST(media_id as CHAR) as media_id, media_alt, media_path, media_extension, media_type FROM medias WHERE media_id IN ';
            // str repeat number of references
            let references = [];
            for (let i = 0; i < mediaIds.length; i++) {
                references.push('?');
            }
            sql += `(${references.join(',')})`;
            let result = await this.query(sql, mediaIds);
            medias = MediaFactory.collectionFactory(result);
        }
        return medias;
    }
}