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

    const [products, setProducts] = useState([{}]);
    const [userID, setuserID] = useState('5fa18970a74f3f345c0cf80b');
    const [total, setTotal] = useState(0);
    const [date, setDate] = useState(new Date());
    const [status, setStatus] = useState('PROCESANDO');
    const [createOrder] = useMutation(CREATE_ORDER);

    const classes = useStyles();
    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    const buyProducts = async(value) => {
        const input = {
            products,
            userID,
            total,
            date,
            status
        }
        try{
            const correctOrder = await createOrder({variables: {input}})
            if(correctOrder.data.createOrder === 'Guardado exitosamente'){
                onClose(value);
              }
        }catch (error) {
            console.log('Hola');
        }
        
        /*value.map((index) => index.value != null ?  (
           
            console.log(index.value.id)
        ): '')*/
       
        
    };

    //let total = 0;

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


