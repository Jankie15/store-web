import React, {useState} from 'react';
import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import WarningIcon from '@material-ui/icons/Warning';
import { blue, green, red } from '@material-ui/core/colors';

import {CREATE_ORDER} from '../../mutation/index'

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

    const [products, setProducts] = useState([]);
    const [user_id, setuser_id] = useState(localStorage.getItem('id'));
    const [total, setTotal] = useState(0);
    const [date, setDate] = useState(new Date());
    const [status, setStatus] = useState('PROCESANDO');
    const [estimated_date, setEstimated_date] = useState('');
    const [createOrder] = useMutation(CREATE_ORDER);

    const lista = [];
    const classes = useStyles();
    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    const buyProducts = async(value) => {
        var quantity =1;
        var id = '';
        let objeto = {};
        let listaApo =[];

        const input = {
            products,
            user_id,
            total,
            date,
            status,
            estimated_date
        }

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
        console.log(input);       
        
        try{
            const correctOrder = await createOrder({variables: {input}})
            if(correctOrder.data.createOrder === 'Guardado exitosamente'){
                console.log('lISTO');
                onClose(value);
              }
        }catch (error) {
            console.log('Hola');
        }
        
    };

    //let total = 0;
    //console.log(products);
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

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
};

export default SimpleDialog;


