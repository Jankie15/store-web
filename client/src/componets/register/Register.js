import React, {useState} from 'react';
import { useMutation } from '@apollo/client';
import { withRouter} from "react-router-dom";

// Interfaz
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

// Mutations
import {CREATE_USER} from '../../mutation/index';

const Register = ({history}) => {


    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [createUser] = useMutation(CREATE_USER);

    const handleRegister = async() => {
        const input = {
            name,
            email,
            password
          };
          
          try {
            const correctUser = await createUser({variables:{input}});
            
            if(correctUser.data.createUser === 'Guardado exitosamente'){
              history.push(`/`);
            }
          } catch (error) {
              console.log('Hola');
          }
          setName('');
          setEmail('');
          setPassword('');
    }


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
            </form>
        </div>
        </Container>
    );
};

export default withRouter(Register);
