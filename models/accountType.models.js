const db = require("../db/db");

module.exports.fetchAllAccountType = ()=>{
    return db.query(`SELECT * FROM userAccountType`)
    .then((result)=>{
        return result.rows;
    })
}

module.exports.insertNewAccount = (accounttype_name) =>{
    if(!accounttype_name){
        return Promise.reject(({status: 400, msg: 'Bad request: missing some properties'}))
    }

    return db.query(`
    INSERT INTO userAccountType (accountType_name)
    VALUES ($1) RETURNING *;
    `, [accounttype_name])
    .then((result)=>{
        return result.rows[0];
    })
}

module.exports.removeAccountType = (id)=>{
    return db.query(`DELETE FROM userAccountType WHERE accountType_id = $1`, [id])
}
