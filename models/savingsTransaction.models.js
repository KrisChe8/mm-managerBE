const db = require("../db/db");

module.exports.fetchAllSavingsTransaction = () =>{
    return db.query(`SELECT * FROM savingsTransaction`)
    .then((result)=>{
        return result.rows;
    })
}

module.exports.addSavingsTransaction =(transaction_type, amountPence,category, date, user_id) =>{
    if(!transaction_type || !amountPence || !category || !user_id){
        return Promise.reject(({status: 400, msg: 'Bad request: missing some properties' }))
    }
    const allowedTransactionType = ['expenses', 'income'];

    if(!allowedTransactionType.includes(transaction_type)){
        return Promise.reject({status: 400, msg: "Bad request. Transaction type can be: 'expenses' or 'income'"})
    }

    if(date){
        return db.query(`
         INSERT INTO savingsTransaction (transaction_type, amountPence,category, date, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;
        `, [transaction_type, amountPence, category, date, user_id])
        .then((result)=>{
        return result.rows[0];
        })
    }else{
        return db.query(`
        INSERT INTO savingsTransaction (transaction_type, amountpence, category, user_id) VALUES ($1, $2, $3, $4) RETURNING *;
        `, [transaction_type, amountPence, category, user_id])
         .then((result)=>{
         return result.rows[0];
        })
    }
}

module.exports.removeSavingsTransaction = (id) =>{
    return db.query(`DELETE FROM savingsTransaction WHERE savingstransaction_id = $1`, [id])
}

module.exports.removeSavingsTransactionByUSERId = (userid) =>{
    return db.query(`DELETE FROM savingsTransaction WHERE user_id = $1`, [userid])
}

module.exports.updateSavingsTransaction = (id, transaction_type, amountPence,category, date, user_id) =>{
    if(!transaction_type || !amountPence || !category || !user_id){
        return Promise.reject(({status: 400, msg: 'Bad request: missing some properties' }))
    }
    const allowedTransactionType = ['expenses', 'income'];

    if(!allowedTransactionType.includes(transaction_type)){
        return Promise.reject({status: 400, msg: "Bad request. Transaction type can be: 'expenses' or 'income'"})
    }

    if(date){
        return db.query(`
    UPDATE savingsTransaction
    SET
    transaction_type = $1,
    amountPence = $2,
    category = $3,
    date = $4,
    user_id = $5
    WHERE savingstransaction_id = $6
    RETURNING *;
    `,
    [transaction_type, amountPence, category, date, user_id, id])
    .then((result)=>{
        return result.rows[0];
    })
    }else{
        return db.query(`
    UPDATE savingsTransaction
    SET
    transaction_type = $1,
    amountPence = $2,
    category = $3,
    user_id = $4
    WHERE savingstransaction_id = $5
    RETURNING *;
    `,
    [transaction_type, amountPence, category, user_id, id])
    .then((result)=>{
        return result.rows[0];
    })
    }

}