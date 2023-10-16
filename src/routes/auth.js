// // passportFacebook.js
// const passport = require('passport');
// const FacebookStrategy = require('passport-facebook');
// const sql = require('mssql');




// passport.use(new FacebookStrategy({
//   clientID: process.env.FACEBOOK_APP_ID,
//   clientSecret: process.env.FACEBOOK_APP_SECRET,
//   callbackURL: '/auth/facebook/callback',
//   state: true
// }, async (accessToken, refreshToken, profile, cb) => {
//   try {
//     // Use the database pool to execute SQL queries for authentication and user registration
//     const request = new sql.Request(pool);

//     // Implement your authentication and user registration logic here
//     // You can use the createUser function here if needed

//     // Example: Check if the user exists in the database
//     const userExists = await request.query('SELECT * FROM users WHERE username = @username', {
//       username: profile.username,
//     });

//     if (userExists.recordset.length > 0) {
//       // User exists, return the user's information
//       const user = userExists.recordset[0];
//       return cb(null, user);
//     } else {
//       // User doesn't exist, create a new user (you can use createUser function)
//       // and return the newly created user's information
//       // ...
//     }
//   } catch (err) {
//     return cb(err);
//   }
// }));

// // Passport.js serialization and deserialization functions
// // ...

// module.exports = passport;
