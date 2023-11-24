const express = require('express');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const morgan = require('morgan');

const UserRoute = require('./routes/user');
const EmployeeRoute = require('./routes/employee');

// eslint-disable-next-line no-unused-vars
const connection = require('./utils/db/connection');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Backend Boiler plate',
            version: '1.0.0',
            description:
                'Server with SignIn and Sign Up and CRUD Operation on employee table',
        },
        components: {
            securitySchemes: {
                Authorization: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    value: 'Bearer <JWT token here>',
                },
            },
        },
        servers: [
            {
                url: 'http://localhost:8080',
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const specs = swaggerJsDoc(options);

const app = express();

app.use(morgan('dev'));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
app.use(
    cors({
        origin: '*',
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/user', UserRoute);
app.use('/employee', EmployeeRoute);

app.all('*', (req, res, next) => {
    const err = new Error(`can't find ${req.originalUrl} on the server!`);
    err.status = 'fail';
    err.statusCode = 404;
    next(err);
});
app.use((error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';
    res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
    });
});

module.exports = app;
