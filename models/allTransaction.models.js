const db = require("../db/db");

module.exports.fetchAllTransactionsById = (userid, time)=>{
    const timeAllowedQuery = ['today', 'week', '10 days', 'month', 'year'];
    if(time){
        if(!timeAllowedQuery.includes(time)){
            return Promise.reject({status: 400, msg: "Bad request"})
        }
    }

    const queryParams = [userid];
    let timePlaceholder="";

    if(time === 'today'){
        timePlaceholder =" AND DATE(date) >= CURRENT_DATE AND DATE(date) < CURRENT_DATE + INTERVAL '1 DAY' "
    }

    if(time === 'week'){
        timePlaceholder =" AND date >= CURRENT_DATE - INTERVAL '7 days '"
    }
    if(time === '10days'){
        timePlaceholder =" AND date >= CURRENT_DATE - INTERVAL '10 days '"
    }
    if(time === 'month'){
        timePlaceholder =" AND date >= CURRENT_DATE - INTERVAL '1 Month' "
    }
    if(time === 'year'){
        timePlaceholder =" AND date >= CURRENT_DATE - INTERVAL '1 Year' "
    }

    let queryStr = `SELECT cardcategory, card_transaction, card_amountPence,  card_date, cashcategory, cash_transaction, cash_amountPence,  cash_date,  savingscategory, savings_transaction, savings_amountPence,  savings_date, investmentcategory, investment_transaction, investment_amountPence,  investment_date,  COALESCE(card_date, cash_date, savings_date, investment_date) as date
    
    FROM (
        SELECT category as cardcategory, transaction_type as card_transaction, amountPence as card_amountPence, date as card_date 
        FROM cardTransaction  WHERE user_id = $1 ${timePlaceholder}
    ) FULL OUTER JOIN (
        SELECT category as cashcategory, transaction_type as cash_transaction, amountPence as cash_amountPence, date as cash_date
        FROM cashTransaction  WHERE user_id = $1 ${timePlaceholder} 
        
    )
    ON card_date = cash_date 
    FULL OUTER JOIN (
        SELECT category as savingscategory, transaction_type as savings_transaction, amountPence as savings_amountPence, date as savings_date
        FROM savingsTransaction  WHERE user_id = $1 ${timePlaceholder} 
        
    )
    ON card_date = savings_date 
    FULL OUTER JOIN (
        SELECT category as investmentcategory, transaction_type as investment_transaction, amountPence as investment_amountPence, date as investment_date
        FROM investmentTransaction  WHERE user_id = $1 ${timePlaceholder} 
        
    )
    ON card_date = investment_date
    `

    queryStr += " ORDER BY date DESC"
    return db.query(queryStr, queryParams )
    .then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: 'There is no transaction yet'})
        }
        return rows;
    })
}