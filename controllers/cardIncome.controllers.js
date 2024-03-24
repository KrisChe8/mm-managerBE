const {fetchCardIncomeByUserId, fetchTotalCardIncomeByUserId} = require('../models/cardIncome.models');
const {checkCategoryExists, checkUserExistById} = require('../utils/checkExistence')

module.exports.getCardIncomeByUserId = (req, res, next)=>{
    const {userid} = req.params;

    const {time, category} = req.query;
    const userExistenceQuery = checkUserExistById(userid);

    const cardIncomeQuery = fetchCardIncomeByUserId(userid, time, category);

    const queries = [cardIncomeQuery, userExistenceQuery]

   const tableName = "incomeCategory"; 
   const rowName = "incomeCategory_name";
   let categoryExistenceQuery;
    if(category){
        categoryExistenceQuery = checkCategoryExists(tableName, rowName, category);
        queries.push(categoryExistenceQuery);
    }

    Promise.all(queries)
    .then((response)=>{
        const cardIncome = response[0];
        res.status(200).send({cardIncome})
    })
    .catch((err)=>{
        next(err);
    })
}

module.exports.getTotalCardIncomeByUserId = (req, res, next) =>{
    const {userid} = req.params;

    const {time, grouped} = req.query;
    const userExistenceQuery = checkUserExistById(userid);
    const getTotalIncomeQuery = fetchTotalCardIncomeByUserId(userid, time, grouped);

    const queries = [getTotalIncomeQuery, userExistenceQuery];

    Promise.all(queries)
    .then((response)=>{
        const cardIncome = response[0];
        res.status(200).send({cardIncome})
    })
    .catch((err)=>{
        next(err);
    })

}