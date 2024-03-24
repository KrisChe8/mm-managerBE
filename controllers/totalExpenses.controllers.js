const {checkCategoryExists, checkUserExistById} = require('../utils/checkExistence');
const {fetchTotalExpensesById} = require('../models/totalExpenses.models');

module.exports.getTotalExpensesByUserId = (req, res, next)=>{
    const {userid} = req.params;

    const {time, category} = req.query;
    const userExistenceQuery = checkUserExistById(userid);
    let categoryExistenceQuery;
    const tableName = "expensesCategory"; 
    const rowName = "expensesCategory_name";
    if(category){
        categoryExistenceQuery = checkCategoryExists(tableName, rowName, category);
    }
    const totalExpensesQuery = fetchTotalExpensesById(userid, time, category);

    const queries = [totalExpensesQuery, userExistenceQuery,  categoryExistenceQuery];

    Promise.all(queries)
    .then((response)=>{
        const totalExpenses = response[0];
        
        res.status(200).send({totalExpenses})
    })
    .catch((err)=>{
        
        next(err);
    })
}