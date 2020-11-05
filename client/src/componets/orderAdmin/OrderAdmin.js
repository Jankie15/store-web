import React, {useState} from 'react';
import { useQuery, useMutation } from '@apollo/client';

// Interfaz
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';

// Other imports
import {GET_ORDERS} from '../../query/index';
import {UPDATE_ORDER} from '../../mutation/index';
import { Button, Container } from '@material-ui/core';

const OrderAdmin = () => {

    const {loading, error, data, refetch} = useQuery(GET_ORDERS);
    const [updateOrder] = useMutation(UPDATE_ORDER);
    const [openDialog, setOpenDialog] = useState(false);
    const [orderDetails, setOrderDetails] = useState({});
    const [orderStatus, setOrderStatus] = useState('');
    const [orderEstimatedDate, setOrderEstimatedDate] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showSuccesAlert, setShowSuccesAlert] = useState(false);

    if(loading) return 'Loading...';
    if(error) return 'Error';   

    const showDetails = (order) => {
        setOrderDetails(order);
        setOrderEstimatedDate(order.estimated_date === null? moment().format('DD/MM/YYYY'): order.estimated_date);
        setOrderStatus(order.status);
        setOpenDialog(true);
    }

    const handleClose = () =>{
        setOpenDialog(false);
    }

    const handleUpdateOrder = async() =>{
        const input = {
            id: orderDetails.id,
            status: orderStatus,
            estimated_date: orderEstimatedDate
        };
        try {
            const successUpdateOrder = await updateOrder({variables:{input}});
            console.log(successUpdateOrder);
            
            if(successUpdateOrder.data.updateOrder === 'Orden editada correctamente'){
                refetch();
                setOpenDialog(false);
                setShowSuccesAlert(true);
                setTimeout(() => {
                    setShowSuccesAlert(false);
                }, 3000);
            }
            
        } 
        catch (error) {
            console.log(error);
            setShowAlert(true);
        }
    }

    const handleCloseAlert = () =>{
        setShowAlert(false);
    }

    return (
        <div className="container">
            <Container component={Paper} className="p-3 mt-3">
                <h1 className="mt-3">Ordenes</h1>
                <Collapse in={showSuccesAlert}>
                    <Alert severity="success">Se ha actualizado correctamente el estado de la orden</Alert>
                    <br/>
                </Collapse>
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
                            data.getOrders.map((order, index)=>(
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
                        <h5>Numero de orden</h5>
                        <p>
                           {orderDetails.id}
                        </p>
                        <h5>Fecha</h5>
                        <p>
                           {moment(orderDetails.date).format('DD/MM/YYYY')}
                        </p> 
                        <h5>Fecha estimada</h5>
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                            <KeyboardDatePicker
                                margin="normal"
                                format="DD/MM/yyyy"
                                value={orderEstimatedDate}
                                onChange={(e)=> setOrderEstimatedDate(e._d)}
                            />
                        </MuiPickersUtilsProvider>
                        <h5 className="mt-2">Estado</h5>
                        <Select
                            labelId="demo-simple-select-label"
                            value={orderStatus}
                            onChange={(e)=>setOrderStatus(e.target.value)}
                        >
                            <MenuItem value={"PROCESANDO"}>PROCESANDO</MenuItem>
                            <MenuItem value={"TRANSITO"}>EN TRANSITO</MenuItem>
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
                        <Button onClick={()=>handleUpdateOrder()} variant="contained" color="primary">
                            Guardar cambios
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog maxWidth="xs" fullWidth={true} onClose={handleCloseAlert} open={showAlert}>
                    <DialogTitle onClose={handleClose}>
                        <h3>Ocurrio un error</h3>
                    </DialogTitle>
                    <DialogContent dividers>
                        Favor intentarlo nuevamente
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseAlert} variant="contained" color="secondary">
                            Aceptar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
            
        </div>
    );
}

export default OrderAdmin;