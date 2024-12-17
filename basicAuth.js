const basicAuth = require('express-basic-auth')

const basicAuthMiddleware = (email, password) => {
  const USERS = [
    {
      email: 'omkar@gmail.com',
      password: '123'
    },
    {
      email: 'sanchay@gmail.com',
      password: '456'
    }
  ]

  const user = USERS.find(user => {
    return basicAuth.safeCompare(email, user.email) && basicAuth.safeCompare(password, user.password)
  })

  return user
}


// app.use(basicAuth( { authorizer: basicAuthMiddleware } ))