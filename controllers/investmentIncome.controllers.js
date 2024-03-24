const {checkCategoryExists, checkUserExistById} = require('../utils/checkExistence');

const {fetchTotalInvestmentIncomeByUserId, fetchInvestmentIncomeByUserId} = require('../models/investmentIncome.models');

module.exports.getInvestmentIncomeByUserId = (req, res, next) =>{
    const {userid} = req.params;

    const {time, category} = req.query;
    const userExistenceQuery = checkUserExistById(userid);

    const investmentIncomeQuery = fetchInvestmentIncomeByUserId(userid, time, category);

    const queries = [investmentIncomeQuery, userExistenceQuery]

    const tableName = "incomeCategory"; 
    const rowName = "incomeCategory_name";
    let categoryExistenceQuery;
     if(category){
        categoryExistenceQuery = checkCategoryExists(tableName, rowName, category);
         queries.push(categoryExistenceQuery);
     }
 
     Promise.all(queries)
     .then((response)=>{
        const investmentIncome = response[0];
        res.status(200).send({investmentIncome})
    })
    .catch((err)=>{
        next(err);
    })

}

module.exports.getTotalInvestmentIncomeByUserId = (req, res, next)=>{
    const {userid} = req.params;

    const {time, grouped} = req.query;
    const userExistenceQuery = checkUserExistById(userid);
    const getTotalIncomeQuery = fetchTotalInvestmentIncomeByUserId(userid, time, grouped);

    const queries = [getTotalIncomeQuery, userExistenceQuery];
    Promise.all(queries)
    .then((response)=>{
        const investmentIncome = response[0];
        res.status(200).send({investmentIncome})
    })
    .catch((err)=>{
        next(err);
    })
}