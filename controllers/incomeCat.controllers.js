const {fetchAllIncomeCategories, insertNewIncomeQuery, removeIncomeCategory} = require('../models/incomeCat.models')
const {categoryDoesNotExist, checkCategoryExists} = require('../utils/checkExistence');


module.exports.getAllIncomeCategories = (req, res, next)=>{
    fetchAllIncomeCategories()
    .then((categories)=>{
        res.status(200).send({categories})
    })
}

module.exports.postNewIncomeCategory = (req, res, next) =>{
    const {incomecategory_name} = req.body;
    const tableName = 'incomeCategory';
    const rowName = 'incomecategory_name';
    let value = incomecategory_name;
    const incomeCategoryExistenceQuery = categoryDoesNotExist(tableName, rowName, value);
    const insertNewCatQuery = insertNewIncomeQuery(incomecategory_name);
    const queries = [insertNewCatQuery, incomeCategoryExistenceQuery];

    Promise.all(queries)
    .then((response)=>{
        const category = response[0];
        res.status(201).send({category})
    })
    .catch((err)=>{
        next(err)
    })
    
}

module.exports.deleteIncomeCategoryById = (req, res, next)=>{
    const {id} = req.params;
    const tableName = 'incomeCategory';
    const rowName = 'incomecategory_id';
    const categoryExistenceQuery = checkCategoryExists(tableName,rowName, id);
    const deleteCategoryQuery = removeIncomeCategory(id);
    const queries = [deleteCategoryQuery, categoryExistenceQuery];

    Promise.all(queries)
    .then(()=>{
        res.status(204).send();
    })
    .catch((err)=>{
        next(err);
    })

}