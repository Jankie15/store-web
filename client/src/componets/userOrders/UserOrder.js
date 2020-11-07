import React, {useState, forwardRef, useEffect} from 'react';
import { useQuery } from '@apollo/client';
import { withRouter } from "react-router-dom";

// Interfaz
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import CloseIcon from '@material-ui/icons/Close';
import { Button, Container, IconButton, AppBar, Toolbar, Paper, Slide, Dialog } from '@material-ui/core';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import TimelineDot from '@material-ui/lab/TimelineDot';

import LocalShippingIcon from '@material-ui/icons/LocalShipping';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';



// Other imports
import moment from 'moment';
import { GET_ORDERS_BY_USER } from '../../query/index';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
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
}));


const UserOrder = ({history}) => {

    const { loading, error, data, refetch } = useQuery(GET_ORDERS_BY_USER, { variables: { id: localStorage.getItem('id') } });
    const [openDialog, setOpenDialog] = useState(false);
    const [orderDetails, setOrderDetails] = useState({});

    useEffect(() => {
        if(localStorage.getItem('type') !== 'Normal'){
            history.push('/');
        }
    });
    const classes = useStyles();

    if (loading) return 'Loading...';
    if (error) return 'Error';

    const showDetails = (order) => {
        setOrderDetails(order);
        setOpenDialog(true);

        console.log(orderDetails.id);
        /*
        orderDetails.products.map((value)=>{
            console.log(value.product_id);
        });
        */
    }

    const handleClose = () => {
        setOpenDialog(false);
    }


    return (
        <div className="container">
            <Container component={Paper} className="p-3 mt-3">
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
                                        <th scope="row">{order.id}</th>
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
                    <Container maxWidth="md">
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
                                               Pocesando
                                </Typography>
                                            <Typography>Estamos procesando tu pedido</Typography>
                                        </Paper>
                                    </TimelineContent>
                                </TimelineItem>
                                {orderDetails.status === 'TRANSITO'? 
                                    <TimelineItem>
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
                    <Container maxWidth="md">
                    <TableContainer component={Paper}>
                        <Table minWidth= '650' aria-label="simple table">
                            <TableHead style={{marginLeft:'500'}}>
                            <TableRow>
                                <TableCell>Producto</TableCell>
                                <TableCell align="right">Cantidad</TableCell>
                               
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            { orderDetails.products ? 
                                orderDetails.products.map((value, index) => (
                                <TableRow key={index}>
                                <TableCell component="th" scope="row"> {value.product_id}</TableCell>
                                <TableCell align="right">{value.quantity}</TableCell>
                              
                               
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