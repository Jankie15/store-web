import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { withRouter, Link } from 'react-router-dom';

// Interfaz
import {AppBar, Card, CardActions, CardContent, CssBaseline, Toolbar, Typography, CardMedia, makeStyles, Container, Box, GridList, IconButton, Badge} from '@material-ui/core/';

// Otros importes
import ShoppingCartRounded from '@material-ui/icons/ShoppingCartRounded';
import SimpleDialog from './carrShoping';
import { GET_PRODUCTS } from '../../query/index';

// Styles de Material UI
const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
}));

const Home = ({history}) => {
  
  // Inicializo los styles de Material
  const classes = useStyles();

  // State del componente
  const [products, setProducts] = useState([{}]);
  const [productsCout, setproductsCout] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState();

  // Query para  obtener los productos
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  // Función de seguridad para verificar que esta parte de la aplicación solo sea accesible por usuarios autenticados
  useEffect(() => {
    if(localStorage.getItem('type') !== 'Normal'){
        history.push('/');
    }
  });

  // Añadir prodcutos al carrito
  const addProductToCarr = (value) => {
    setProducts(products=> [...products,{value}]);
    setproductsCout(productsCout + 1);
  }

  // Abrir la ventana emergente del carrito
  const handleClickOpen = () => {
    setOpen(true);
  };
  // Cerrar la ventana emergente del carrito
  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);  
  };

  // Funcion para cerrar sesión
  const logout = () =>{
    history.push(`/`);
    localStorage.clear();
  }

  // Si hay un error o esta cargando
  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;
  return (
    <>
      <CssBaseline />
      <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
            H O R I Z O N
          </Typography>
          <nav>
            <IconButton aria-label="Carrito" color="inherit" onClick={handleClickOpen}>
              <Badge badgeContent= {productsCout} color="secondary">
                <ShoppingCartRounded />
              </Badge>
            </IconButton>
            <Link to= "/orders" className="btn btn-dark mr-4 ml-3">
              Ordenes
            </Link>
            <button className="btn btn-info" onClick={()=>logout()}>
              Cerrar Sesión
            </button>
          </nav>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" component="main" className={classes.heroContent}>
        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
          Productos
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" component="p">
          Bienvenido a nuestra tienda H O R I Z O N.
        </Typography>
      </Container>

      <Container maxWidth="md" component="main">
        <GridList cellHeight={"auto"} className={classes.gridList} cols={3} spacing={20}>
          {data.getProducts.map((pro) => (
            <Card className={classes.root}>

              <CardMedia
                className={classes.media}
                title="Producto"
                component="img"
                height="auto"
                image={pro.photo}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {pro.name}
                </Typography>
              </CardContent>

              <CardActions disableSpacing >
                <IconButton aria-label="Agregar al carrito" onClick={() => addProductToCarr(pro)}>
                  <ShoppingCartRounded fontSize='large' />
                </IconButton>
                <Typography gutterBottom variant="h6" component="h2">
                  {pro.value}  Colones
                </Typography>

              </CardActions>
            </Card>
          ))}
        </GridList>
      </Container>
      <SimpleDialog selectedValue={selectedValue} open={open} carItems={products} onClose={handleClose} />
      <Container maxWidth="md" component="footer" className={classes.footer}>
        <Box mt={5}>
          <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <a>
              H O R I Z O N
            </a>{' '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        </Box>
      </Container>
    </>
  );
}

export default withRouter(Home);