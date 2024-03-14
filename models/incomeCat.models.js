const db = require("../db/db");

module.exports.fetchAllIncomeCategories = ()=>{
    return db.query('SELECT * FROM incomeCategory ORDER BY incomecategory_name asc')
    .then((result)=>{
        return result.rows;
    })
}

module.exports.insertNewIncomeQuery = (incomecategory_name)=>{
    if(!incomecategory_name){
        return Promise.reject(({status: 400, msg: 'Bad request: missing some properties'}))
    }
   
    return db.query(`
    INSERT INTO incomeCategory (incomecategory_name)
    VALUES ($1) RETURNING *;
    `, [incomecategory_name])
    .then((result)=>{
        return result.rows[0];
    })
}

module.exports.removeIncomeCategory = (id) =>{
    return db.query(`DELETE FROM incomeCategory WHERE incomecategory_id = $1`, [id])
}