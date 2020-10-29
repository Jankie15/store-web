const {ApolloServer} = require('apollo-server');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'});
const typeDefs = require('./db/schema');
const resolvers  = require('./db/resolvers');
const conectarDB = require('./config/db');

// Conectar a la base de datos
conectarDB();

const server = new ApolloServer({
    typeDefs, 
    resolvers,
});

server.listen({port: process.env.PORT || 4000}).then(({url}) =>{
    console.log(`Server is ready at ${url}`);
});