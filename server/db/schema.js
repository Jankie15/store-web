const {gql} = require('apollo-server');

const typeDefs = gql`

    type User {
        id: ID
        name: String
        email: String
        password: String
        type: String
    }

    type Product {
        id: ID
        name: String
        photo: String
        value: Int
    }
    
    type ProductOrder{
        product_id: Product!
        quantity: Int
    }

    type Order {
        id: ID
        order: String
        products: [ProductOrder]
        user_id: ID
        total: Int
        date: String
        status: OrderStatus
        estimated_date: String
    }

    enum OrderStatus{
        PROCESANDO
        TRANSITO
        RECIBIDO
    }
    
    input UserInput {
        name: String
        email: String!
        password: String!
        type: String
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
        id: ID
        order: String
        products: [ProductOrderInput]
        user_id: ID
        total: Int
        date: String
        status: OrderStatus
        estimated_date: String
    }
    
    type Query{
        getUsers: [User]
        getProducts: [Product]
        getOrders: [Order]
        getOrderByUser(id: ID): [Order]
    }

    type Mutation{
        # Users
        createUser(input: UserInput): String
        authUser(input: UserInput):User

        # Products
        createProduct(input: ProductInput): String
        updateProduct(id: ID, input: ProductInput): String
        deleteProduct(id: ID): String

        #Orders
        createOrder(input: OrderInput): String
        updateOrder(input: OrderInput): String   
    }
`;

module.exports = typeDefs;