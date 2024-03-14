const express = require('express');
const router = express.Router();


const userRouter = require('./userRouter');
const incomeCatRouter = require('./incomeCatRouter');
const expensesCatRouter = require('./expensesCatRouter');
const accountTypeRouter = require('./accountTypeRouter');
router.get('/', (req, res)=>{
    res.send('Hi index!')
})
// router.route('/')
// .get()


router.use('/users', userRouter);
router.use('/incomecat', incomeCatRouter);
router.use('/expensescat', expensesCatRouter)
router.use('/accounttype', accountTypeRouter)
module.exports = router;