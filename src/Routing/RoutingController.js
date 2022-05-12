const RoutingService = require('./Application/Service/RoutingService');
const PageableService = require('../Pageable/Application/Service/PageableService');
const RoutingRepository = require('./Application/Repository/RoutingRepository');
const PageableRepository = require('../Pageable/Application/Repository/PageableRepository');
const cache = require('../Utility/cacheManager');
const NonPageableRepository = require('../Pageable/Application/Repository/NonPageableRepository');
const RoutingController = function (query) {
    var express = require('express');
    var router = express.Router();
    var routingRepository = new RoutingRepository(query);
    var pageableRepository = new PageableRepository(query);
    var nonPageableRepository = new NonPageableRepository(query);
    var routingService = new RoutingService(routingRepository);
    var pageableService = new PageableService(pageableRepository);

    routingService.refreshRoutes().then(() => {
        pageableService.refreshFourOFour();
    });

    // define the home page route
    router.get('/', async (req, res) => {
        let result;
        let language;
        var currentTimestamp = new Date().getTime();
        try {
            // get route from params
            let route = req.query.route.substring(1)
            console.log('➡️: ' + route)
            // if route ends with /, remove it
            if (route.endsWith('/')) {
                route = route.substring(0, route.length - 1)
            }
            // language is the first part of the route
            language = route.split('/')[0] ?? 'fr';
            await cache.set('language', language);
            // get route where url_url matches route in routes
            routeFound = await routingService.getRoute(route);
            // Find the referencesTypes that match the route.url_reference_type
            let pageableData = pageableService.getPageableReferenceForRequest().filter((pageableData) => {
                return pageableData.getReferenceForRequest().table == routeFound.url_reference_type;
            })[0] ?? null;
            result = await pageableRepository.fetchPageable(pageableData.getReferenceForRequest(), routeFound.url_reference_id);

        } catch (err) {
            result = await pageableService.getFourOFour();
        }
        res.json({
            pageable: result.toJSON(language),
            language: language,
        })
        //display response time
        console.log('⌛: ' + (new Date().getTime() - currentTimestamp) + ' ms')
        routingService.refreshRoutes().then(() => {
            pageableService.refreshFourOFour();
        });
    })

    router.get('/objects/:name', async (req, res) => {
        let name = req.params.name;
        const { ids, language } = JSON.parse(req.query.ids);
        let pageableData = pageableService.getPageableReferenceForRequest().filter((pageableData) => {
            return pageableData.getReferenceForRequest().table == name;
        })[0] ?? null;
        let collection;
        if (pageableData) {
            collection = await pageableRepository.fetchPageableObjectsForField(pageableData, ids, language);
        } else {
            collection = await nonPageableRepository.fetchObjectsForField(name, ids, language);
        }
        if (!collection) {
            res.status(404).json({
                error: 'Object not found',
            })
        } else {
            // map arr toJSON(language)
            let result = collection.map((obj) => {
                return obj.toJSON(language);
            });
            res.json(result);
        }

    })
    return router;
}
module.exports = RoutingController;

