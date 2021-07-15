const express = require('express')
const mysql = require('mysql')
let cors = require('cors')
let router = express.Router()
let userRepo = require('./userRepo')


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'blackjack'
})

db.connect((err) => {
    if(err) {
        throw err
    }
    console.log('MY SQL connected..')
})

const app = express()
app.use(express.json())

app.use(cors())

router.post('/adduser', (req, res) => {
    let sql = 'INSERT INTO Users SET ?'
    db.query(sql, req.body, (err, result) => {
        if (err) {  
            res.status(404).send()
        }else {
            res.status(200).send('User added')
        }
    })
})

router.post('/login', (req, res) => {
    let sql = 'INSERT INTO loggedUsers SET ?'
    db.query(sql, req.body, (err, result) => {
        if (err) {  
            res.status(404).send()
        }else {
            res.status(200).send('User logged')
        }
    })
})

router.post('/transactions', (req, res) => {
    let sql = 'INSERT INTO transactions SET ?'
    db.query(sql, req.body, (err, result) => {
        if (err) {  
            res.status(404).send()
        }else {
            res.status(200).send('Transaction added')
        }
    })
})

router.put('/updateuser', (req, res) => {
    const user = req.body
    let sql = `UPDATE Users SET ? WHERE playerID = ${user.playerID}`
    db.query(sql, req.body, (err, result) => {
        if (err) {  
            res.status(404).send()
        }else {
            res.status(200).send(`User ${user.username} updated`)
        }
    })
})

router.post('/hands', (req, res) => {
    let sql = 'INSERT INTO Hands(handID) VALUES(DEFAULT)'
    db.query(sql, (err, result) => {
        if (err){
            res.status(404).send()
        }else {
            res.send(result)
        }
    })
})
router.get('/hands', (req, res) => {
    let sql = 'SELECT LAST_INSERT_ID() AS HandID FROM Hands'
    db.query(sql, (err, result) => {
        if (err){
            res.status(404).send()
        }else {
            res.send(result)
        }
    })
})

router.post('/dealercards', (req, res) => {
    let sql = 'INSERT INTO HandDetailsDealer SET ?'
    db.query(sql, req.body, (err, result) => {
        if (err) {  
            res.status(404).send()
        }else {
            res.status(200).send('Transaction added')
        }
    })
})

router.post('/playerbet', (req, res) => {
    let sql = 'INSERT INTO HandDetailsPlayerBets SET ?'
    db.query(sql, req.body, (err, result) => {
        if (err) {  
            res.status(404).send()
        }else {
            res.status(200).send('Transaction added')
        }
    })
})

router.post('/playercards', (req, res) => {
    let sql = 'INSERT INTO HandDetailsPlayerCards SET ?'
    db.query(sql, req.body, (err, result) => {
        if (err) {  
            res.status(404).send()
        }else {
            res.status(200).send('Transaction added')
        }
    })
})



router.delete('/logindelete/:id', (req, res) => {
    let sql = `DELETE FROM loggedUsers WHERE username = '${req.params.id}';`
    db.query(sql, (err, result) => {
        if (err) {  
            res.status(404).send()
        }else {
            res.status(200).send(`User ${req.params.id} deleted`)
        }
    })
})

router.get('/logindetails', (req, res) => {
    let sql = `SELECT * FROM Users` 
    db.query(sql, (err, result) => {
        if (err)  console.log(err)
        res.send(result)
    })
})


router.get('/userdetails', (req, res) => {
    let sql = `SELECT loggedUsers.playerID, Users.username, firstName, lastName, email, street, city, postalCode, country, password, balance
                FROM Users
                JOIN loggedUsers
                ON Users.playerID = loggedUsers.playerID` 
    db.query(sql, (err, result) => {
        if (err)  console.log(err)
        res.send(result)
    })
})

router.get('/handhistory/:id', (req, res) => {
    let sql = `SELECT H.handID, H.handTime, HDD.card AS DealerCard, HDPC.card AS PlayerCard, HDPB.betAmount, HDPB.outcome, HDPB.totalAmountAvailableAtHandFinish, HDPC.isSplit
    FROM Hands H
    JOIN HandDetailsDealer HDD 
    ON H.handID = HDD.handID
    JOIN HandDetailsPlayerCards HDPC
    ON H.handID = HDPC.handID
    JOIN HandDetailsPlayerBets HDPB
    ON H.handID = HDPB.handID
    WHERE HDPC.playerID = ${req.params.id} AND HDPB.playerID = ${req.params.id};`
    db.query(sql, (err, result) => {
        if (err){
            res.status(404).send()
            console.log(err)
        }else {
            res.send(result)
        }
    })
})

router.post('/', function (req, res, next) {
    userRepo.insert(req.body, function(data) {
        res.status(201).json({
            "status": 201,
            "statusText": "Created",
            "message": "New User Added.",
            "data": data
        })
    }, function(err){
        next(err)
    })
})

app.use('/api', router)

let server = app.listen('8080', () => {
    console.log('Server started on port 8080')
})
