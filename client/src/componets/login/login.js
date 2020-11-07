import React, {useState} from 'react';
import { useMutation } from '@apollo/client';
import { withRouter, Link } from "react-router-dom";

// Interfaz
import {Button, CssBaseline, TextField, Grid, makeStyles, Container, Collapse, Typography} from '@material-ui/core/';
import Alert from '@material-ui/lab/Alert';

// Mutations
import {AUTH_USER} from '../../mutation/index';

const Login = ({history}) => {
  // Limpio el local storage en caso de que tiviera algun residuo
  localStorage.clear();

  // State del componente
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState('');

  // Mutattion que permite al usuario autenticarse
  const [authUser] = useMutation(AUTH_USER);

  // Funcionn que maneja el inicio de sesion a la aplicación
  const handleLogin = async () =>{

    // En caso de que los campos esten vacio, muestro una alarta
    if(email==='' || password===''){
      setShowAlert(true);
      setAlertText('Por favor rellene los campos');
      setTimeout(() => {
        setShowAlert(false);
        setAlertText('')
      }, 3000);
    }
    else{
      // En caso de que todo este correcto, relleno el objeto
      const input = {
        email,
        password
      };
      
      try {
        // Trato de iniciar sesion
        const sesion = await authUser({variables:{input}});
        
        // En caso de que el usuario sea de tipo normal, lo redirijo a la tienda, ademas de rellenar el localstorage.
        if(sesion.data.authUser.id && sesion.data.authUser.type === 'Normal'){
          history.push(`/home`);
          localStorage.setItem('id', sesion.data.authUser.id);
          localStorage.setItem('name', sesion.data.authUser.name);
          localStorage.setItem('email', sesion.data.authUser.email);
          localStorage.setItem('type', sesion.data.authUser.type);
        }
        // En caso de que el usuario sea de tipo adminsitrador, lo redirijo parte administrativa de la aplicación, ademas de rellenar el localstorage.
        if(sesion.data.authUser.id && sesion.data.authUser.type === 'Admin'){
          history.push(`/admin`);
          localStorage.setItem('id', sesion.data.authUser.id);
          localStorage.setItem('name', sesion.data.authUser.name);
          localStorage.setItem('email', sesion.data.authUser.email);
          localStorage.setItem('type', sesion.data.authUser.type);
        }
      } catch (error) {

        // En caso de que suceda un error quiere decir que escribio la contraseña incorrecta
        setEmail('');
        setPassword('');
        setShowAlert(true);
        setAlertText('El correo electronico o la contraseña es incorrecta');
        setTimeout(() => {
          setShowAlert(false);
          setAlertText('')
        }, 3000);
      }
      
    }
  }

  // Creo los styles para Material-UI
  const style = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));

  // Inicializo los styles
  const styles = style();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={styles.paper}>
        <Typography component="h1" variant="h3">
          Iniciar Sesíon
        </Typography>
        <form className={styles.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="email"
            label="Correo Electronico"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e)=>{setEmail(e.target.value)}}
            autoFocus
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
            onChange={(e)=>{setPassword(e.target.value)}}
            autoComplete="current-password"
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            className={styles.submit}
            onClick={()=>handleLogin()}
          >
            Iniciar Sesión
          </Button>

          <Collapse in={showAlert}>
            <Alert severity="error">{alertText}</Alert>
            <br/>
          </Collapse>
          <Grid 
            container
            alignItems="center"
          >
            <Grid item>
              <Link to= "/registrar" variant="body2">
                ¿No tienes cuenta? Registrate
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

export default withRouter(Login);

