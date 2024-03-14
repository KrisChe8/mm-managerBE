const incomeCatRouter = require('express').Router();
const {getAllIncomeCategories, postNewIncomeCategory, deleteIncomeCategoryById} = require('../controllers/incomeCat.controllers')


incomeCatRouter.route('/')
.get(getAllIncomeCategories)
.post(postNewIncomeCategory)

incomeCatRouter.route("/:id")
.delete(deleteIncomeCategoryById)

module.exports = incomeCatRouter;