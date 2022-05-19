const eventPageableData = require('../../Domain/Entity/PageableData/EventData');
module.exports = async function(req, res, {pageableRepository}) {
    let timestamp = req.query.timestamp;
    let language = req.query.language;
    let collection = await pageableRepository.fetchPageableObjects(eventPageableData, language, {
        timestamp,
    })
    let result = collection.map((obj) => {
        return obj.toJSON(language);
    });
    res.status(200).send(result);
}