const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const uri = "mongodb+srv://Dogukan:Dogudogu1.@cluster0.qpgxs8z.mongodb.net/shopDriver?retryWrites=true&w=majority";

let _db;

const initDb = callback => {
    if (_db) {
        console.log("Database already initialized");
        return callback(null, _db);
    }
    mongoClient.connect(uri).then(client => {
        _db = client;
        callback(null, _db);
    }).catch(err => {
        callback(err);
    });
}

const getDb = ()=>{

    if (!_db){
        throw Error("Database not initialized");
    }
    return _db;
}

module.exports = {
    getDb,
    initDb
}
