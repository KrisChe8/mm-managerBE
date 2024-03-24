const db = require("../db/db")

module.exports.fetchAllCardTransactions =()=>{
    return db.query(`SELECT * FROM cardTransaction`)
    .then((result)=>{
        return result.rows;
    })
}

module.exports.insertNewCardTransaction = (transaction_type, amountPence, category, date, user_id) =>{
    if(!transaction_type || !amountPence || !category || !user_id){
        return Promise.reject(({status: 400, msg: 'Bad request: missing some properties'}))
    }
    const allowedTransactionType = ['expenses', 'income'];
    if(!allowedTransactionType.includes(transaction_type)){
        return Promise.reject({status: 400, msg: "Bad request. Transaction type can be: 'expenses' or 'income'"})
    }
    

    if(date){
        return db.query(`
         INSERT INTO cardTransaction (transaction_type, amountPence,category, date, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;
        `, [transaction_type, amountPence, category, date, user_id])
        .then((result)=>{
        return result.rows[0];
        })
    }else{
        return db.query(`
        INSERT INTO cardTransaction (transaction_type, amountpence, category, user_id) VALUES ($1, $2, $3, $4) RETURNING *;
        `, [transaction_type, amountPence, category, user_id])
         .then((result)=>{
         return result.rows[0];
        })
    }
}

module.exports.removeCardTransactionById = (id) =>{
    return db.query(`DELETE FROM cardTransaction WHERE cardtransaction_id = $1`, [id])
}

module.exports.removeAllCardTransactionsByUserId = (userid) =>{
    return db.query(`DELETE FROM cardTransaction WHERE user_id = $1`, [userid])
}

module.exports.updateCardTransaction = (id, transaction_type, amountPence, category, date, user_id) =>{
    if(!transaction_type || !amountPence || !category || !user_id){
        return Promise.reject(({status: 400, msg: 'Bad request: missing some properties'}))
    }
    
    if(date){
        return db.query(`
    UPDATE cardTransaction
    SET
    transaction_type = $1,
    amountPence = $2,
    category = $3,
    date = $4,
    user_id = $5
    WHERE cardtransaction_id = $6
    RETURNING *;
    `,
    [transaction_type, amountPence, category, date, user_id, id])
    .then((result)=>{
        return result.rows[0];
    })
    }else{
        return db.query(`
    UPDATE cardTransaction
    SET
    transaction_type = $1,
    amountPence = $2,
    category = $3,
    user_id = $4
    WHERE cardtransaction_id = $5
    RETURNING *;
    `,
    [transaction_type, amountPence, category, user_id, id])
    .then((result)=>{
        return result.rows[0];
    })
    }
}