const Pageable = require('../../Domain/Aggregate/Pageable');
const BlogArticleData = require('../../Domain/Entity/PageableData/BlogArticleData');
const CareerJobData = require('../../Domain/Entity/PageableData/CareerJobData');
const EventData = require('../../Domain/Entity/PageableData/EventData');
const MemberData = require('../../Domain/Entity/PageableData/MemberData');
const PageData = require('../../Domain/Entity/PageableData/PageData');
const ProductData = require('../../Domain/Entity/PageableData/ProductData');
const ServiceData = require('../../Domain/Entity/PageableData/ServiceData');

module.exports = class PageableService {
    constructor(repository) {
        this.repository = repository;
    }
    async getFourOFour() {
        return Pageable.fromJSON(await cache.getJson('fourOFour'));
    }
    async refreshFourOFour() {
        let fourOFour = await this.repository.fetchPageable(PageData.getReferenceForRequest(), '00000000-0000-0000-0000-000000000404');
        await cache.setJson('fourOFour', fourOFour);
    }
    getPageableReferenceForRequest() {
        return [
            PageData,
            BlogArticleData,
            CareerJobData,
            EventData,
            MemberData,
            ProductData,
            ServiceData,
        ];
    }

    async fetchPageable(referenceType, prefix, referenceId) {
        let result = await this.repository.fetchPageable(referenceType, prefix, referenceId);
        if (result.length == 0) {
            result = await cache.getJson('fourOFour');
        }
        return result;
    }
}