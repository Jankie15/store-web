import {gql} from '@apollo/client';

export const AUTH_USER = gql`
mutation authUser($input: UserInput){
    authUser(input: $input){
        id
        name
        email
        type
    }
}
`;

export const CREATE_ORDER = gql`
mutation createOrder($input: OrderInput){
    createOrder(input:$input)
}
`;

export const UPDATE_ORDER = gql`
mutation updateOrder($input: OrderInput){
    updateOrder(input:$input)
}
`;

export const CREATE_USER = gql`
mutation createUser($input: UserInput){
	createUser(input: $input)
}
`;