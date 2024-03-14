const data = require('./data/dev-data/index');
const seed = require('./seed');

const db = require('./db');

seed(data).then(()=> db.end());