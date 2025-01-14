const pg = require('pg');
let pool;

// When our app is deployed to the internet 
// we'll use the DATABASE_URL environment variable
// to set the connection info: web address, username/password, db name
// eg: 
//  DATABASE_URL=postgresql://jDoe354:secretPw123@some.db.com/prime_app
if (process.env.DATABASE_URL) {
    // console.log('DATABASE_URL:', process.env.DATABASE_URL);
    pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
    // pool.connect()
    // .then(() => console.log('connected to db via dburl'))
    // .catch(err => console.error('Error connecting to DB', err))
}
// When we're running this app on our own computer
// we'll connect to the postgres database that is 
// also running on our computer (localhost)
else {
    let databaseName = 'saga_movies_weekend'
    
    if (process.env.NODE_ENV === 'test') {
      databaseName = 'prime_testing'
    }

    pool = new pg.Pool({
        host: 'localhost',
        port: 5432,
        database: databaseName, 
    });
}

module.exports = pool;