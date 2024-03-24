const {checkCategoryExists, checkUserExistById, checkPlannedExpensesExistence} = require('../utils/checkExistence');
const {fetchAllPlannedExpensesBYUserId, insertNewPlannedExpanses, removerPlannedExpensesById, removeAllPlannedExpensesByUSERid} = require('../models/plannedExpenses.models');

module.exports.getPlannedExpensesByUserId = (req, res, next)=>{
    const {userid} = req.params;

    const {time, duration} = req.query;
    const userExistenceQuery = checkUserExistById(userid);

    const plannedExpensesQuery = fetchAllPlannedExpensesBYUserId(userid, time, duration)

    const queries = [plannedExpensesQuery,userExistenceQuery ]
    Promise.all(queries)
    .then((response)=>{
        const plannedExpenses = response[0];
        res.status(200).send({plannedExpenses})
    })
    .catch((err)=>{
        console.log(err)
        next(err);
    })

}

module.exports.postNewPlannedExpenses = (req, res, next) =>{
    const {plannedexpenses_category, amountPence, total_days, user_id, date_start} = req.body;
    const tableName = 'expensesCategory';
    const rowName = 'expensescategory_name';
    const value = plannedexpenses_category;
    const expensesCategoryExistenceQuery = checkCategoryExists(tableName, rowName, value);

    const insertNewPlannedExpQuery = insertNewPlannedExpanses(plannedexpenses_category, amountPence, total_days, user_id, date_start);

    const queries = [insertNewPlannedExpQuery, expensesCategoryExistenceQuery];

    Promise.all(queries)
    .then((response)=>{
        const plannedexpenses =  response[0];
       
        res.status(201).send({plannedexpenses})
    })
    .catch((err)=>{
       
        next(err)
    })
}

module.exports.deletePlannedExpensesById = (req, res, next) =>{
    const {id} = req.params;

    const checkPlannedExpensesExistenceQuery = checkPlannedExpensesExistence(id);
    const deletePlannedExpQuery = removerPlannedExpensesById(id)

    const queries = [deletePlannedExpQuery, checkPlannedExpensesExistenceQuery];
    Promise.all(queries)
    .then(()=>{
        res.status(204).send();
    })
    .catch((err)=>{
        next(err)
    })
}

module.exports.deletePlannedExpensesByUSERid = (req, res, next) =>{
    const {userid} = req.params;

    const checkUserExistenceQuery = checkUserExistById(userid);
    const removeAllPlannedExpensesQuery = removeAllPlannedExpensesByUSERid(userid);

    const queries = [removeAllPlannedExpensesQuery,checkUserExistenceQuery];
    Promise.all(queries)
    .then(()=>{
        res.status(204).send();

    })
    .catch((err)=>{
        next(err)
    })
}