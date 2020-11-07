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
            const order = await Orders.find({}).populate([{path: 'products.product_id', model: 'Products'}]).sort({date: -1});
            //console.log(order);
            return order;
        },
        getOrderByUser: async(root, {id})=>{
            const orders = await Orders.find({user_id: id}).populate([{path: 'products.product_id', model: 'Products'}]).sort({date: -1});

            //console.log(orders);
            return orders;
        }
    },
    Mutation:{
        //----------------------------------------
        // Users
        //----------------------------------------
        createUser: async(root, {input})=>{
            try {
                // Extraer la contraseña
                const {password} = input;

                 // Encriptar contraseña
                const salt = await bcrypt.genSalt(10);
                input.password = await bcrypt.hash(password, salt);

                // Guardar usuario
                const user = new Users(input);
                user.save();
                return "Guardado exitosamente";
            } catch (error) {
                console.log(error);
            }
        },

        
        authUser: async(root, {input}) =>{
            const {email, password} = input;

            // Si el usuario existe
            const user = await Users.findOne({email});

            // Si el password existe
            const correctPassword = await bcrypt.compare(password, user.password);
            if(!correctPassword){
                throw new Error('La contraseña es incorrecta');
            }

            // Dar acceso a la app
            return user;
        },
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
        updateProduct: async(root, {id, input})=>{
            // Revisar si el prodcuto existe
            let product = await Products.findById(id);

            if (!product){
                throw new Error('Producto no encontrado');
            }

            // Actualizar el prodcuto
            product = await Products.findOneAndUpdate({_id: id}, input);

            return "Producto editado correctamente";
        },
        deleteProduct: async(root, {id})=>{
            // Revisar si el prodcuto existe
            let product = await Products.findById(id);

            if (!product){
                throw new Error('Producto no encontrado');
            }
 
            // Eliminar prodcuto
            await Products.findOneAndDelete({_id: id});
            
            return 'Producto eliminado con éxito';
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
        updateOrder: async(root, {input})=>{
            // Revisar si la orden existe
            let order = await Orders.findById(input.id);

            if (!order){
                throw new Error('Orden no encontrada');
            }

            // Actualizar la orden
            order = await Orders.findOneAndUpdate({_id: input.id}, input);

            return "Orden editada correctamente";
        },

    }
}

module.exports = resolvers;
