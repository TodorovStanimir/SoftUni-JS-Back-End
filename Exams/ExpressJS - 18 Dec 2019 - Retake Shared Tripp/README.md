# ExpressJS - 18 Dec 2019 - Retake Shared Tripp with Mongoose Atlas


## There are two options to start project

### First: It is neccesary to add file nodemon.json in the main directory with structure:

{\
    "env": {\
        "MONGO_USER": "Your user name",\
        "MONGO_PASSWORD": "Your password",\
        "MONGO_DEFAULT_DATABASE": "name of database",\
        "PORT"="Up to You",\
        "JWT_SECRET": "Your secret",\
        "COOKIE_SECRET": "Your cookie",\
        "SALT_ROUNDS": Number up to You\
    }\
}

In this case You can run project, with npm run dev.

### Second: It is neccesary to add file .env in the main directory with structure:

\# .env\
NODE_ENV=development\
MONGO_USER=Your user name\
MONGO_PASSWORD=Your password\
MONGO_DEFAULT_DATABASE=name of database\
PORT=Up to You\
JWT_SECRET=Your secret\
COOKIE_SECRET=Your cookie\
SALT_ROUNDS=Number up to You

In this case You can run project, with node index.js or run debugger or npm run dev.