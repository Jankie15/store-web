import React, {useState} from 'react';
import { useMutation } from '@apollo/client';
import { withRouter} from "react-router-dom";

// Interfaz
import { makeStyles, Typography, CssBaseline, TextField, Button, Container, Collapse } from '@material-ui/core/';
import Alert from '@material-ui/lab/Alert';

// Mutations
import {CREATE_USER} from '../../mutation/index';

const Register = ({history}) => {

    // State de la aplicación
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    // Llamar al mutation
    const [createUser] = useMutation(CREATE_USER);

    // Funcipin encargada de manejar el registro de usuarios
    const handleRegister = async() => {

        // Creo el input con los datos del state y unos estaticos
        const input = {
            name,
            email,
            password,
            type: 'Normal'
          };
          try {
            // Llamo el mutation con el input necesario creado previamente
            const correctUser = await createUser({variables:{input}});
            
            // En caso de que el usuario haya sido creado correctamente se le redirige al Login
            if(correctUser.data.createUser === 'Guardado exitosamente'){
              history.push(`/`);
            }
          } catch (error) {
            // Muestro un alerta en caso de que algun error suceda
            setName('');
            setEmail('');
            setPassword('');
            setShowAlert(true);
            setTimeout(() => {
              setShowAlert(false);
            }, 3000);
          }
          
    }


    // Styles necesarios para el buen funcionamiento de Material-UI
    const style = makeStyles((theme) => ({
        paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        },
        avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
        },
        form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1),
        },
        submit: {
        margin: theme.spacing(3, 0, 2),
        },
    }));

    // Inicializo los estilos
    const styles = style();

    return (
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={styles.paper}>
            <Typography component="h1" variant="h3">
                Registrar
            </Typography>
            <form className={styles.form} noValidate>
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="email"
                    label="Nombre"
                    name="email"
                    autoComplete="email"
                    value={name}
                    onChange={(e) => {
                    setName(e.target.value);
                    }}
                    autoFocus
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="email"
                    label="Correo Electronico"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                    setEmail(e.target.value);
                    }}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name="password"
                    label="Contraseña"
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => {
                    setPassword(e.target.value);
                    }}
                    autoComplete="current-password"
                />
                <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={styles.submit}
                    onClick={() => handleRegister()}
                >
                    Registrar
                </Button>

                <Collapse in={showAlert}>
                    <Alert severity="error">Hubo un error al registrar</Alert>
                </Collapse>
            </form>
        </div>
        </Container>
    );
};

export default withRouter(Register);
