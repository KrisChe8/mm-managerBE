const {categoryDoesNotExist, checkCategoryExists} = require('../utils/checkExistence');
const {fetchAllExpensesCategories,insertNewExpensesCategory, removeExpensesCategory} = require('../models/expensesCat.models')

module.exports.getAllExpensesCategories = (req, res, next) =>{
    fetchAllExpensesCategories()
    .then((categories)=>{
        res.status(200).send({categories}) 
    })
}

module.exports.postNewExpensesCategory = (req,res, next) =>{
    const {expensescategory_name} = req.body;
    const tableName = 'expensesCategory';
    const rowName = 'expensescategory_name';
    const value = expensescategory_name;
    const expensesCategoryExistenceQuery = categoryDoesNotExist(tableName, rowName, value);

    const insertNewCatQuery = insertNewExpensesCategory(expensescategory_name);
    const queries = [insertNewCatQuery, expensesCategoryExistenceQuery];

    Promise.all(queries)
    .then((response)=>{
        const category = response[0];
        res.status(201).send({category})
    })
    .catch((err)=>{
        next(err)
    })
}

module.exports.deleteExpensesCategoryById = (req, res, next) =>{
    const {id} = req.params;
    const tableName = 'expensesCategory';
    const rowName = 'expensescategory_id';
    const categoryExistenceQuery = checkCategoryExists(tableName,rowName, id);
    const deleteCategoryQuery = removeExpensesCategory(id);
    const queries = [deleteCategoryQuery, categoryExistenceQuery];

    Promise.all(queries)
    .then(()=>{
        res.status(204).send();
    })
    .catch((err)=>{
        next(err);
    })
}