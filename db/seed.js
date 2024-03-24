const db = require('./db');
const format = require('pg-format');
const {usersData,incomeCategoryData, expensesCategoryData, userAccauntType, cardTransactionData, cashTransactionData, investmentTransactionData, savingsTransactionData, plannedExpensesData } = require('./data/dev-data/index');

const seed = ({usersData, incomeCategoryData, expensesCategoryData, userAccauntType, cardTransactionData, cashTransactionData, investmentTransactionData, savingsTransactionData, plannedExpensesData }) => {
    return db.query(`DROP TABLE IF EXISTS savingsTransaction;`)
    .then(()=>{
        return db.query(`DROP TABLE IF EXISTS incomeCategory;`)
    }).then(()=>{
        return db.query(`DROP TABLE IF EXISTS expensesCategory;`)
    }).then(()=>{
        return db.query(`DROP TABLE IF EXISTS userAccountType;`)
    }).then(()=>{
        return db.query(`DROP TABLE IF EXISTS cardTransaction;`)
    }).then(()=>{
        return db.query(`DROP TABLE IF EXISTS cashTransaction;`)
    }).then(()=>{
        return db.query(`DROP TABLE IF EXISTS investmentTransaction;`)
    }).then(()=>{
        return db.query(`DROP TABLE IF EXISTS plannedExpenses;`)
    }).then(()=>{
        return db.query(`DROP TABLE IF EXISTS users;`)
    }).then(()=>{
        return db.query(`CREATE TABLE IF NOT EXISTS users(
            user_id SERIAL PRIMARY KEY,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            email VARCHAR(60) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            avatar VARCHAR(355)
        );`)
    })
    .then(()=>{
        return db.query(`CREATE TABLE IF NOT EXISTS incomeCategory(
            incomecategory_id SERIAL PRIMARY KEY,
            incomecategory_name VARCHAR(100) NOT NULL UNIQUE
        );`)
    })
    .then(()=>{
        return db.query(`CREATE TABLE IF NOT EXISTS expensesCategory(
            expensesCategory_id SERIAL PRIMARY KEY,
            expensesCategory_name VARCHAR(100) NOT NULL UNIQUE
        );`)
    })
    .then(()=>{
        return db.query(`CREATE TABLE IF NOT EXISTS userAccountType(
            accountType_id SERIAL PRIMARY KEY,
            accountType_name VARCHAR(100) NOT NULL UNIQUE
        );`)
    }).then(()=>{
        return db.query(`CREATE TABLE IF NOT EXISTS cardTransaction(
            cardTransaction_id SERIAL PRIMARY KEY,
            transaction_type VARCHAR(25) NOT NULL,
            amountPence INT NOT NULL,
            category VARCHAR(250) NOT NULL,
            date TIMESTAMPTZ default now(),
            user_id INT NOT NULL, FOREIGN KEY(user_id) REFERENCES users(user_id)
            
        );`)
    }).then(()=>{
        return db.query(`CREATE TABLE IF NOT EXISTS cashTransaction(
            cashTransaction_id SERIAL PRIMARY KEY,
            transaction_type VARCHAR(25) NOT NULL,
            amountPence INT NOT NULL,
            category VARCHAR(250) NOT NULL,
            date TIMESTAMPTZ default now(),
            user_id INT NOT NULL, FOREIGN KEY(user_id) REFERENCES users(user_id)
            
        );`)
    }).then(()=>{
        return db.query(`CREATE TABLE IF NOT EXISTS investmentTransaction(
            investmentTransaction_id SERIAL PRIMARY KEY,
            transaction_type VARCHAR(25) NOT NULL,
            amountPence INT NOT NULL,
            category VARCHAR(250) NOT NULL,
            date TIMESTAMPTZ default now(),
            user_id INT NOT NULL, FOREIGN KEY(user_id) REFERENCES users(user_id)
            
        );`)
    }).then(()=>{
        return db.query(`CREATE TABLE IF NOT EXISTS savingsTransaction(
            savingsTransaction_id SERIAL PRIMARY KEY,
            transaction_type VARCHAR(25) NOT NULL,
            amountPence INT NOT NULL,
            category VARCHAR(250) NOT NULL,
            date TIMESTAMPTZ default now(),
            user_id INT NOT NULL, FOREIGN KEY(user_id) REFERENCES users(user_id)
            
        );`)
    }).then(()=>{
        return db.query(`CREATE TABLE IF NOT EXISTS plannedExpenses(
            plannedexpenses_id SERIAL PRIMARY KEY,
            plannedexpenses_category VARCHAR(250) NOT NULL,
            amountPence INT NOT NULL,
            total_days VARCHAR(250) NOT NULL,
            date_start TIMESTAMPTZ default now(),
            user_id INT NOT NULL, FOREIGN KEY(user_id) REFERENCES users(user_id)
            
        );`)
    })
    .then(()=>{
        return insertUserData();
    }).then(()=>{
        return insertIncomeCategory();
    }).then(()=>{
        return insertExpensesCategory();
    }).then(()=>{
        return insertAccountType();
    }).then(()=>{
        return insertCardTransaction();
    }).then(()=>{
        return insertCashTransaction();
    }).then(()=>{
        return insertInvestmentTransactionData();
    }).then(()=>{
        return insertSavingsTransactionData();
    }).then(()=>{
        return inserPlannedExpensesData();
    })
}


function insertUserData(){
    const sqlQuery = format(
        `INSERT INTO users (first_name,last_name, email, password, avatar)
        VALUES
        %L
        RETURNING *`,
        usersData.map((user)=>{
            return [user.first_name, user.last_name, user.email, user.password, user.avatar]
        })
    )
    return db.query(sqlQuery)
}

function insertIncomeCategory(){
    const sqlQuery = format(
        `INSERT INTO incomeCategory (incomeCategory_name)
        VALUES
        %L
        RETURNING *`,
        incomeCategoryData.map((incomeCat)=>{
            return [incomeCat.incomeCategoryName]
        })
    )
    return db.query(sqlQuery)
}

function insertExpensesCategory(){
    const sqlQuery = format(
        `INSERT INTO expensesCategory (expensesCategory_name)
        VALUES
        %L
        RETURNING *`,
        expensesCategoryData.map((expenseCat)=>{
            return [expenseCat.expensesCategoryName]
        })
    )
    return db.query(sqlQuery)
}


function insertAccountType(){
    const sqlQuery = format(
        `INSERT INTO userAccountType (accountType_name)
        VALUES
        %L
        RETURNING *`,
        userAccauntType.map((accaunt)=>{
            return [accaunt.accountType_name]
        })
    )
    return db.query(sqlQuery)
}
function insertCardTransaction(){
    const sqlQuery = format(
        `INSERT INTO cardTransaction (transaction_type, amountPence,category, date, user_id)
        VALUES %L
        RETURNING *`, 
        cardTransactionData.map((transaction)=>{
            return [transaction.transaction_type, transaction.amountPence,transaction.category, transaction.date, transaction.user_id]
        })
    )
    return db.query(sqlQuery)
}

function insertCashTransaction(){
    const sqlQuery = format(
        `INSERT INTO cashTransaction
        (transaction_type, amountPence,category, date, user_id)
        VALUES %L
        RETURNING *`,
        cashTransactionData.map((transaction)=>{
            return [transaction.transaction_type, transaction.amountPence,transaction.category, transaction.date, transaction.user_id]
        })
    )
    return db.query(sqlQuery);
}

function insertInvestmentTransactionData(){
    const sqlQuery = format(
        `INSERT INTO investmentTransaction
        (transaction_type, amountPence,category, date, user_id)
        VALUES %L
        RETURNING *`,
        investmentTransactionData.map((transaction)=>{
            return [transaction.transaction_type, transaction.amountPence,transaction.category, transaction.date, transaction.user_id]
        })
    )
    return db.query(sqlQuery);
}
function insertSavingsTransactionData(){
    const sqlQuery = format(
        `INSERT INTO savingsTransaction
        (transaction_type, amountPence,category, date, user_id)
        VALUES %L
        RETURNING *`,
        savingsTransactionData.map((transaction)=>{
            return [transaction.transaction_type, transaction.amountPence,transaction.category, transaction.date, transaction.user_id]
        })
    )
    return db.query(sqlQuery);
}

function inserPlannedExpensesData(){
    const sqlQuery = format(
        `INSERT INTO plannedExpenses ( plannedexpenses_category, amountPence,total_days, date_start, user_id)
        VALUES %L
        RETURNING *`,
        plannedExpensesData.map((planned)=>{
            return [planned.plannedexpenses_category, planned.amountPence, planned.total_days, planned.date_start, planned.user_id]
        })
        
    )
    return db.query(sqlQuery);
}




module.exports = seed;