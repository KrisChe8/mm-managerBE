const db = require("../db/db");
module.exports.fetchInvestmentIncomeByUserId = (userid, time, category)=>{
    const timeAllowedQuery = ['today', 'week', '10days', 'month', 'year'];
    if(time){
        if(!timeAllowedQuery.includes(time)){
            return Promise.reject({status: 400, msg: "Bad request"})
        }
    }
    

    const transaction_type = 'income';
    const queryParams = [userid, transaction_type];

    let queryStr = `SELECT * FROM investmentTransaction WHERE user_id = $1 AND transaction_type = $2`

    if(category){
        queryStr += ` AND category = $3`;
        queryParams.push(category)
    }

    if(time === 'today'){
        queryStr +=" AND DATE(date) >= CURRENT_DATE AND DATE(date) < CURRENT_DATE + INTERVAL '1 DAY' "
    }

    if(time === 'week'){
        queryStr +=" AND date >= CURRENT_DATE - INTERVAL '7 days '"
    }
    if(time === 'week'){
        queryStr +=" AND date >= CURRENT_DATE - INTERVAL '10 days '"
    }
    if(time === 'month'){
        queryStr +=" AND date >= CURRENT_DATE - INTERVAL '1 Month' "
    }
    if(time === 'year'){
        queryStr +=" AND date >= CURRENT_DATE - INTERVAL '1 Year' "
    }

    queryStr +=" ORDER BY date DESC ";
    return db.query(queryStr, queryParams )
    .then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: 'There is no income yet'})
        }
        return rows;
    })
}

module.exports.fetchTotalInvestmentIncomeByUserId = (userid, time, grouped)=>{
    const timeAllowedQuery = ['today', 'week', '10days', 'month', 'year'];
    if(time){
        if(!timeAllowedQuery.includes(time)){
            return Promise.reject({status: 400, msg: "Bad request"})
        }
    }
    const transaction_type = 'income';
    const queryParams = [userid, transaction_type];
    let queryStr = ""
    const groupedAllowedQuery = ['true', 'false'];
    let placeholder = "";

    if(grouped){
        if(!groupedAllowedQuery.includes(grouped)){
            return Promise.reject({status: 400, msg: "Bad request"})
        }
        placeholder = 'category, ';
    }

    queryStr = `SELECT ${placeholder} SUM(amountPence) AS total_investmentincome  FROM investmentTransaction WHERE user_id = $1 AND transaction_type = $2 `
    if(time === 'today'){
        queryStr +=" AND DATE(date) >= CURRENT_DATE AND DATE(date) < CURRENT_DATE + INTERVAL '1 DAY' "
    }

    if(time === 'week'){
        queryStr +=" AND date >= CURRENT_DATE - INTERVAL '7 days '"
    }
    if(time === 'week'){
        queryStr +=" AND date >= CURRENT_DATE - INTERVAL '10 days '"
    }
    if(time === 'month'){
        queryStr +=" AND date >= CURRENT_DATE - INTERVAL '1 Month' "
    }
    if(time === 'year'){
        queryStr +=" AND date >= CURRENT_DATE - INTERVAL '1 Year' "
    }

    if(grouped){
        if(!groupedAllowedQuery.includes(grouped)){
            return Promise.reject({status: 400, msg: "Bad request"})
        }
        
        queryStr +=" GROUP BY category "
    }

    return db.query(queryStr, queryParams )
    .then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: 'There is no income yet'})
        }
       
        return rows;
    })

}