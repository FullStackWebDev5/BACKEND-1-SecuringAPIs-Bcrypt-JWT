const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')

const app = express()

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(express.static('public'))

const USERS = []

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
  const { name, email, password } = req.body

  // Encrypt the password
  const encryptedPassword = bcrypt.hashSync(password, 10)

  const newUser = { name, email, password: encryptedPassword }
  USERS.push(newUser)
  res.status(201).json({
    status: 'SUCCESS',
    message: `User '${name}' has signed up successfully!`
  })
})

app.post('/api/login', (req, res) => {
  const { email, password } = req.body
  const user = USERS.find(user => user.email === email)

  if(!user) {
    return res.status(400).json({
      status: 'FAILED',
      message: `User with the given email does not exist!`
    })
  }

  const doesPasswordMatch = bcrypt.compareSync(password, user.password)

  if(!doesPasswordMatch) {
    return res.status(400).json({
      status: 'FAILED',
      message: `Invalid credentials!`
    })
  }

  res.json({
    status: 'SUCCESS',
    message: `User '${user.name}' has logged in successfully!`
  })
})

// Private route
app.get('/profile', (req, res) => {
  res.send('<h1>Welcome to your profile!</h1>')
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
        - API keys: First time when User signs up, API key is returned; For further requests, User has to provide API key for each API request
        - JWT (JSON Web Tokens) ***: First time when User signs up, token is returned; For further requests, User has to provide token for each API request
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
*/