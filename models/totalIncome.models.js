const db = require("../db/db");

module.exports.fetchTotalIncomeById = (userid, time, category)=>{
    const timeAllowedQuery = ['today', 'week', '10days', 'month', 'year'];
    if(time){
        if(!timeAllowedQuery.includes(time)){
            return Promise.reject({status: 400, msg: "Bad request"})
        }
    }
  
    const transaction_type = 'income';
    const queryParams = [userid, transaction_type];

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

  

    let queryStr = `SELECT cardcategory, total_card, cashcategory,  total_cash, savingscategory, total_savings, investmentcategory, total_investment,  COALESCE(cardcategory, cashcategory, savingscategory, investmentcategory) as category, 
    (COALESCE(total_card, 0) + COALESCE(total_cash, 0) + COALESCE(total_savings, 0) + COALESCE(total_investment, 0)) as totalForCategory
    FROM (
        SELECT category as cardcategory, SUM(COALESCE(amountPence,0 )) as total_card
        FROM cardTransaction  WHERE user_id = $1 AND transaction_type = $2 ${timePlaceholder}
        GROUP BY category
    ) AS cardtransactiontable FULL OUTER JOIN (
        SELECT category as cashcategory, SUM(COALESCE (amountPence, 0)) as total_cash
        FROM cashTransaction  WHERE user_id = $1 AND transaction_type = $2 ${timePlaceholder} 
        GROUP BY category
    ) AS cashtransactiontable
    ON cardcategory = cashcategory 
    FULL OUTER JOIN(
        SELECT category as savingscategory, SUM(COALESCE(amountPence, 0)) as total_savings
        FROM savingsTransaction  WHERE user_id = $1 AND transaction_type = $2 ${timePlaceholder} 
        GROUP BY category
    ) AS savingstransactiontable
    ON cardcategory=savingscategory
    FULL OUTER JOIN(
        SELECT category as investmentcategory, SUM(COALESCE(amountPence,0)) as total_investment
        FROM investmentTransaction  WHERE user_id = $1 AND transaction_type = $2 ${timePlaceholder} 
        GROUP BY category
    ) AS investmenttransactiontable
    ON cardcategory=investmentcategory `

   

    return db.query(queryStr, queryParams )
    .then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: 'There is no income yet'})
        }
        return rows;
    })


}