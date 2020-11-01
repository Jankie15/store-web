import React, {useState} from 'react';
import { useMutation } from '@apollo/client';
import { withRouter, Link } from "react-router-dom";

// Interfaz
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';

// Mutations
import {AUTH_USER} from '../../mutation/index';



const Login = ({history}) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [authUser] = useMutation(AUTH_USER);

  const handleLogin = async () =>{
    if(email==='' || password===''){
      setShowAlert(true);
      setAlertText('Por favor rellene los campos');
      setTimeout(() => {
        setShowAlert(false);
        setAlertText('')
      }, 3000);
    }
    else{
      const input = {
        email,
        password
      };
      
      try {
        const sesion = await authUser({variables:{input}});
        
        console.log(sesion);
        if(sesion.data.authUser.id){
          localStorage.clear();
          history.push(`/home`);
          localStorage.setItem('id', sesion.data.authUser.id);
          localStorage.setItem('name', sesion.data.authUser.name);
          localStorage.setItem('email', sesion.data.authUser.email);
        }
      } catch (error) {
        setShowAlert(true);
        setAlertText('El correo electronico o la contraseña es incorrecta');
        setTimeout(() => {
          setShowAlert(false);
          setAlertText('')
        }, 3000);
      }
      setEmail('');
      setPassword('');
    }
  }

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

