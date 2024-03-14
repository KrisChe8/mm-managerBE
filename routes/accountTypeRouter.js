const accountTypeRouter = require('express').Router();

const {getAllAccountType, postNewAccountType, deleteAccountTypeById} = require('../controllers/accountType.controllers')

accountTypeRouter.route('/')
.get(getAllAccountType)
.post(postNewAccountType)

accountTypeRouter.route("/:id")
.delete(deleteAccountTypeById)

module.exports = accountTypeRouter;