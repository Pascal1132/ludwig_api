const Functions = require("../../../../Functions");
const APageableData = require("../../Backbone/APageableData");

module.exports = class BlogArticleData extends APageableData {
    id;
    previewIcon;
    previewText;
    previewImage;
    title;
    author = {
        firstName: undefined,
        lastName: undefined,
        email: undefined,
    };
    category = {
        title: undefined,
    }

    static leftJoins() {
        return [
            {
                table: "blog_authors",
                on: "blog_articles.blog_article_author_id = blog_authors.blog_author_id",
            },
            {
                table: "blog_articles_data",
                on: "blog_articles.blog_article_id = blog_articles_data.blog_article_data_reference_id AND blog_articles_data.blog_article_data_created_at = blog_articles.blog_article_version",
            },
            {
                table: "blog_categories",
                on: "blog_articles.blog_article_category_id = blog_categories.blog_category_id",
            },
        ];
    }

    static select() {
        return [
            "CAST(blog_articles.blog_article_id as CHAR) as blog_article_id",
            "blog_article_data_preview_icon",
            "blog_article_data_preview_text",
            "blog_article_data_preview_image",
            "blog_article_data_title",
            "blog_author_first_name",
            "blog_author_last_name",
            "blog_author_email",
            "blog_category_title",
        ];
    }

    static getReferenceForRequest() {
        return {
            name: 'blog_article',
            prefix: 'blog_article_',
            table: 'blog_articles',
            hasParentId: false,
        }
    }

    static createFromMysql(rows) {
        return rows.map(row => {
            let data = new BlogArticleData();
            data.id = row.blog_article_id;
            data.previewIcon = Functions.languageDecode( row.blog_article_data_preview_icon);
            data.previewText = Functions.languageDecode( row.blog_article_data_preview_text);
            data.previewImage = Functions.languageDecode( row.blog_article_data_preview_image);
            data.title = Functions.languageDecode( row.blog_article_data_title);
            data.author.firstName =  row.blog_author_first_name;
            data.author.lastName =  row.blog_author_last_name;
            data.author.email =  row.blog_author_email;
            data.category.title = Functions.languageDecode( row.blog_category_title);
            return data;
        });
    }

    getMediaProperties(language) {
        return [
            this.previewIcon?.[language] ?? '',
            this.previewImage?.[language] ?? '',
        ];
    }

    setMediaProperties(medias) {
        this.previewIcon = medias[0];
        this.previewImage = medias[1];
    }

    toJSON(language) {
        return {
            // each language decoded value, return language value if language is not undefined
            id: this.id,
            previewIcon: this.previewIcon,
            previewText: (language) ? (this.previewText[language] ?? '') : this.previewText,
            previewImage: this.previewImage,
            title: (language) ? (this.title[language] ?? '') : this.title,
            author: {
                firstName: this.author.firstName,
                lastName: this.author.lastName,
                email: this.author.email,
            },
            /*category: {
                title: (language) ? (this.category.title[language] ?? '') : this.category.title,
            },*/
        };
    }
}