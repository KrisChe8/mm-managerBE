const db = require("../db/db");


module.exports.fetchAllExpensesCategories = ()=>{
    return db.query(`SELECT * FROM expensesCategory ORDER BY expensescategory_name asc`)
    .then((result)=>{
        return result.rows;
    })
}

module.exports.insertNewExpensesCategory = (expensescategory_name)=>{
 if(!expensescategory_name){
    return Promise.reject(({status: 400, msg: 'Bad request: missing some properties'}))
 }

 return db.query(`
 INSERT INTO expensesCategory (expensescategory_name) VALUES ($1) RETURNING *;
 `, [expensescategory_name])
 .then((result)=>{
    return result.rows[0];
 })
}


module.exports.removeExpensesCategory = (id)=>{
    return db.query(`DELETE FROM expensesCategory WHERE expensescategory_id = $1`, [id])
}