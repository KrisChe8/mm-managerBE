const request = require('supertest');
const app = require('../app')

const db = require('../db/db');
const seed = require('../db/seed');

const {usersData,incomeCategoryData, expensesCategoryData, userAccauntType, cardTransactionData } = require('../db/data/dev-data/index');


beforeEach(()=>{
    return seed({usersData,incomeCategoryData, expensesCategoryData, userAccauntType, cardTransactionData })
})

afterAll(() =>{
    db.end()
});

describe('api', ()=>{
    describe('GET /api/users', ()=>{
        test('returns statuscode 200 and an array of user objects', ()=>{
            return request(app).get('/api/users')
            .expect(200)
            .then(({body})=>{
                const {users} = body;
                expect(users).not.toHaveLength(0);
                users.forEach((user)=>{
                    expect(typeof user.first_name).toBe('string');
                    expect(typeof user.last_name).toBe('string');
                    expect(typeof user.email).toBe('string');
                    expect(typeof user.password).toBe('string');
                    
                })
            })
        })
    })
    describe('GET  /api/users/:id', ()=>{
        test('returns statuscode 200 and a user by their id', ()=>{
            return request(app).get('/api/users/2')
            .expect(200)
            .then(({body})=>{
                const {user} = body;
                expect(user.user_id).toBe(2);
                expect(user.first_name).toBe('Helen');
                expect(user.last_name).toBe('Robs');
                expect(user.email).toBe('hrobs@gmail.com');
                expect(user.password).toBe('54321');
                expect(user.avatar).toBe('https://i.pinimg.com/236x/82/ab/35/82ab3533ee71daf256f23c1ccf20ad6f.jpg');


            })
        })
        test('GET: 404 and appropriate message, when given a valid but non-existent id', ()=>{
            return request(app).get('/api/users/9999')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("User does not exist")
            })
        } )
        test('GET: 400 and appropriate message, when given not valid   id', ()=>{
            return request(app).get('/api/users/not_id')
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request")
            })
        } )
    })
    describe('GET /api/users?email=', ()=>{
        test('GET 200 and user by email query', ()=>{
            return request(app).get('/api/users?email=tsmith@gmail.com')
            .expect(200)
            .then(({body})=>{
                const {users} = body;
                expect(users[0]["user_id"]).toBe(1);
                expect(users[0]["first_name"]).toBe('Tim');
                expect(users[0]["last_name"]).toBe('Smith');
                expect(users[0]["email"]).toBe('tsmith@gmail.com');
                expect(users[0]["password"]).toBe('12345');
                expect(users[0]["avatar"]).toBe('https://mighty.tools/mockmind-api/content/cartoon/9.jpg');
            })
        })
        test('GET 404 and appropriate message, when given a valid but non-existent email', ()=>{
            return request(app).get('/api/users?email=tsmith@ukr.com')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("User does not exist");
            })
        })
    })
    describe('POST /api/users', ()=>{
        test('POST: 201 inserts a new user to the db and sends the posted user details to the client', ()=>{
            const newUser = {
                first_name: 'Robin',
                last_name: 'Good',
                email: 'rgood@gmail.com',
                password: '54321',
                avatar: 'https://static.wikia.nocookie.net/veggietalesitsforthekids/images/a/ae/Robin1.png/revision/latest?cb=20120527081223'
            }
            return request(app)
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .then(({body})=>{
                const {user} = body;
                expect(user.first_name).toBe('Robin');
                expect(user.last_name).toBe('Good');
                expect(user.email).toBe('rgood@gmail.com');
                expect(user.password).toBe('54321');
                expect(user.hasOwnProperty("user_id")).toBe(true);
            })
        })
        test('POST: 400 sends an appropriate status and error message when missing required properties', ()=>{
            const newUser = {
                first_name: 'Robin',
                email: 'rgood@gmail.com',
                password: '54321',
                avatar: 'https://static.wikia.nocookie.net/veggietalesitsforthekids/images/a/ae/Robin1.png/revision/latest?cb=20120527081223'
            }
            return request(app)
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe('Bad request: missing some properties')
            })
        })
        test('POST: 406 sends an appropriate status and error message when user with this EMAIL already exists', ()=>{
            const newUser = {
                first_name: 'Robin',
                last_name: "Davids",
                email: 'tsmith@gmail.com',
                password: '54321',
                avatar: 'https://static.wikia.nocookie.net/veggietalesitsforthekids/images/a/ae/Robin1.png/revision/latest?cb=20120527081223'
            }
            return request(app)
            .post('/api/users')
            .send(newUser)
            .expect(406)
            .then(({body})=>{
                expect(body.msg).toBe('User already exists')
            })
        })
    })
    describe('PATCH /api/users/:id', ()=>{
        test('PATCH: 200 sends an updated user data ', ()=>{
            const updatedUser = {
                first_name: 'Bobby',
                last_name: 'Black',
                email: 'bblack@gmail.com',
                password: '12345',
                avatar: 'https://mighty.tools/mockmind-api/content/cartoon/9.jpg'
            }
            return request(app)
            .patch('/api/users/3')
            .send(updatedUser)
            .expect(200)
            .then(({body})=>{
                const {user} = body;
                expect(user.user_id).toBe(3);
                expect(user.first_name).toBe('Bobby');
                expect(user.last_name).toBe('Black')
            })
        })
        test('PATCH: 404 and appropriate message, when given a valid but non-existent id', ()=>{
            const updatedUser = {
                first_name: 'Bobby',
                last_name: 'Black',
                email: 'bblack@gmail.com',
                password: '12345',
                avatar: 'https://mighty.tools/mockmind-api/content/cartoon/9.jpg'
            }
            return request(app)
            .patch('/api/users/399999')
            .send(updatedUser)
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("User does not exist");
            })

        })
        test('PATCH: 400 and appropriate message, when given not valid   id', ()=>{
            const updatedUser = {
                first_name: 'Bobby',
                last_name: 'Black',
                email: 'bblack@gmail.com',
                password: '12345',
                avatar: 'https://mighty.tools/mockmind-api/content/cartoon/9.jpg'
            }
            return request(app)
            .patch('/api/users/not-id')
            .send(updatedUser)
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request");
            })

        })
        test('PATCH: 400 sends an appropriate status and error message when missing required properties', ()=>{
            const updatedUser = {
                first_name: 'Bobby',
                email: 'bblack@gmail.com',
                password: '12345',
                avatar: 'https://mighty.tools/mockmind-api/content/cartoon/9.jpg'
            }
            return request(app)
            .patch('/api/users/3')
            .send(updatedUser)
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request: missing some properties");
            })

        })
    })
    describe('DELETE /api/users/:id', ()=>{
        test('DELETE: 204 deletes user by id and sends no body back', ()=>{
            return request(app)
            .delete('/api/users/4').expect(204)
        })
        test('DELETE: 404 and appropriate message, when given a valid but non-existent id', ()=>{
            return request(app)
            .delete('/api/users/4859603')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("User does not exist");
            })
        })
        test('DELETE: 400 and appropriate message, when given not valid id', ()=>{
            return request(app)
            .delete('/api/users/not_id')
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request");
            })
        })
    })
    describe('GET Income Category /api/incomecat', ()=>{
        test('GET 200 and array of income categories ', ()=>{
            return request(app).get('/api/incomecat')
            .expect(200)
            .then(({body})=>{
                const {categories} = body;
                expect(categories).not.toHaveLength(0);
                for(let key in categories){
                    expect(categories[key].hasOwnProperty("incomecategory_name")).toBe(true)
                    expect(categories[key].hasOwnProperty("incomecategory_id")).toBe(true)
                }
            })
        })
        test('SORTED GET 200 and an array of income categories sorted by name', ()=>{
            return request(app).get('/api/incomecat')
            .expect(200)
            .then(({body})=>{
                expect(body.categories).toBeSortedBy('incomecategory_name')
            })
        })
        test('POST: 201 inserts a new category to the db and sends the posted category details to the client', ()=>{
            const newCategory = {
                incomecategory_name: "Found"
            }
            return request(app)
            .post('/api/incomecat')
            .send(newCategory)
            .expect(201)
            .then(({body})=>{
                const {category} = body;
                expect(category.incomecategory_name).toBe('Found');
               
            })
        })
        test('POST: 406 and msg: Category already exists', ()=>{
            const newCategory = {
                incomecategory_name: "Salary"
            }
            return request(app)
            .post('/api/incomecat')
            .send(newCategory)
            .expect(406)
            .then(({body})=>{
                expect(body.msg).toBe("Category already exists");
               
            })
        })
        test('POST: 400 and msg: Bad request: missing some properties, when not all properties are passed', ()=>{
            const newCategory = {
                incomecategory_name: ""
            }
            return request(app)
            .post('/api/incomecat')
            .send(newCategory)
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request: missing some properties");
               
            })
        })
    })
    describe('DELETE /api/incomecat', ()=>{
        test('DELETE: 204 deletes category by id and sends no body back', ()=>{
            return request(app)
            .delete('/api/incomecat/2').expect(204)
        })
        test('DELETE: 404 and appropriate message, when given a valid but non-existent id', ()=>{
            return request(app)
            .delete('/api/incomecat/4859603')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("Category does not exist");
            })
        })
        test('DELETE: 400 and appropriate message, when given not valid id', ()=>{
            return request(app)
            .delete('/api/incomecat/not_id')
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request");
            })
        })
    })
    describe('GET /api/expensescat', ()=>{
        test('GET 200 and array of expenses categories', ()=>{
            return request(app).get('/api/expensescat')
            .expect(200)
            .then(({body})=>{
                const {categories} = body;
                expect(categories).not.toHaveLength(0);
                for(let key in categories){
                    expect(categories[key].hasOwnProperty("expensescategory_name")).toBe(true)
                    expect(categories[key].hasOwnProperty("expensescategory_id")).toBe(true)
                }
            })
        })
        test('SORTED GET 200 and an array of expenses categories sorted by name', ()=>{
            return request(app).get('/api/expensescat')
            .expect(200)
            .then(({body})=>{
                expect(body.categories).toBeSortedBy('expensescategory_name')
            })
        })
    })
    describe('POST /api/expensescat', ()=>{
        test('POST: 201 inserts a new category to the db and sends the posted category details to the client', ()=>{
            const newCategory = {
                expensescategory_name: "Donate"
            }
            return request(app)
            .post('/api/expensescat')
            .send(newCategory)
            .expect(201)
            .then(({body})=>{
                const {category} = body;
                expect(category.expensescategory_name).toBe('Donate');
               
            })
        })
        test('POST: 406 and msg: Category already exists', ()=>{
            const newCategory = {
                expensescategory_name: "Bills"
            }
            return request(app)
            .post('/api/expensescat')
            .send(newCategory)
            .expect(406)
            .then(({body})=>{
                expect(body.msg).toBe("Category already exists");
               
            })
        })
        test('POST: 400 and msg: Bad request: missing some properties, when not all properties are passed', ()=>{
            const newCategory = {
                expensescategory_name: ""
            }
            return request(app)
            .post('/api/expensescat')
            .send(newCategory)
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request: missing some properties");
               
            })
        })
    })
    describe('DELETE /api/expensescat', ()=>{
        test('DELETE: 204 deletes category by id and sends no body back', ()=>{
            return request(app)
            .delete('/api/expensescat/2').expect(204)
        })
        test('DELETE: 404 and appropriate message, when given a valid but non-existent id', ()=>{
            return request(app)
            .delete('/api/expensescat/4859603')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("Category does not exist");
            })
        })
        test('DELETE: 400 and appropriate message, when given not valid id', ()=>{
            return request(app)
            .delete('/api/expensescat/not_id')
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request");
            })
        })
    })
    describe('GET /api/accounttype', ()=>{
        test('GET 200 and array of account types', ()=>{
            return request(app).get('/api/accounttype')
            .expect(200)
            .then(({body})=>{
                const {accounts} = body;
                expect(accounts).not.toHaveLength(0);
                for(let key in accounts){
                    expect(accounts[key].hasOwnProperty("accounttype_name")).toBe(true);
                    expect(accounts[key].hasOwnProperty("accounttype_id")).toBe(true)
                }
            })
        })
        test('SORTED GET 200 and an array of expenses categories sorted by name', ()=>{
            return request(app).get('/api/accounttype')
            .expect(200)
            .then(({body})=>{
                expect(body.accounts).toBeSortedBy('accounttype_name')
            })
        })
    })
    describe('POST /api/accounttype', ()=>{
        test('POST: 201 inserts a new account type to the db and sends the posted account details to the client', ()=>{
            const newAccount = {
                accounttype_name: "Wallet"
            }
            return request(app)
            .post('/api/accounttype')
            .send(newAccount)
            .expect(201)
            .then(({body})=>{
                const {account} = body;
                expect(account.accounttype_name).toBe('Wallet');
               
            })
        })
        test('POST: 406 and msg: Category already exists', ()=>{
            const newAccount = {
                accounttype_name: "Card"
            }
            return request(app)
            .post('/api/accounttype')
            .send(newAccount)
            .expect(406)
            .then(({body})=>{
                expect(body.msg).toBe("Category already exists");
               
            })
        })
        test('POST: 400 and msg: Bad request: missing some properties, when not all properties are passed', ()=>{
            const newAccount = {
                accounttype_name: ""
            }
            return request(app)
            .post('/api/accounttype')
            .send(newAccount)
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request: missing some properties");
               
            })
        })
    })
    describe('DELETE /api/accounttype', ()=>{
        test('DELETE: 204 deletes account type by id and sends no body back', ()=>{
            return request(app)
            .delete('/api/accounttype/2').expect(204)
        })
        test('DELETE: 404 and appropriate message, when given a valid but non-existent id', ()=>{
            return request(app)
            .delete('/api/accounttype/4859603')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("Category does not exist");
            })
        })
        test('DELETE: 400 and appropriate message, when given not valid id', ()=>{
           
            return request(app)
            .delete('/api/accounttype/not_id')
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request");
            })
        })
    })
    describe('GET CARDTRANSACTION /api/cardtransaction', ()=>{
        test('GET: 200 and array of all CARD transaction objects', ()=>{
            return request(app).get('/api/cardtransaction')
            .expect(200)
            .then(({body})=>{
                const {cardtransaction} = body;
                expect(cardtransaction).not.toHaveLength(0);
                for(let key in cardtransaction){
                    expect(cardtransaction[key].hasOwnProperty("transaction_type")).toBe(true)
                    expect(cardtransaction[key].hasOwnProperty("amountpence")).toBe(true);
                    expect(cardtransaction[key].hasOwnProperty("category")).toBe(true)
                    expect(cardtransaction[key].hasOwnProperty("date")).toBe(true);
                    expect(cardtransaction[key].hasOwnProperty("user_id")).toBe(true);

                }
            })
        })
    })
    describe('GET cashTransactions /api/cashtransaction', ()=>{
        test('GET: 200 and array of all CASH transaction objects', ()=>{
            return request(app).get('/api/cashtransaction')
            .expect(200)
            .then(({body})=>{
                const {cashTransaction} = body;
                expect(cashTransaction).not.toHaveLength(0);
                for(let key in cashTransaction){
                    expect(cashTransaction[key].hasOwnProperty("transaction_type")).toBe(true)
                    expect(cashTransaction[key].hasOwnProperty("amountpence")).toBe(true);
                    expect(cashTransaction[key].hasOwnProperty("category")).toBe(true)
                    expect(cashTransaction[key].hasOwnProperty("date")).toBe(true);
                    expect(cashTransaction[key].hasOwnProperty("user_id")).toBe(true);

                }
            })
        })
    })
    describe('GET savings transaction /api/savingstransaction', ()=>{
        test('GET: 200 and array of all SAVINGS transaction objects', ()=>{
            return request(app).get('/api/savingstransaction')
            .expect(200)
            .then(({body})=>{
                const {savingsTransaction} = body;
                expect(savingsTransaction).not.toHaveLength(0);
                for(let key in savingsTransaction){
                    expect(savingsTransaction[key].hasOwnProperty("transaction_type")).toBe(true)
                    expect(savingsTransaction[key].hasOwnProperty("amountpence")).toBe(true);
                    expect(savingsTransaction[key].hasOwnProperty("category")).toBe(true)
                    expect(savingsTransaction[key].hasOwnProperty("date")).toBe(true);
                    expect(savingsTransaction[key].hasOwnProperty("user_id")).toBe(true);

                }
            })
        })
    })
    describe('GET investment transaction /api/investmenttransaction', ()=>{
        test('GET: 200 and array of all SAVINGS transaction objects', ()=>{
            return request(app).get('/api/investmenttransaction')
            .expect(200)
            .then(({body})=>{
                const {investmentTransaction} = body;
                expect(investmentTransaction).not.toHaveLength(0);
                for(let key in investmentTransaction){
                    expect(investmentTransaction[key].hasOwnProperty("transaction_type")).toBe(true)
                    expect(investmentTransaction[key].hasOwnProperty("amountpence")).toBe(true);
                    expect(investmentTransaction[key].hasOwnProperty("category")).toBe(true)
                    expect(investmentTransaction[key].hasOwnProperty("date")).toBe(true);
                    expect(investmentTransaction[key].hasOwnProperty("user_id")).toBe(true);

                }
            })
        })
    })
    describe('GET CARD INCOME /api/cardincome/:userid', ()=>{
        test('GET: 200 and all card income transactions by user ID', ()=>{
            return request(app).get('/api/cardincome/1')
            .expect(200)
            .then(({body})=>{
                const {cardIncome} = body;
                expect(cardIncome).not.toHaveLength(0);
                cardIncome.forEach((income)=>{
                    expect(income.transaction_type).toBe('income');
                    expect(typeof income.amountpence).toBe('number');
                    expect(income.user_id).toBe(1);
                    
                })
            })
        })
        test('GET: 200 and array of card income by user_id ordered by date DESC', ()=>{
            return request(app).get('/api/cardincome/1')
            .expect(200)
            .then(({body})=>{
                expect(body.cardIncome).toBeSortedBy("date", { descending: true });
            })
        })
        // test('GET: 200 (/api/cardincome/1?time=today) and array of card income by user_id received during today ', ()=>{
        //     return request(app).get('/api/cardincome/1?time=month')
        //     .expect(200)
        //     .then(({body})=>{
        //         const {cardIncome} = body;
        //         console.log(cardIncome, "<<<<")
        //         const currentDate = new Date();
        //         const timestamp = currentDate.getTime();
        //         cardIncome.forEach((income)=>{
        //             expect(income.transaction_type).toBe('income');
        //             expect(typeof income.amountpence).toBe('number');
        //             expect(income.date).toBe(currentDate);
                    
        //         })

        //     })
        // })
        test('GET TOTAL /api/cardincome/:userid/total total_cardIncome value', ()=>{
            return request(app).get('/api/cardincome/1/total?grouped=true&time=week')
            .expect(200)
            .then(({body})=>{
                const {cardIncome} = body;
                expect(cardIncome).not.toHaveLength(0);
                for(let key in cardIncome){
                    expect(cardIncome[key].hasOwnProperty("total_cardincome")).toBe(true)
                }
            })
        })
        test('GET: 404 and appropriate message, when given a valid but non-existent id', ()=>{
            return request(app)
            .get('/api/cardincome/4859603')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("User does not exist");
            })
        })
        test('GET: 400 and appropriate message, when given not valid id', ()=>{
            return request(app)
            .get('/api/cardincome/not_id')
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request");
            })
        })
        test('GET:200 /api/cardincome/:userid?category receive card income by certain category', ()=>{
            return request(app).get('/api/cardincome/1?category=Business')
            .expect(200)
            .then(({body})=>{
                const {cardIncome} = body;
                expect(cardIncome).not.toHaveLength(0);
                cardIncome.forEach((income)=>{
                    expect(income.transaction_type).toBe('income');
                    expect( income.category).toBe('Business');
                    expect(income.user_id).toBe(1);
                    
                })
            })
        })
        test('GET: 404 api/cardincome/:userid?category when given valid category, but there is no income by this category', ()=>{
            return request(app).get('/api/cardincome/1?category=Lottery')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("There is no income yet");
            })
        })
        // test('GET: 404 api/cardincome/:userid?category when given non-existent category', ()=>{
        //     return request(app).get('/api/cardincome/1?category=fromsky')
        //     .expect(404)
        //     .then(({body})=>{
        //         expect(body.msg).toBe("Category does not exist");
        //     })
        // })
       

    })
    describe('GET CASH income /api/cashincome/:userid', ()=>{
        test('GET: 200 and all cash income transactions by user ID', ()=>{
            return request(app).get('/api/cashincome/1')
            .expect(200)
            .then(({body})=>{
                const {cashIncome} = body;
               
                expect(cashIncome).not.toHaveLength(0);
                cashIncome.forEach((income)=>{
                    expect(income.transaction_type).toBe('income');
                    expect(typeof income.amountpence).toBe('number');
                    expect(income.user_id).toBe(1);
                    
                })
            })
        })
        test('GET: 200 and array of card income by user_id ordered by date DESC', ()=>{
            return request(app).get('/api/cashincome/1')
            .expect(200)
            .then(({body})=>{
                expect(body.cashIncome).toBeSortedBy("date", { descending: true });
            })
        })
        test('GET:200 /api/cardincome/:userid?category receive card income by certain category', ()=>{
            return request(app).get('/api/cashincome/1?category=Lottery')
            .expect(200)
            .then(({body})=>{
                const {cashIncome} = body;
                
                expect(cashIncome).not.toHaveLength(0);
                cashIncome.forEach((income)=>{
                    expect(income.transaction_type).toBe('income');
                    expect( income.category).toBe('Lottery');
                    expect(income.user_id).toBe(1);
                    
                })
            })
        })
        test('GET: 404 and appropriate message, when given a valid but non-existent id', ()=>{
            return request(app)
            .get('/api/cashincome/4859603')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("User does not exist");
            })
        })
        test('GET: 400 and appropriate message, when given not valid id', ()=>{
            return request(app)
            .get('/api/cashincome/not_id')
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request");
            })
        })

        test('GET TOTAL /api/cashincome/:userid/total total_cashIncome value', ()=>{
            return request(app).get('/api/cashincome/1/total?grouped=true&time=week')
            .expect(200)
            .then(({body})=>{
                const {cashIncome} = body;

                expect(cashIncome).not.toHaveLength(0);
                for(let key in cashIncome){
                    expect(cashIncome[key].hasOwnProperty("total_cashincome")).toBe(true)
                }
            })
        })

        test('GET: 404 and appropriate message, when given a valid but non-existent id', ()=>{
            return request(app)
            .get('/api/cashincome/4859603/total')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("User does not exist");
            })
        })
        test('GET: 400 and appropriate message, when given not valid id', ()=>{
            return request(app)
            .get('/api/cashincome/not_id/total')
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request");
            })
        })
    })

    describe('GET INVESTMENT income /api/investmentincome/:userid', ()=>{
        test('GET: 200 and all investment income transactions by user ID', ()=>{
            return request(app).get('/api/investmentincome/1')
            .expect(200)
            .then(({body})=>{
                const {investmentIncome} = body;
                expect(investmentIncome).not.toHaveLength(0);
                investmentIncome.forEach((income)=>{
                    expect(income.transaction_type).toBe('income');
                    expect(typeof income.amountpence).toBe('number');
                    expect(income.user_id).toBe(1);
                    
                })
            })
        })
        test('GET: 200 and array of investment income by user_id ordered by date DESC', ()=>{
            return request(app).get('/api/investmentincome/1')
            .expect(200)
            .then(({body})=>{
                expect(body.investmentIncome).toBeSortedBy("date", { descending: true });
            })
        })
        test('GET:200 /api/investmentincome/:userid?category receive investment income by certain category', ()=>{
            return request(app).get('/api/investmentincome/1?category=Passive income')
            .expect(200)
            .then(({body})=>{
                const {investmentIncome} = body;
                expect(investmentIncome).not.toHaveLength(0);
                investmentIncome.forEach((income)=>{
                    expect(income.transaction_type).toBe('income');
                    expect( income.category).toBe('Passive income');
                    expect(income.user_id).toBe(1);
                    
                })
            })
        })
        test('GET: 404 and appropriate message, when given a valid but non-existent id', ()=>{
            return request(app)
            .get('/api/investmentincome/4859603')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("User does not exist");
            })
        })
        test('GET: 400 and appropriate message, when given not valid id', ()=>{
            return request(app)
            .get('/api/investmentincome/not_id')
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request");
            })
        })
        test('GET TOTAL /api/investmentincome/:userid/total total_investmentIncome value', ()=>{
            return request(app).get('/api/investmentincome/1/total?grouped=true&time=week')
            .expect(200)
            .then(({body})=>{
                const {investmentIncome} = body;
                expect(investmentIncome).not.toHaveLength(0);
                for(let key in investmentIncome){
                    expect(investmentIncome[key].hasOwnProperty("total_investmentincome")).toBe(true)
                }
            })
        })

        test('GET: 404 and appropriate message, when given a valid but non-existent id', ()=>{
            return request(app)
            .get('/api/investmentincome/4859603/total')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("User does not exist");
            })
        })
        test('GET: 400 and appropriate message, when given not valid id', ()=>{
            return request(app)
            .get('/api/investmentincome/not_id/total')
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request");
            })
        })
    })

    describe('GET SAVINGS income /api/savingsincome/:userid', ()=>{
        test('GET: 200 and all savings income transactions by user ID', ()=>{
            return request(app).get('/api/savingsincome/1')
            .expect(200)
            .then(({body})=>{
                const {savingsIncome} = body;
                expect(savingsIncome).not.toHaveLength(0);
                savingsIncome.forEach((income)=>{
                    expect(income.transaction_type).toBe('income');
                    expect(typeof income.amountpence).toBe('number');
                    expect(income.user_id).toBe(1);
                    
                })
            })
        })
        test('GET: 200 and array of savings income by user_id ordered by date DESC', ()=>{
            return request(app).get('/api/savingsincome/1')
            .expect(200)
            .then(({body})=>{
                expect(body.savingsIncome).toBeSortedBy("date", { descending: true });
            })
        })
        test('GET:200 /api/savingsIncomeRouter/:userid?category receive investment income by certain category', ()=>{
            return request(app).get('/api/savingsincome/1?category=Salary')
            .expect(200)
            .then(({body})=>{
                const {savingsIncome} = body;
                expect(savingsIncome).not.toHaveLength(0);
                savingsIncome.forEach((income)=>{
                    expect(income.transaction_type).toBe('income');
                    expect( income.category).toBe('Salary');
                    expect(income.user_id).toBe(1);
                    
                })
            })
        })
        test('GET: 404 and appropriate message, when given a valid but non-existent id', ()=>{
            return request(app)
            .get('/api/savingsincome/4859603')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("User does not exist");
            })
        })
        test('GET TOTAL /api/savingsincome/:userid/total total_savingsIncome value', ()=>{
            return request(app).get('/api/savingsincome/1/total?grouped=true&time=week')
            .expect(200)
            .then(({body})=>{
                const {savingsIncome} = body;
                expect(savingsIncome).not.toHaveLength(0);
                for(let key in savingsIncome){
                    expect(savingsIncome[key].hasOwnProperty("total_savingsincome")).toBe(true)
                }
            })
        })

        test('GET: 404 and appropriate message, when given a valid but non-existent id', ()=>{
            return request(app)
            .get('/api/savingsincome/4859603/total')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("User does not exist");
            })
        })
        test('GET: 400 and appropriate message, when given not valid id', ()=>{
            return request(app)
            .get('/api/savingsincome/not_id/total')
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request");
            })
        })
    })

    describe('GET TOTAL INCOME /api/totalincome/:userid', ()=>{
        test('GET: 200 and totalIncome by userId', ()=>{
            return request(app).get('/api/totalincome/1?time=week')
            .expect(200)
            .then(({body})=>{
                const {totalIncome} = body;
                expect(totalIncome).not.toHaveLength(0);
                for(let key in totalIncome){
                    expect(totalIncome[key].hasOwnProperty("total_card")).toBe(true);
                    expect(totalIncome[key].hasOwnProperty("total_cash")).toBe(true)
                    expect(totalIncome[key].hasOwnProperty("total_savings")).toBe(true);
                    expect(totalIncome[key].hasOwnProperty("total_investment")).toBe(true)
                }
            })
        })
    })


    describe.only('GET TOTAL EXPENSES /api/totalexpenses/:userid', ()=>{
        test('GET: 200 and total expenses by userId', ()=>{
            return request(app).get('/api/totalexpenses/1')
            .expect(200)
            .then(({body})=>{
                const {totalExpenses} = body;
            console.log(totalExpenses)
                expect(totalExpenses).not.toHaveLength(0);
                for(let key in totalExpenses){
                    expect(totalExpenses[key].hasOwnProperty("total_card")).toBe(true);
                    expect(totalExpenses[key].hasOwnProperty("total_cash")).toBe(true)
                    expect(totalExpenses[key].hasOwnProperty("total_savings")).toBe(true);
                    expect(totalExpenses[key].hasOwnProperty("total_investment")).toBe(true)
                }
            })
        })
    })


    describe('GET ALL TRANSACTIONS /api/alltransactions/:userid', ()=>{
        test('GET: 200 and all transactions by userId', ()=>{
            return request(app).get('/api/alltransactions/1?time=week')
            .expect(200)
            .then(({body})=>{
                const {allTransactions} = body;
                
                expect(allTransactions).not.toHaveLength(0);
                for(let key in allTransactions){
                    expect(allTransactions[key].hasOwnProperty("card_amountpence")).toBe(true);
                    expect(allTransactions[key].hasOwnProperty("cashcategory")).toBe(true)
                    expect(allTransactions[key].hasOwnProperty("cash_transaction")).toBe(true);
                    expect(allTransactions[key].hasOwnProperty("cash_amountpence")).toBe(true)
                    expect(allTransactions[key].hasOwnProperty("date")).toBe(true)

                    expect(allTransactions[key].hasOwnProperty("savings_transaction")).toBe(true);
                    expect(allTransactions[key].hasOwnProperty("investmentcategory")).toBe(true)
                    expect(allTransactions[key].hasOwnProperty("investment_amountpence")).toBe(true)
                }
            })
        })
    })

    describe('GET PLANNED EXPENSES /api/plannedexpenses/:userid', ()=>{
        test('GET:200 and array of objects of planned expenses', ()=>{
            return request(app).get('/api/plannedexpenses/1?duration=month')
            .expect(200)
            .then(({body})=>{
                const {plannedExpenses} = body;
                expect(plannedExpenses).not.toHaveLength(0);
                for(let key in plannedExpenses){
                    expect(plannedExpenses[key].hasOwnProperty("date_start")).toBe(true);
                    expect(plannedExpenses[key].hasOwnProperty("plannedexpenses_category")).toBe(true)
                    expect(plannedExpenses[key].hasOwnProperty("amountpence")).toBe(true);
                    expect(plannedExpenses[key].hasOwnProperty("total_days")).toBe(true)
                }
            })
        })

        test('GET: 404 and appropriate message, when given a valid but non-existent id', ()=>{
            return request(app)
            .get('/api/plannedexpenses/4859603')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("User does not exist");
            })
        })
        test('GET: 400 and appropriate message, when given non- valid duration query', ()=>{
            return request(app)
            .get('/api/plannedexpenses/1?duration=day')
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request");
            })
        })
    })
    describe('POST planned expenses /api/plannedexpenses', ()=>{
        test('POST: 201 inserts a new planned expenses data to the db and sends the posted planned expenses details to the client', ()=>{
            const newPlannedExp = {
                plannedexpenses_category: "Car",
                amountPence: 5000,
                total_days: 'week',
                user_id: 1
            }
            return request(app)
            .post('/api/plannedexpenses')
            .send(newPlannedExp)
            .expect(201)
            .then(({body})=>{
                const {plannedexpenses} = body;
                
                expect(plannedexpenses.plannedexpenses_category).toBe('Car');
                expect(plannedexpenses.amountpence).toBe(5000);
               
            })
        })
        test('POST: 400 and msg: Bad request: missing some properties, when not all properties are passed', ()=>{
            const newPlannedExp = {
                plannedexpenses_category: "Car",
                amountPence: 5000,
                user_id: 1
            }
            return request(app)
            .post('/api/plannedexpenses')
            .send(newPlannedExp)
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request: missing some properties");
               
            })
        })
        
    })

    describe('DELETE planned expenses by id /api/plannedexpenses/remove/:id', ()=>{
        test('DELETE: 204 deletes planned expenses  by id and sends no body back', ()=>{
            return request(app)
            .delete('/api/plannedexpenses/remove/2').expect(204)
        })
        test('DELETE: 404 and appropriate message, when given a valid but non-existent id', ()=>{
            return request(app)
            .delete('/api/plannedexpenses/remove/4859603')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("Planned Expenses with this id does not exist");
            })
        })
        test('DELETE: 400 and appropriate message, when given not valid id', ()=>{
           
            return request(app)
            .delete('/api/plannedexpenses/remove/not_id')
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request");
            })
        })
    })
    describe('DELETE all planned expenses BY USER ID /api/plannedexpenses/:userid', ()=>{
        test('DELETE: 204 deletes ALL planned expenses  by USER id and sends no body back', ()=>{
            return request(app)
            .delete('/api/plannedexpenses/2').expect(204)
        })
        test('DELETE: 404 and appropriate message, when given a valid but non-existent id', ()=>{
            return request(app)
            .delete('/api/plannedexpenses/4859603')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("User does not exist");
            })
        })
        test('DELETE: 400 and appropriate message, when given not valid id', ()=>{
           
            return request(app)
            .delete('/api/plannedexpenses/not_id')
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request");
            })
        })
    })

    describe('POST new card transaction /api/cardtransaction', ()=>{
        test('POST: 201 inserts a new planned expenses data to the db and sends the posted planned expenses details to the client', ()=>{
            const newCardTransaction = {
                transaction_type: "income", 
                amountPence: 140000,
                category: 'Salary', 
                user_id: 1
            }
            return request(app)
            .post('/api/cardtransaction')
            .send(newCardTransaction)
            .expect(201)
            .then(({body})=>{
                const {cardTransaction} = body;
                
                expect(cardTransaction.transaction_type).toBe('income');
                expect(cardTransaction.amountpence).toBe(140000);
                expect(cardTransaction.category).toBe('Salary');
               
            })
        })
        test('POST: 400 and msg: Bad request: missing some properties, when not all properties are passed', ()=>{
            const newCardTransaction = {
                transaction_type: "income", 
                amountPence: 140000,
                category: 'Salary'
            }
            return request(app)
            .post('/api/cardtransaction')
            .send(newCardTransaction)
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request: missing some properties");
            })
        })
    })

    describe('DELETE card Transaction BY id /api/cardtransaction/:id', ()=>{
        test('DELETE: 204 deletes planned expenses  by id and sends no body back', ()=>{
            return request(app)
            .delete('/api/cardtransaction/2').expect(204)
        })
        test('DELETE: 404 and appropriate message, when given a valid but non-existent id', ()=>{
            return request(app)
            .delete('/api/cardtransaction/4859603')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("There is no transaction with this id");
            })
        })
        test('DELETE: 400 and appropriate message, when given not valid id', ()=>{
           
            return request(app)
            .delete('/api/cardtransaction/not_id')
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request");
            })
        })
    })

    describe('DELETE card Transaction BY USER id /api/cardtransaction/user/:userid', ()=>{
        test('DELETE: 204 deletes planned expenses  by id and sends no body back', ()=>{
            return request(app)
            .delete('/api/cardtransaction/user/2').expect(204)
        })
        test('DELETE: 404 and appropriate message, when given a valid but non-existent id', ()=>{
            return request(app)
            .delete('/api/cardtransaction/user/4859603')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("User does not exist");
            })
        })
        test('DELETE: 400 and appropriate message, when given not valid id', ()=>{
           
            return request(app)
            .delete('/api/cardtransaction/user/not_id')
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request");
            })
        })
    })
    describe('PATCH /api/cardtransaction/:id', ()=>{
        test('PATCH: 200 sends an updated card transaction data ', ()=>{
            const cardTransactionUpdate = {
                transaction_type: 'expenses',
                amountPence: 2300,
                category: 'Bills',
                user_id: 2
            }
            return request(app)
            .patch('/api/cardtransaction/3')
            .send(cardTransactionUpdate)
            .expect(200)
            .then(({body})=>{
                const {cardTransaction} = body;
                
                expect(cardTransaction.transaction_type).toBe("expenses");
                expect(cardTransaction.amountpence).toBe(2300);
                expect(cardTransaction.category).toBe('Bills')
            })
        })
        test('PATCH: 404 and appropriate message, when given a valid but non-existent id', ()=>{
            const cardTransactionUpdate = {
                transaction_type: 'expenses',
                amountPence: 2300,
                category: 'Bills',
                user_id: 2
            }
            return request(app)
            .patch('/api/cardtransaction/399999')
            .send(cardTransactionUpdate)
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("There is no transaction with this id");
            })

        })
        test('PATCH: 400 and appropriate message, when given not valid   id', ()=>{
            const cardTransactionUpdate = {
                transaction_type: 'expenses',
                amountPence: 2300,
                category: 'Bills',
                user_id: 2
            }
            return request(app)
            .patch('/api/cardtransaction/not-id')
            .send(cardTransactionUpdate)
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request");
            })

        })
        test('PATCH: 400 sends an appropriate status and error message when missing required properties', ()=>{
            const cardTransactionUpdate = {
                transaction_type: 'expenses',
                category: 'Bills',
                user_id: 2
            }
            return request(app)
            .patch('/api/cardtransaction/3')
            .send(cardTransactionUpdate)
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request: missing some properties");
            })

        })
    })

    describe('POST new cash transaction /api/cashtransaction', ()=>{
        test('POST: 201 inserts a new cash transaction data to the db and sends the posted cash transaction details to the client', ()=>{
            const newCashTransaction = {
                transaction_type: "income", 
                amountPence: 140000,
                category: 'Salary', 
                user_id: 1
            }
            return request(app)
            .post('/api/cashtransaction')
            .send(newCashTransaction)
            .expect(201)
            .then(({body})=>{
                const {cashTransaction} = body;
                expect(cashTransaction.transaction_type).toBe('income');
                expect(cashTransaction.amountpence).toBe(140000);
                expect(cashTransaction.category).toBe('Salary');
               
            })
        })
        test('POST: 400 and msg: Bad request: missing some properties, when not all properties are passed', ()=>{
            const newCashTransaction = {
                transaction_type: "income", 
                amountPence: 140000,
                category: 'Salary'
            }
            return request(app)
            .post('/api/cashtransaction')
            .send(newCashTransaction)
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request: missing some properties");
            })
        })
    })

    describe('DELETE cash Transaction BY id /api/cashtransaction/:id', ()=>{
        test('DELETE: 204 deletes cash transaction  by id and sends no body back', ()=>{
            return request(app)
            .delete('/api/cashtransaction/2').expect(204)
        })
        test('DELETE: 404 and appropriate message, when given a valid but non-existent id', ()=>{
            return request(app)
            .delete('/api/cashtransaction/4859603')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("There is no transaction with this id");
            })
        })
        test('DELETE: 400 and appropriate message, when given not valid id', ()=>{
           
            return request(app)
            .delete('/api/cashtransaction/not_id')
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request");
            })
        })
    })

    describe('DELETE cash Transaction BY USER id /api/cashtransaction/user/:userid', ()=>{
        test('DELETE: 204 deletes cash transactions  by USER id and sends no body back', ()=>{
            return request(app)
            .delete('/api/cashtransaction/user/2').expect(204)
        })
        test('DELETE: 404 and appropriate message, when given a valid but non-existent id', ()=>{
            return request(app)
            .delete('/api/cashtransaction/user/4859603')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("User does not exist");
            })
        })
        test('DELETE: 400 and appropriate message, when given not valid id', ()=>{
           
            return request(app)
            .delete('/api/cashtransaction/user/not_id')
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request");
            })
        })
    })

    describe('PATCH /api/cashtransaction/:id', ()=>{
        test('PATCH: 200 sends an updated cash transaction data ', ()=>{
            const cashTransactionUpdate = {
                transaction_type: 'expenses',
                amountPence: 2300,
                category: 'Bills',
                user_id: 2
            }
            return request(app)
            .patch('/api/cashtransaction/3')
            .send(cashTransactionUpdate)
            .expect(200)
            .then(({body})=>{
                const {cashTransaction} = body;
                expect(cashTransaction.transaction_type).toBe("expenses");
                expect(cashTransaction.amountpence).toBe(2300);
                expect(cashTransaction.category).toBe('Bills')
            })
        })
        test('PATCH: 404 and appropriate message, when given a valid but non-existent id', ()=>{
            const cashTransactionUpdate = {
                transaction_type: 'expenses',
                amountPence: 2300,
                category: 'Bills',
                user_id: 2
            }
            return request(app)
            .patch('/api/cashtransaction/399999')
            .send(cashTransactionUpdate)
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("There is no transaction with this id");
            })

        })
        test('PATCH: 400 and appropriate message, when given not valid   id', ()=>{
            const cashTransactionUpdate = {
                transaction_type: 'expenses',
                amountPence: 2300,
                category: 'Bills',
                user_id: 2
            }
            return request(app)
            .patch('/api/cashtransaction/not-id')
            .send(cashTransactionUpdate)
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request");
            })

        })
        test('PATCH: 400 sends an appropriate status and error message when missing required properties', ()=>{
            const cashTransactionUpdate = {
                transaction_type: 'expenses',
                category: 'Bills',
                user_id: 2
            }
            return request(app)
            .patch('/api/cashtransaction/3')
            .send(cashTransactionUpdate)
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request: missing some properties");
            })

        })
    })

    describe('POST new investment transaction /api/investmenttransaction', ()=>{
        test('POST: 201 inserts a new investment transaction data to the db and sends the posted investment transaction details to the client', ()=>{
            const newInvestTransaction = {
                transaction_type: "expenses", 
                amountPence: 10000,
                category: 'Lost', 
                user_id: 1
            }
            return request(app)
            .post('/api/investmenttransaction')
            .send(newInvestTransaction)
            .expect(201)
            .then(({body})=>{
                const {investTransaction} = body;
                expect(investTransaction.transaction_type).toBe('expenses');
                expect(investTransaction.amountpence).toBe(10000);
                expect(investTransaction.category).toBe('Lost');
               
            })
        })
        test('POST: 400 and msg: Bad request: missing some properties, when not all properties are passed', ()=>{
            const newInvestTransaction = {
                transaction_type: "income", 
                amountPence: 140000,
                category: 'Salary'
            }
            return request(app)
            .post('/api/investmenttransaction')
            .send(newInvestTransaction)
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request: missing some properties");
            })
        })
    })

    describe('DELETE investment Transaction BY id /api/investmenttransaction/:id', ()=>{
        test('DELETE: 204 deletes cash transaction  by id and sends no body back', ()=>{
            return request(app)
            .delete('/api/investmenttransaction/2').expect(204)
        })
        test('DELETE: 404 and appropriate message, when given a valid but non-existent id', ()=>{
            return request(app)
            .delete('/api/investmenttransaction/4859603')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("There is no transaction with this id");
            })
        })
        test('DELETE: 400 and appropriate message, when given not valid id', ()=>{
           
            return request(app)
            .delete('/api/investmenttransaction/not_id')
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request");
            })
        })
    })

    describe('DELETE investment Transaction BY USER id /api/investmenttransaction/user/:userid', ()=>{
        test('DELETE: 204 deletes cash transactions  by USER id and sends no body back', ()=>{
            return request(app)
            .delete('/api/investmenttransaction/user/2').expect(204)
        })
        test('DELETE: 404 and appropriate message, when given a valid but non-existent id', ()=>{
            return request(app)
            .delete('/api/investmenttransaction/user/4859603')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("User does not exist");
            })
        })
        test('DELETE: 400 and appropriate message, when given not valid id', ()=>{
           
            return request(app)
            .delete('/api/investmenttransaction/user/not_id')
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request");
            })
        })
    })

    describe('PATCH /api/investmenttransaction/:id', ()=>{
        test('PATCH: 200 sends an updated invest transaction data ', ()=>{
            const investTransactionUpdate = {
                transaction_type: 'expenses',
                amountPence: 2300,
                category: 'Bills',
                user_id: 2
            }
            return request(app)
            .patch('/api/investmenttransaction/3')
            .send(investTransactionUpdate)
            .expect(200)
            .then(({body})=>{
                const {investTransaction} = body;
                expect(investTransaction.transaction_type).toBe("expenses");
                expect(investTransaction.amountpence).toBe(2300);
                expect(investTransaction.category).toBe('Bills')
            })
        })
        test('PATCH: 404 and appropriate message, when given a valid but non-existent id', ()=>{
            const investTransactionUpdate = {
                transaction_type: 'expenses',
                amountPence: 2300,
                category: 'Bills',
                user_id: 2
            }
            return request(app)
            .patch('/api/investmenttransaction/399999')
            .send(investTransactionUpdate)
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("There is no transaction with this id");
            })

        })
        test('PATCH: 400 and appropriate message, when given not valid   id', ()=>{
            const investTransactionUpdate = {
                transaction_type: 'expenses',
                amountPence: 2300,
                category: 'Bills',
                user_id: 2
            }
            return request(app)
            .patch('/api/investmenttransaction/not-id')
            .send(investTransactionUpdate)
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request");
            })

        })
        test('PATCH: 400 sends an appropriate status and error message when missing required properties', ()=>{
            const investTransactionUpdate = {
                transaction_type: 'expenses',
                category: 'Bills',
                user_id: 2
            }
            return request(app)
            .patch('/api/investmenttransaction/3')
            .send(investTransactionUpdate)
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request: missing some properties");
            })

        })
    })


    describe('POST new savings transaction /api/savingstransaction', ()=>{
        test('POST: 201 inserts a new savings transaction data to the db and sends the posted savings transaction details to the client', ()=>{
            const newSavingsTransaction = {
                transaction_type: "expenses", 
                amountPence: 10000,
                category: 'Lost', 
                user_id: 1
            }
            return request(app)
            .post('/api/savingstransaction')
            .send(newSavingsTransaction)
            .expect(201)
            .then(({body})=>{
                const {savingsTransaction} = body;
                expect(savingsTransaction.transaction_type).toBe('expenses');
                expect(savingsTransaction.amountpence).toBe(10000);
                expect(savingsTransaction.category).toBe('Lost');
               
            })
        })
        test('POST: 400 and msg: Bad request: missing some properties, when not all properties are passed', ()=>{
            const newSavingsTransaction = {
                transaction_type: "income", 
                amountPence: 140000,
                category: 'Salary'
            }
            return request(app)
            .post('/api/savingstransaction')
            .send(newSavingsTransaction)
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request: missing some properties");
            })
        })
    })

    describe('DELETE savings Transaction BY id /api/savingstransaction/:id', ()=>{
        test('DELETE: 204 deletes savings transaction  by id and sends no body back', ()=>{
            return request(app)
            .delete('/api/savingstransaction/2').expect(204)
        })
        test('DELETE: 404 and appropriate message, when given a valid but non-existent id', ()=>{
            return request(app)
            .delete('/api/savingstransaction/4859603')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("There is no transaction with this id");
            })
        })
        test('DELETE: 400 and appropriate message, when given not valid id', ()=>{
           
            return request(app)
            .delete('/api/savingstransaction/not_id')
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request");
            })
        })
    })

    describe('DELETE savings Transaction BY USER id /api/savingstransaction/user/:userid', ()=>{
        test('DELETE: 204 deletes savings transactions  by USER id and sends no body back', ()=>{
            return request(app)
            .delete('/api/savingstransaction/user/1').expect(204)
        })
        test('DELETE: 404 and appropriate message, when given a valid but non-existent id', ()=>{
            return request(app)
            .delete('/api/savingstransaction/user/4859603')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("User does not exist");
            })
        })
        test('DELETE: 400 and appropriate message, when given not valid id', ()=>{
           
            return request(app)
            .delete('/api/savingstransaction/user/not_id')
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request");
            })
        })
    })

    describe('PATCH /api/savingstransaction/:id', ()=>{
        test('PATCH: 200 sends an updated savings transaction data ', ()=>{
            const savingsTransactionUpdate = {
                transaction_type: 'expenses',
                amountPence: 2300,
                category: 'Bills',
                user_id: 2
            }
            return request(app)
            .patch('/api/savingstransaction/3')
            .send(savingsTransactionUpdate)
            .expect(200)
            .then(({body})=>{
                const {savingsTransaction} = body;
                expect(savingsTransaction.transaction_type).toBe("expenses");
                expect(savingsTransaction.amountpence).toBe(2300);
                expect(savingsTransaction.category).toBe('Bills')
            })
        })
        test('PATCH: 404 and appropriate message, when given a valid but non-existent id', ()=>{
            const savingsTransactionUpdate = {
                transaction_type: 'expenses',
                amountPence: 2300,
                category: 'Bills',
                user_id: 2
            }
            return request(app)
            .patch('/api/savingstransaction/399999')
            .send(savingsTransactionUpdate)
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("There is no transaction with this id");
            })

        })
        test('PATCH: 400 and appropriate message, when given not valid   id', ()=>{
            const savingsTransactionUpdate = {
                transaction_type: 'expenses',
                amountPence: 2300,
                category: 'Bills',
                user_id: 2
            }
            return request(app)
            .patch('/api/savingstransaction/not-id')
            .send(savingsTransactionUpdate)
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request");
            })

        })
        test('PATCH: 400 sends an appropriate status and error message when missing required properties', ()=>{
            const savingsTransactionUpdate = {
                transaction_type: 'expenses',
                category: 'Bills',
                user_id: 2
            }
            return request(app)
            .patch('/api/savingstransaction/3')
            .send(savingsTransactionUpdate)
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad request: missing some properties");
            })

        })
    })
    
    describe('GET: 200 /api', ()=>{
        test('GET: 200 /api', ()=>{
            return request(app)
            .get('/api')
            .expect(200)
            .then(({body})=>{
                const {instructions} = body;
              
            })
        })
    })

})