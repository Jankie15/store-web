import React, {useState, useEffect, forwardRef} from 'react';
import { useQuery } from '@apollo/client';
import { withRouter, Link } from "react-router-dom";

// Interfaz
import { Button, Container, IconButton, AppBar, Toolbar, Paper,Avatar, Slide, Dialog, Typography, makeStyles, Table, TableCell, TableContainer, TableHead, TableRow, TableBody } from '@material-ui/core';
import {Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineOppositeContent, TimelineDot} from '@material-ui/lab/';
import { blue } from '@material-ui/core/colors';
// Icons
import DoneAllIcon from '@material-ui/icons/DoneAll';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import CloseIcon from '@material-ui/icons/Close';

// Otros importes
import moment from 'moment';
import { GET_ORDERS_BY_USER } from '../../query/index';

// Transición al abrir la ventana de mostrar mas detalles del pedido
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// Creo los estilos de Material UI
const useStyles = makeStyles((theme) => ({
    paper: {
        padding: '6px 16px',
    },
    secondaryTail: {
        backgroundColor: theme.palette.secondary.main,
    },
    root: {
        minWidth: 275,

    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
        width: 80,
        height: 80,
        marginRight: 25
    },
}));


const UserOrder = ({history}) => {

    // State del componente
    const { loading, error, data/*, refetch*/ } = useQuery(GET_ORDERS_BY_USER, { variables: { id: localStorage.getItem('id') }, pollInterval:1000 });
    const [openDialog, setOpenDialog] = useState(false);
    const [orderDetails, setOrderDetails] = useState({});
  
    // Función de seguridad para verificar que esta parte de la aplicación solo sea accesible por usuarios autenticados
    useEffect(() => {
        if(localStorage.getItem('type') !== 'Normal'){
            history.push('/');
        }
    });

    // Inicializo los estilos de Material
    const classes = useStyles();

    if (loading) return 'Loading...';
    if (error) return 'Error';

    // Abrir la ventana que muestra los datos del pedido
    const showDetails = (order) => {
        setOrderDetails(order);
        setOpenDialog(true);
    }

    // Cierro la ventana
    const handleClose = () => {
        setOpenDialog(false);
    }


    return (
        <div className="container">
            
            <Container component={Paper} className="p-3 mt-3">
                <Link to= "/home" className="btn btn-dark mr-4">
                    &lt; Volver
                </Link>
                <h1 className="mt-3">Ordenes de {localStorage.getItem('name')}</h1>
                <br />
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
                            data.getOrderByUser.map((order, index) => (
                                <>
                                    <tr key={index}>
                                        <th scope="row">{order.order}</th>
                                        <td>{moment(order.date).format('DD/MM/YYYY')}</td>
                                        <td>{order.status}</td>
                                        <td><Button variant="contained" color="default" onClick={() => showDetails(order)}>Ver más</Button></td>
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
                        </Toolbar>
                    </AppBar>
                    <Container minWidth="md">
                        <div className="mt-5 p-4">

                            <Timeline align="alternate">
                                <TimelineItem>
                                    <TimelineOppositeContent>
                                        <Typography variant="body2" color="textSecondary">Pedido el 
                                           { ' '+moment(orderDetails.date).format('DD/MM/YYYY')}
                                    </Typography>
                                    </TimelineOppositeContent>
                                    <TimelineSeparator>
                                        <TimelineDot>
                                            <QueryBuilderIcon />
                                        </TimelineDot>
                                        <TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent>
                                        <Paper elevation={3} className={classes.paper}>
                                            <Typography variant="h6" component="h1">
                                               Procesando
                                </Typography>
                                            <Typography>Estamos procesando tu pedido</Typography>
                                        </Paper>
                                    </TimelineContent>
                                </TimelineItem>
                                {orderDetails.status === 'TRANSITO'? 
                                    <TimelineItem>
                                         <TimelineOppositeContent>
                                            <Typography variant="body2" color="textSecondary">Fecha estimada
                                            {' '+ moment(orderDetails.estimated_date).format('DD/MM/YYYY')}
                                        </Typography>
                                        </TimelineOppositeContent>
                                        <TimelineSeparator>
                                            <TimelineDot color="primary">
                                                <LocalShippingIcon />
                                            </TimelineDot>
                                            <TimelineConnector />
                                        </TimelineSeparator>
                                        <TimelineContent>
                                            <Paper elevation={3} className={classes.paper}>
                                                <Typography variant="h6" component="h1">
                                                Transito
                                        </Typography>
                                                <Typography>Pedido en camino</Typography>
                                            </Paper>
                                        </TimelineContent>
                                    </TimelineItem>
                                :''}
                                  {orderDetails.status === 'RECIBIDO'? 
                                       <div>
                                            <TimelineItem>
                                            <TimelineOppositeContent>
                                            <Typography variant="body2" color="textSecondary">Fecha estimada
                                            {' '+ moment(orderDetails.estimated_date).format('DD/MM/YYYY')}
                                        </Typography>
                                        </TimelineOppositeContent>
                                        <TimelineSeparator>
                                            <TimelineDot color="primary">
                                                <LocalShippingIcon />
                                            </TimelineDot>
                                            <TimelineConnector />
                                        </TimelineSeparator>
                                        <TimelineContent>
                                            <Paper elevation={3} className={classes.paper}>
                                                <Typography variant="h6" component="h1">
                                                Transito
                                        </Typography>
                                                <Typography>Pedido en camino</Typography>
                                            </Paper>
                                        </TimelineContent>
                                    </TimelineItem>

                                    <TimelineItem >
                                        
                                        <TimelineSeparator>
                                            <TimelineDot color="secondary">
                                                <DoneAllIcon />
                                            </TimelineDot>
                                        </TimelineSeparator>
                                        <TimelineContent>
                                            <Paper elevation={3} className={classes.paper}>
                                                <Typography variant="h6" component="h1">
                                                Recibido
                                    </Typography>
                                                <Typography>Gracias por tu compra</Typography>
                                            </Paper>
                                        </TimelineContent>
                                    </TimelineItem>
                                       </div>
                                :''}

                            </Timeline>
                            

                        </div>
                    </Container>
                    <Container >
                    <TableContainer component={Paper}>
                        <Table minWidth= '650' aria-label="simple table">
                            <TableHead style={{marginLeft:'500'}}>
                            <TableRow>
                                <TableCell>Referencia</TableCell>
                                <TableCell>Producto</TableCell>
                                <TableCell align="right">Cantidad</TableCell>
                               
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            { orderDetails.products ? 
                                orderDetails.products.map((value, index) => (
                                <TableRow key={index}>
                                <TableCell component="th" scope="row"> <Avatar className={classes.avatar} src={value.product_id.photo} /></TableCell>
                                <TableCell component="th" scope="row">  <Typography variant="h6" component="h1">{value.product_id.name}</Typography></TableCell>
                                <TableCell align="right"><Typography variant="h6" component="h1">{value.quantity}</Typography></TableCell>
                              
                               
                                </TableRow>
                            )): <h1>No existen ordenes</h1>}
                            </TableBody>
                        </Table>
                        </TableContainer>
                        </Container>
                    
                      
                   


                </Dialog>
            </Container>

        </div>
    );
}

export default withRouter(UserOrder);