const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'});

// Modelos
const Orders = require('../models/Orders');
const Products = require('../models/Products');
const Users = require('../models/Users');

const resolvers = {
    Query: {
        //----------------------------------------
        // Users
        //----------------------------------------
        getUsers: async(root, {})=>{
            const users = await Users.find({});
            return users;
        },
        //----------------------------------------
        // Products
        //----------------------------------------
        getProducts: async(root, {})=>{
            const products = await Products.find({});
            return products;
        },
        //----------------------------------------
        // Orders
        //----------------------------------------
        getOrders: async(root, {})=>{
            const order = await Orders.find({});
            return order;
        }
    },
    Mutation:{
        //----------------------------------------
        // Users
        //----------------------------------------
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
        /*
        updateUser: async(root, {input})=>{
            try {
                const user = new Users(input);

                // Almacenar en la base de datos
                const resultado = await user.find();

                return "Guardado exitosamente";
            } catch (error) {
                console.log(error);
            }
        },
        */
        //----------------------------------------
        // Products
        //----------------------------------------
        createProduct: async(root, {input})=>{
            try {
                const product = new Products(input);

                // Almacenar en la base de datos
                const resultado = await product.save();

                return "Guardado exitosamente";
            } catch (error) {
                console.log(error);
            }
        },
        //----------------------------------------
        // Orders
        //----------------------------------------
        createOrder: async(root, {input})=>{
            try {
                const order = new Orders(input);

                // Almacenar en la base de datos
                const resultado = await order.save();

                return "Guardado exitosamente";
            } catch (error) {
                console.log(error);
            }
        },

    }
}

module.exports = resolvers;
