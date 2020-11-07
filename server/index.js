const {ApolloServer} = require('apollo-server');
require('dotenv').config({path: 'variables.env'});
const typeDefs = require('./db/schema');
const resolvers  = require('./db/resolvers');
const conectarDB = require('./config/db');

// Conectar a la base de datos
conectarDB();

// Crear el servidor de apollo con los TypeDefinions y resolver de GraphQL
const server = new ApolloServer({
    typeDefs, 
    resolvers,
});

// Inicicializar el servidor, en el puerto correspondiente
server.listen({port: process.env.PORT || 4000}).then(({url}) =>{
    console.log(`Server is ready at ${url}`);
});