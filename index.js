const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
const isLoggedIn = require('./jwtAuth')
const isUserAdmin = require('./middlewares/user')

const app = express()

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(express.static('public'))

const USERS = [
  {
    name: 'Pankaj',
    email: 'pankaj@gmail.com',
    password: bcrypt.hashSync('123', 10),
    isAdmin: false
  },
  {
    name: 'Anand',
    email: 'anand@gmail.com',
    password: bcrypt.hashSync('456', 10),
    isAdmin: true
  }
]

app.get('/', (req, res) => {
  res.json({
    message: 'Server is running',
    currentTime: new Date().toLocaleString()
  })
})

app.get('/api/users', (req, res) => {
  res.json({
    status: 'SUCCESS',
    data: USERS
  })
})

app.post('/api/signup', (req, res) => {
  const { name, email, password, isAdmin } = req.body

  // Encrypt the password
  const encryptedPassword = bcrypt.hashSync(password, 10)

  const newUser = { name, email, password: encryptedPassword, isAdmin }
  USERS.push(newUser)

  res.status(201).json({
    status: 'SUCCESS',
    message: `User '${name}' has signed up successfully!`
  })
})

app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body
    const user = USERS.find(user => user.email === email)
  
    if(!user) {
      return res.status(401).json({
        status: 'FAILED',
        message: `User with the given email does not exist!`
      })
    }
  
    const doesPasswordMatch = bcrypt.compareSync(password, user.password)
  
    if(!doesPasswordMatch) {
      return res.status(401).json({
        status: 'FAILED',
        message: `Invalid credentials!`
      })
    }

    const token = jwt.sign(user, process.env.JWT_PRIVATE_KEY, { expiresIn: '10h' })
  
    res.json({
      status: 'SUCCESS',
      message: `User '${user.name}' has logged in successfully!`,
      token
    })
  } catch(error) {
    res.status(500).json({
      status: 'FAILED',
      message: 'Something went wrong!'
    })
  }
})

/* --------- PRIVATE ROUTES --------- */
// Authentication
app.get('/profile', isLoggedIn, (req, res) => {
  const { user } = req
  res.send(`<h1>Welcome to your profile, ${user.name}!</h1>`)
})

// Authorization
app.get('/admin-dashboard', isLoggedIn, isUserAdmin, (req, res) => {
  const { user } = req
  res.send(`<h1>Welcome to Admin Dashboard, ${user.name}!</h1>`)
})

app.listen(3000, () => {
  console.log('Server is up :)')
})














/*
  # Securing APIs
    - Authentication
      - Identify a user uniquely
      - Website asking the user - "Who you are?"
      - Types:
        - Basic authentication: User has to provide credentials for each API request
        - API keys: First time when User signs up, API key is returned; For further requests, User has to provide API key with each API request
        - JWT (JSON Web Tokens) ***: First time when User signs up, token is returned; For further requests, User has to provide token with each API request
        - OAuth (Open authentication): Social logins (Google, Facebook, Apple, etc.)

    - Authorization
      - A user is allowed to access which parts of the website
      - Website asking the user - "What access do you have?"

    - Additional packages:
      - bcrypt ***: Encryption/Decryption
        - hashSync(data, saltRounds):
          - Parameters:
            - data: Original Data
            - saltRounds: Number of times the data is hashed
          - Returns: Encrypted data
        - compareSync(data, encryptedData)
          - Parameters:
            - data: Data to compare
            - encryptedData: Data to be compared with
          - Returns: True if data matches, false otherwise
      - jsonwebtoken ***: JWT
        - sign(data, privateKey, options)
          - data: Data to be signed (encrypted)
          - privateKey: Private key for signing (confidential)
          - options:
            - expiresIn: Number in seconds
        - verify(token, privateKey)
          - token: JWT token previously created, passed by the client
          - privateKey: Private key used while signing (confidential)

    - Encryption/Decryption
      - Encryption:
        - Algorithm: N + 3
        - Eg.:
          - Orginal word: GAURAV
          - Encrypted word: JDXUDY
      - Decryption:
        - Algorithm: N - 3
        - Eg.:
          - Encrypted word: JDXUDY
          - Orginal word: GAURAV

    # Resources
      - bcrypt: https://www.npmjs.com/package/bcrypt
      - express-basic-auth: https://www.npmjs.com/package/express-basic-auth
      - jsonwebtoken: https://www.npmjs.com/package/jsonwebtoken
*/