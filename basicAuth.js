// const basicAuth = require('express-basic-auth')

// const basicAuthMiddleware = (email, password) => {
//   const user = USERS.find(user => {
//     return basicAuth.safeCompare(email, user.email) && basicAuth.safeCompare(password, user.password)
//   })

//   return user
// }

// Can be attached to individual routes
// basicAuth( { authorizer: basicAuthMiddleware } )