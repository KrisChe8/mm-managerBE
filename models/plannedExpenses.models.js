const db = require("../db/db");

module.exports.fetchAllPlannedExpensesBYUserId = (userid, time, duration)=>{
    const timeAllowedQuery = [ 'week', '10days', 'month', 'year'];
    if(time){
        if(!timeAllowedQuery.includes(time)){
            return Promise.reject({status: 400, msg: "Bad request"})
        }
    }
   

    const queryParams = [userid];
    let queryStr = `SELECT * FROM plannedExpenses WHERE user_id = $1 `

    if(time === 'week'){
        queryStr +=" AND date_start >= CURRENT_DATE - INTERVAL '7 days '"
    }
    if(time === '10days'){
        queryStr +=" AND date_start >= CURRENT_DATE - INTERVAL '10 days '"
    }
    if(time === 'month'){
        queryStr +=" AND date_start >= CURRENT_DATE - INTERVAL '1 Month' "
    }
    if(time === 'year'){
        queryStr +=" AND date_start >= CURRENT_DATE - INTERVAL '1 Year' "
    }

    if(duration){
        if(!timeAllowedQuery.includes(duration)){
            return Promise.reject({status: 400, msg: "Bad request"})
        }
        
        queryStr +=` AND total_days= '${duration}' `
    }
   

    queryStr +=" ORDER BY date_start DESC ";

    return db.query(queryStr, queryParams )
    .then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: 'You have no planned expenses yet'})
        }
        return rows;
    })
}


module.exports.insertNewPlannedExpanses = (plannedexpenses_category, amountPence, total_days, user_id, date_start)=>{
    if(!plannedexpenses_category || !amountPence || !total_days || !user_id){
        return Promise.reject(({status: 400, msg: 'Bad request: missing some properties'}))
    }

   

    if(date_start){
        return db.query(`
        INSERT INTO plannedExpenses 
        (plannedexpenses_category, amountPence,total_days, user_id, date_start)
        VALUES ($1, $2, $3, $4, $5) RETURNING *;`, [plannedexpenses_category, amountPence, total_days, user_id, date_start])
        .then((result)=>{
            return result.rows[0];
        })
    }else{
        return db.query(`
    INSERT INTO plannedExpenses 
    (plannedexpenses_category, amountPence,total_days, user_id)
    VALUES ($1, $2, $3, $4) RETURNING *;`, [plannedexpenses_category, amountPence, total_days, user_id])
    .then((result)=>{
        return result.rows[0];
    })
    }
}

module.exports.removerPlannedExpensesById = (id) =>{
    return db.query(`DELETE FROM plannedExpenses WHERE plannedexpenses_id = $1`, [id])
}

module.exports.removeAllPlannedExpensesByUSERid = (userid) =>{
    return db.query(`DELETE FROM plannedExpenses WHERE user_id = $1`, [userid])
}