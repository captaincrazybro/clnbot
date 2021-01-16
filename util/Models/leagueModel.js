const { validateModel } = require('../MongoUtils/ValidateModels');

let leagueSchema = {
    name: { type: "string", required: true },
    leagueId: { type: "number", required: true },
    fullName: { type: "string", required: true },
    isActive: { type: "boolean", required: true },
}
validateModel(leagueSchema);

module.exports = { leagueSchema };