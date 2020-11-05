import React, {useState, forwardRef} from 'react';
import { useQuery } from '@apollo/client';
import { withRouter} from "react-router-dom";

// Interfaz
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import CloseIcon from '@material-ui/icons/Close';
import { Button, Container, IconButton, AppBar, Toolbar, Paper, Slide, Dialog } from '@material-ui/core';

// Other imports
import moment from 'moment';
import {GET_ORDERS_BY_USER} from '../../query/index';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const UserOrder = () => {

    const {loading, error, data, refetch} = useQuery(GET_ORDERS_BY_USER, {variables:{id: localStorage.getItem('id')}});
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
                <h1 className="mt-3">Ordenes de {localStorage.getItem('name')}</h1>
                <br/>
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
                <Dialog fullScreen open={openDialog} onClose={handleClose} TransitionComponent={Transition}>
                    
                    <AppBar style={{ background: '#343A40' }}>
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                            <h5>
                                Información adicional del pedido
                            </h5>
                        </Toolbar>
                    </AppBar>
                    <div className="mt-2 p-4">
                        <h4 className="mt-5">Aqui va la historia</h4>
                    </div>
                </Dialog>
            </Container>
            
        </div>
    );
}

export default withRouter(UserOrder);