// const API_KEYS = []
// let apiKeysGen = 0

// const checkApiKey = (req, res, next) => {
//   const apiKey = req.headers['api-key']
//   if(!API_KEYS.includes(apiKey)) {
//     return res.status(401).json({
//       status: 'FAILED',
//       message: `Invalid API key. If you don't have one, please sign up`
//     })
//   }

//   next()
// }

// Inside the handler
// const API_KEY = `DUMMY2024KEY${++apiKeysGen}`
// API_KEYS.push(API_KEY)

// Can be attached to individual routes
// checkApiKey