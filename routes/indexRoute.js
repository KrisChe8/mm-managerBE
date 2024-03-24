const express = require('express');
const router = express.Router();


const userRouter = require('./userRouter');
const incomeCatRouter = require('./incomeCatRouter');
const expensesCatRouter = require('./expensesCatRouter');
const accountTypeRouter = require('./accountTypeRouter');
const cardTransactionRouter = require('./cardTransactionRouter');
const cashTransactionRouter = require('./cashTransactionRouter');
const savingsTransactionRouter = require('./savingsTransactionRouter');
const investmentTransactionRouter = require('./investmentTransactionRouter');
const cardIncomeRouter = require('./cardIncomeRouter');
const cashIncomeRouter = require('./cashIncomeRouter');
const investmentIncomeRouter = require('./investmentIncomeRouter');
const savingsIncomeRouter = require('./savingsIncomeRouter');
const totalIncomeRouter = require('./totalIncomeRouter');
const totalExpensesRouter = require('./totalExpensesRouter');
const allTransactionsRouter = require('./allTransactionsRouter');
const plannedExpensesRouter = require('./plannedExpensesRouter');
const {getEnspoints} = require('../controllers/getEndpoints.controllers')


// router.get('/', (req, res)=>{
//     res.send('Hi')
// })
router.route('/')
.get(getEnspoints)


router.use('/users', userRouter);
router.use('/incomecat', incomeCatRouter);
router.use('/expensescat', expensesCatRouter)
router.use('/accounttype', accountTypeRouter);
router.use('/cardtransaction', cardTransactionRouter);
router.use('/cashtransaction', cashTransactionRouter);
router.use('/savingstransaction', savingsTransactionRouter);
router.use('/investmenttransaction', investmentTransactionRouter);
router.use('/cardincome', cardIncomeRouter)
router.use('/cashincome', cashIncomeRouter)
router.use('/investmentincome', investmentIncomeRouter);
router.use('/savingsincome', savingsIncomeRouter);
router.use('/totalincome', totalIncomeRouter);

router.use('/totalexpenses', totalExpensesRouter);

router.use('/alltransactions', allTransactionsRouter);

router.use('/plannedexpenses', plannedExpensesRouter);

module.exports = router;