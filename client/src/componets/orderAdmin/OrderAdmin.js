import React, {useState, useEffect} from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { withRouter } from "react-router-dom";

// Interfaz
import {Paper, Collapse, MenuItem, Select, DialogTitle, DialogContent, DialogActions, Dialog} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import moment from 'moment';
import MomentUtils from '@date-io/moment';

// Otros importes
import {GET_ORDERS} from '../../query/index';
import {UPDATE_ORDER} from '../../mutation/index';
import { Button, Container } from '@material-ui/core';

const OrderAdmin = ({history}) => {

    // Query para realizar la consultas de ordenes
    const {loading, error, data, refetch} = useQuery(GET_ORDERS);

    // Mutation para actualizar una orden
    const [updateOrder] = useMutation(UPDATE_ORDER);

    // State del componente
    const [openDialog, setOpenDialog] = useState(false);
    const [orderDetails, setOrderDetails] = useState({});
    const [orderStatus, setOrderStatus] = useState('');
    const [orderEstimatedDate, setOrderEstimatedDate] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showSuccesAlert, setShowSuccesAlert] = useState(false);

    // Función de seguridad para verificar que esta parte de la aplicación solo sea accesible por usuarios administradores
    useEffect(() => {
        if(localStorage.getItem('type') !== 'Admin'){
            history.push('/');
        }
    });
    
    // Rellenar la orden para posteriormente mostrarla a nivel de interfaz
    const showDetails = (order) => {
        setOrderDetails(order);
        setOrderEstimatedDate(order.estimated_date === null? moment().format('DD/MM/YYYY'): order.estimated_date);
        setOrderStatus(order.status);
        setOpenDialog(true);
    }

    // Cierra la ventana emergente del detalle de orden
    const handleClose = () =>{
        setOpenDialog(false);
    }

    // Función que maneja  la actualización de la orden 
    const handleUpdateOrder = async() =>{

        // Creo el input con solo los datos que nececito, en esta caso solo la fecha estimada, estado de orden y id
        const input = {
            id: orderDetails.id,
            status: orderStatus,
            estimated_date: orderEstimatedDate
        };
        try {
            // Actualizo la orden, con el input
            const successUpdateOrder = await updateOrder({variables:{input}});
            
            // Si se actualiza correctamente, llamo la función refetch para actualizar la lista de ordenes y muestro una alerta de exito
            if(successUpdateOrder.data.updateOrder === 'Orden editada correctamente'){
                refetch();
                setOpenDialog(false);
                setShowSuccesAlert(true);
                setTimeout(() => {
                    setShowSuccesAlert(false);
                }, 3000);
            }
            
        }
        // En caso de que suceda un error muestro una alerta 
        catch (error) {
            console.log(error);
            setShowAlert(true);
        }
    }

    // Función para mostrar alertas
    const handleCloseAlert = () =>{
        setShowAlert(false);
    }

    // Función para cerrar sesión
    const logout = () =>{
        history.push(`/`);
        localStorage.clear();
    }

    // Si las ordenes aun estan cargando
    if(loading) return 'Loading...';
    if(error) return 'Error';   
    return (
        <div className="container">
            <Container component={Paper} className="p-3 mt-3">
                <div className="row p-2 mt-3 d-flex justify-content-between">
                    <h1>Ordenes</h1>
                    <button type="button"  className="btn btn-dark mt-2" style={{height:'40px'}} onClick={()=>logout()}>Cerrar sesión</button>
                </div>
                
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

export default withRouter(OrderAdmin);