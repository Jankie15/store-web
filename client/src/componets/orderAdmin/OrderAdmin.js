import React, {useState} from 'react';
import { useQuery } from '@apollo/client';

// Interfaz
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

// Other imports
import {GET_ORDERS} from '../../query/index';
import { Button, Container } from '@material-ui/core';

const OrderAdmin = () => {

    const {loading, error, data} = useQuery(GET_ORDERS);
    const [openDialog, setOpenDialog] = useState(false);
    const [orderDetails, setOrderDetails] = useState({});
    const [orderStatus, setOrderStatus] = useState('');
    const [orderDate, setOrderDate] = useState('');

    if(loading) return 'Loading...';
    if(error) return 'Error';   

    const showDetails = (order) => {
        setOrderDetails(order);
        setOpenDialog(true)
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
                            <th scope="col">Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.getOrders.map((order)=>(
                                <>
                                    <tr>
                                        <th scope="row">{order.id}</th>
                                        <td>{order.date}</td>
                                        <td>{order.status}</td>
                                        <td><Button variant="contained" color="default" onClick={()=>showDetails(order)}>Ver más</Button></td>
                                    </tr>
                                </>
                            ))
                        }
                        
                    </tbody>
                </table>

                <Dialog maxWidth="md" fullWidth={true} onClose={handleClose} open={openDialog}>
                    <DialogTitle onClose={handleClose}>
                        <h3>Información adicional de la orden</h3>
                    </DialogTitle>
                    <DialogContent dividers>
                        <h5>Numero de orden</h5>
                        <p>
                           {orderDetails.id}
                        </p>
                        <h5>Fecha</h5>
                        <p>
                           {orderDetails.date}
                        </p> 
                        <h5>Fecha estimada</h5>
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                            <KeyboardDatePicker
                                margin="normal"
                                format="MM/dd/yyyy"
                                //value={selectedDate}
                                //onChange={handleDateChange}
                            />
                        </MuiPickersUtilsProvider>
                        <h5 className="mt-2">Estado</h5>
                        <Select
                            labelId="demo-simple-select-label"
                            value={orderDetails.status}
                            onChange={(e)=>setOrderStatus(e.target.value)}
                        >
                            <MenuItem value={"PROCESANDO"}>PROCESANDO</MenuItem>
                            <MenuItem value={"EN CAMINO"}>EN CAMINO</MenuItem>
                            <MenuItem value={"RECIBIDO"}>RECIBIDO</MenuItem>
                        </Select>
                        <h5 className="mt-4">Productos del pedido</h5>   
                        <table className="table table-stripe table-sm">
                            <thead >
                                <tr>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Cantidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    orderDetails.products? 
                                        orderDetails.products.map((orderProducts)=>(
                                            <>
                                                <tr>
                                                    <th>{orderProducts.product_id}</th>
                                                    <td>{orderProducts.quantity}</td>
                                                </tr>
                                            </>
                                        ))
                                    : 
                                    ''
                                }
                            </tbody>
                        </table>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} variant="contained" color="default">
                            Cancelar
                        </Button>
                        <Button onClick={handleClose} variant="contained" color="primary">
                            Guardar cambios
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
            
        </div>
    );
}

export default OrderAdmin;