const {checkCategoryExists, checkUserExistById} = require('../utils/checkExistence');
const {fetchAllTransactionsById} = require('../models/allTransaction.models');

module.exports.getAllTransactionsByUserId = (req, res, next)=>{
    const {userid} = req.params;

    const {time, category} = req.query;
    const userExistenceQuery = checkUserExistById(userid);

    const allTransactionQuery = fetchAllTransactionsById(userid,time)

    const queries = [allTransactionQuery, userExistenceQuery];

    Promise.all(queries)
    .then((response)=>{
        const allTransactions = response[0];
       
        res.status(200).send({allTransactions})
    })
    .catch((err)=>{
       
        next(err)
    })
}