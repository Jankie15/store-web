import React, {useState} from 'react';
import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';

// Interfaz
import {Dialog, DialogTitle, ListItemText, ListItemAvatar, ListItem, List, Avatar, makeStyles} from '@material-ui/core/';

// Iconos y colores
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import WarningIcon from '@material-ui/icons/Warning';
import { blue, green, red } from '@material-ui/core/colors';

// Otros importes
import {CREATE_ORDER} from '../../mutation/index'

// Creo los styles para Material UI
const useStyles = makeStyles({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
        width: 100,
        height: 100,
        marginRight: 25
    },
    warning: {
        backgroundColor: red[100],
        color: red[600],
    },
    
    shop: {
        
        backgroundColor: green[100],
        color: green[600],
    }
});

const SimpleDialog = (props) => {

    // State del componente
    const [products, setProducts] = useState([]);
    const [user_id] = useState(localStorage.getItem('id'));
    const [date] = useState(new Date());
    const [status] = useState('PROCESANDO');
    const [estimated_date] = useState('');

    // Mutation de crear orden
    const [createOrder] = useMutation(CREATE_ORDER);

    // Variable de apoyo
    const lista = [];
    const listaPrecios = [];

    // Inicializo las estilos de Material 
    const classes = useStyles();

    // Obtengo las variables que obtengo por props
    const { onClose, selectedValue, open } = props;

    // Cerrar la ventana emergente del carrito
    const handleClose = () => {
        onClose(selectedValue);
    };

    // Función para realizar la compra
    const buyProducts = async(value) => {
        
        // Variables de apoyo para el proceso de eliminiación de repetidos 
        var quantity =1;
        var id = '';
        let objeto = {};
        let listaApo =[];
        let ordenTotal = 0;

        
        //Cuenta y elimina los repetidos al carrito      
        for(let i=0; i< lista.length; i++){
            for(let j=i+1; j< lista.length; j++){          
                if(lista[i]===lista[j]){
                    id = lista[i];
                    quantity = quantity + 1;  
                    delete lista[j];   
                }             
            }
            if(quantity === 1){
                id = lista[i];              
            }
            if(id !== undefined){
                console.log(id);
                objeto = {product_id: id, quantity}; 
                listaApo.push(objeto);
                id = '';
                objeto = {};
                quantity = 1;
            }       
        }
        setProducts(listaApo);   

        for(let i = 0; i<listaPrecios.length; i++){
            console.log(listaPrecios[i]);
            ordenTotal = ordenTotal + listaPrecios[i];
        }
        
        console.log(ordenTotal);
        // Creo el input para enviarlo al mutation
        const input = {
            products,
            user_id,
            total: ordenTotal,
            date,
            status,
            estimated_date
        }

        // Ejecto el mutation
        try{
            const correctOrder = await createOrder({variables: {input}})
            if(correctOrder.data.createOrder === 'Guardado exitosamente'){
                setProducts([]);
                onClose(value);
            }
        }catch (error) {}
        
    };

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} fullWidth={300}>
            <DialogTitle id="simple-dialog-title">Mi Carrito</DialogTitle>
            {
                <List>
                    {props.carItems.length === 1 ?
                        <ListItem >
                            <ListItemAvatar>
                                <Avatar className={classes.warning} src="">
                                    <WarningIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={'No existen elementos de compra'} />
                        </ListItem>
                        :
                        <div>
                            {
                                props.carItems.map((index) => index.value != null ? (

                                    
                                    <ListItem  key={index.value.id}>
                                        
                                        <ListItemAvatar>
                                            <Avatar className={classes.avatar} src={index.value.photo} >
                                                <ShoppingBasketIcon />
                                                {lista.push(index.value.id)}
                                                {listaPrecios.push(index.value.value)}
                                                
                                            </Avatar>
                                        </ListItemAvatar>
                                       
                                        <ListItemText primary={index.value.name} />
                                        <ListItemText primary={index.value.value} />

                                    </ListItem>

                                ) : '')
                            }
                            <ListItem autoFocus button onClick={() => buyProducts(props.carItems)}>
                                <ListItemAvatar>
                                    <Avatar className={classes.shop}>
                                        <DoneOutlineIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Comprar" />
                            </ListItem>
                        </div>
                    }
                </List>
            }
        </Dialog>
    );
}

// Hago la especificación de los props que necesita el compoente para funcionars
SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
};

export default SimpleDialog;


