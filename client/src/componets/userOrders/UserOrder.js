import React, {useState} from 'react';
import { useQuery } from '@apollo/client';
import { withRouter} from "react-router-dom";

// Interfaz
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';

// Other imports
import {GET_ORDERS_BY_USER} from '../../query/index';
import { Button, Container } from '@material-ui/core';

const UserOrder = () => {

    const {loading, error, data, refetch} = useQuery(GET_ORDERS_BY_USER);
    const [openDialog, setOpenDialog] = useState(false);
    const [orderDetails, setOrderDetails] = useState({});

    if(loading) return 'Loading...';
    if(error) return 'Error';   

    const showDetails = (order) => {
        setOrderDetails(order);
        setOpenDialog(true);
    }

    const handleClose = () =>{
        setOpenDialog(false);
    }


    return (
        <div className="container">
            <Container component={Paper} className="p-3 mt-3">
                <h1 className="mt-3">Ordenes</h1>
                <table className="table table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Numero de orden</th>
                            <th scope="col">Fecha</th>
                            <th scope="col">Estado</th>
                            <th scope="col">Ver detalles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.getOrderByUser.map((order, index)=>(
                                <>
                                    <tr key={index}>
                                        <th scope="row">{order.id}</th>
                                        <td>{moment(order.date).format('DD/MM/YYYY')}</td>
                                        <td>{order.status}</td>
                                        <td><Button variant="contained" color="default" onClick={()=>showDetails(order)}>Ver más</Button></td>
                                    </tr>
                                </>
                            ))
                        }
                        
                    </tbody>
                </table>
                <Dialog maxWidth="md" fullWidth={true} onClose={handleClose} open={openDialog}>
                    <DialogTitle>
                        <h3>Información adicional de la orden</h3>
                    </DialogTitle>
                    <DialogContent dividers>
                        Hola
                    </DialogContent>
                </Dialog>
            </Container>
            
        </div>
    );
}

export default withRouter(UserOrder);