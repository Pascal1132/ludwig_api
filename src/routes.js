// list routes for api
module.exports = function () {
    return [
        {
            path: '/fetch_events_by_date',
            method: 'get',
            handler: require('./Pageable/Application/Http/FetchEventsByDate'),
        }
    ];
}