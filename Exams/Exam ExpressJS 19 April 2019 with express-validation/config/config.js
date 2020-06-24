const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    port: process.env.PORT || 4000,
    dbUrl: process.env.MONGO_URL,
    database: process.env.MONGO_DEFAULT_DATABASE,
    cookieSecret: process.env.COOKIE_SECRET,
    jwtSecret: process.env.JWT_SECRET,
    saltRounds: Number(process.env.SALT_ROUNDS)
  },
  production: {}
}

module.exports = config[env];