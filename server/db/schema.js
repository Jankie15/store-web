const {gql} = require('apollo-server');

const typeDefs = gql`

    type User {
        name: String
        email: String
        password: String
    }

    type Product {
        name: String
        photo: String
        value: String
    }

    type Order {
        products: [Product]
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
        name: String!
        email: String!
        password: String!
    }

    input ProductInput {
        name: String!
        photo: String
        value: String!
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
    }
    type Mutation{
        # Users
        createUser(input: UserInput): String
    }
`;

module.exports = typeDefs;