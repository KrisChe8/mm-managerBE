const {checkCategoryExists, checkUserExistById} = require('../utils/checkExistence');
const {fetchCashIncomeByUserId, fetchTotalCashIncomeByUserId} = require('../models/cashIncome.models');

module.exports.getCashIncomeByUserId = (req, res, next)=>{
    const {userid} = req.params;

    const {time, category} = req.query;

    const userExistenceQuery = checkUserExistById(userid);

    const cashIncomeQuery = fetchCashIncomeByUserId(userid, time, category);

    const queries = [cashIncomeQuery, userExistenceQuery];

    const tableName = "incomeCategory"; 
    const rowName = "incomeCategory_name";

   if(category){
    const categoryExistenceQuery = checkCategoryExists(tableName, rowName, category);
    queries.push(categoryExistenceQuery);
    }

    Promise.all(queries)
    .then((response)=>{
        const cashIncome = response[0];
        res.status(200).send({cashIncome})
    })
    .catch((err)=>{
        next(err)
    })

}

module.exports.getTotalCashIncomeByUserId = (req, res, next)=>{
    const {userid} = req.params;

    const {time, grouped} = req.query;
    const userExistenceQuery = checkUserExistById(userid);
    const getTotalIncomeQuery =  fetchTotalCashIncomeByUserId(userid, time, grouped);
    const queries =[getTotalIncomeQuery, userExistenceQuery];

    Promise.all(queries)
    .then((response)=>{
        const cashIncome = response[0];
        res.status(200).send({cashIncome})
    })
    .catch((err)=>{
        next(err);
    })
}