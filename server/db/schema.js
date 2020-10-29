const {gql} = require('apollo-server');

const typeDefs = gql`

    type User {
        id: ID
        name: String
        email: String
        password: String
    }

    type Product {
        id: ID
        name: String
        photo: String
        value: Int
    }
    
    type ProductOrder{
        product_id: ID!
        quantity: Int
    }

    type Order {
        id: ID
        products: [ProductOrder]
        user_id: ID
        total: Int
        date: String
        status: OrderStatus
        estimated_date: String
    }

    enum OrderStatus{
        PROCESANDO
        EN CAMINO
        RECIBIDO
    }
    
    input UserInput {
        name: String
        email: String!
        password: String!
    }

    input ProductInput {
        name: String!
        photo: String
        value: Int!
    }

    input ProductOrderInput{
        product_id: ID!
        quantity: Int
    }

    input OrderInput {
        products: [ProductOrderInput]
        user_id: ID!
        total: Int!
        date: String!
        status: OrderStatus!
        estimated_date: String!
    }
    
    type Query{
        getUsers: [User]
        getProducts: [Product]
        getOrders: [Order]
    }
    type Mutation{
        # Users
        createUser(input: UserInput): String
        authUser(input: UserInput):String

        # Products
        createProduct(input: ProductInput): String
        updateProduct(id: ID, input: ProductInput): String
        deleteProduct(id: ID): String

        #Olders
        createOrder(input: OrderInput): String
    }
`;

module.exports = typeDefs;