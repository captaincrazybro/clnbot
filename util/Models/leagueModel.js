const mongodb = include('mongodb');
const { validateModel } = include('../MongoUtils/ValidateModel');

let leagueSchema = {
    name: { type: "string", required: true },
    leagueId: { type: "number", required: true },
    fullName: { type: "string", required: true }
}
validateModel(leagueSchema);

modules.exports = leagueSchema;