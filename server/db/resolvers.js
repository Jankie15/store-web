const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'});

// Modelos
const Orders = require('../models/Orders');
const Products = require('../models/Products');
const Users = require('../models/Users');

const resolvers = {
    Query: {
        getUsers: async(root, {})=>{
            const users = await Users.find({});

            return users;
        }
    },
    Mutation:{
        createUser: async(root, {input})=>{
            try {
                const user = new Users(input);

                // Almacenar en la base de datos
                const resultado = await user.save();

                return "Guardado exitosamente";
            } catch (error) {
                console.log(error);
            }
        },
    }
}

module.exports = resolvers;
