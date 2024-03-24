const {checkCategoryExists, checkUserExistById} = require('../utils/checkExistence');
const {fetchTotalIncomeById} = require('../models/totalIncome.models');

module.exports.getTotalIncomeByUserId = (req, res, next) =>{
    const {userid} = req.params;

    const {time, category} = req.query;
    const userExistenceQuery = checkUserExistById(userid);
    let categoryExistenceQuery;
    const tableName = "incomeCategory"; 
    const rowName = "incomeCategory_name";
    if(category){
        categoryExistenceQuery = checkCategoryExists(tableName, rowName, category);
    }

    const totalIncomeQuery = fetchTotalIncomeById(userid, time, category);

    const queries = [totalIncomeQuery,userExistenceQuery, categoryExistenceQuery ]

    Promise.all(queries)
    .then((response)=>{
        const totalIncome = response[0];
        // console.log(totalIncome)
        res.status(200).send({totalIncome})
    })
    .catch((err)=>{
        console.log(err)
        next(err)
    })

}