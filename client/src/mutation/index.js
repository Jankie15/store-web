import {gql} from '@apollo/client';

export const AUTH_USER = gql`
mutation authUser($input: UserInput){
    authUser(input: $input)
}
`;

export const CREATE_ORDER = gql`
mutation createOrder($input: OrderInput){
    createOrder(input:$input)
}
`;

export const UPDATE_ORDER = gql`
mutation updateOrder($id:ID, $input: OrderInput){
    updateOrder(id:$id, input:$input)
}
`;