const {checkCategoryExists, checkUserExistById} = require('../utils/checkExistence');
const {fetchSavingsIncomeByUserId, fetchTotalSavingsIncomeByUserId} = require('../models/savingsIcome.models');

module.exports.getSavingsIncomeByUserId = (req, res, next)=>{
    const {userid} = req.params;

    const {time, category} = req.query;
    const userExistenceQuery = checkUserExistById(userid);

    const savingsIncomeQuery = fetchSavingsIncomeByUserId(userid, time, category);

    const queries = [savingsIncomeQuery, userExistenceQuery]
    const tableName = "incomeCategory"; 
   const rowName = "incomeCategory_name";
   let categoryExistenceQuery;
    if(category){
        categoryExistenceQuery = checkCategoryExists(tableName, rowName, category);
        queries.push(categoryExistenceQuery);
    }

    Promise.all(queries)
    .then((response)=>{
        const savingsIncome = response[0];
        res.status(200).send({savingsIncome})
    })
    .catch((err)=>{
        next(err);
    })
}

module.exports.getTotalSavingsIncomeByUserId = (req, res, next)=>{
    const {userid} = req.params;

    const {time, grouped} = req.query;
    const userExistenceQuery = checkUserExistById(userid);
    const getTotalIncomeQuery = fetchTotalSavingsIncomeByUserId(userid, time, grouped);

    const queries = [getTotalIncomeQuery, userExistenceQuery];

    Promise.all(queries)
    .then((response)=>{
        const savingsIncome = response[0];
        res.status(200).send({savingsIncome})
    })
    .catch((err)=>{
        next(err);
    })
}