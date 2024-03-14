const request = require('supertest');
const app = require('../app')

const db = require('../db/db');
const seed = require('../db/seed');

const {usersData,incomeCategoryData, expensesCategoryData, userAccauntType } = require('../db/data/dev-data/index');


beforeEach(()=>{
    return seed({usersData,incomeCategoryData, expensesCategoryData, userAccauntType })
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
})