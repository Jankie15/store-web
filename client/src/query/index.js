import {gql} from '@apollo/client';

export const GET_ORDERS = gql`
query getOrders{
    getOrders{
      id
      user_id
      products {
        product_id {
          name
          photo
        }
        quantity
      }
      total
      date
      estimated_date
      status
    }
}
`;

export const GET_ORDERS_BY_USER = gql`
query getOrderByUser($id: ID){
    getOrderByUser(id: $id){
      id
      user_id
      products {
        product_id {
          name
          photo
        }
        quantity
      }
      total
      date
      estimated_date
      status
    }
}
`;

export const GET_PRODUCTS = gql`
query getProducts{
    getProducts{
      id
      name
      photo
      value
    }
}
`;