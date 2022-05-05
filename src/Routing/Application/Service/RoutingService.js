module.exports = class RoutingService {
    constructor(repository) {
        this.repository = repository;
    }
    async refreshRoutes() {
        await cache.setJson('routes', await this.repository.fetchRoutes()) ;
    }
    async getRoutes() {
        return await cache.getJson('routes');
    }
    async getRoute(route) {
        return (await this.getRoutes()).find(r => r.url_url === route);
    }
    async getRouteByReferenceId(id){
        return (await this.getRoutes()).find(r => r.url_reference_id === id);
    }
}