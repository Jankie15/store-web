import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import GridList from '@material-ui/core/GridList';
import { CardMedia } from '@material-ui/core';
import ShoppingCartRounded from '@material-ui/icons/ShoppingCartRounded';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import SimpleDialog from './carrShoping';

import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../../query/index';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        H O R I Z O N
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
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
const footers = [
  {
    title: 'Company',
    description: ['Team', 'History', 'Contact us', 'Locations'],
  },
  {
    title: 'Features',
    description: ['Cool stuff', 'Random feature', 'Team feature', 'Developer stuff', 'Another one'],
  },
  {
    title: 'Resources',
    description: ['Resource', 'Resource name', 'Another resource', 'Final resource'],
  },
  {
    title: 'Legal',
    description: ['Privacy policy', 'Terms of use'],
  },
];

const Home = () => {

  const classes = useStyles();

  const [products, setProducts] = useState([{}]);
  const [productsCout, setproductsCout] = useState(0);

  const emails = ['username@gmail.com', 'user02@gmail.com'];

  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(emails[1]);
////////////////////////////////////////////////////////////////////////
//Carrito
////////////////////////////////////////////////////////////////////////
  const addProductToCarr = (value) => {
    
    setProducts(products=> [...products,{value}]);
    setproductsCout(productsCout + 1);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
  const { loading, error, data } = useQuery(GET_PRODUCTS);
  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;
  //console.log(products[1].value.name);
  return (

    <React.Fragment>
      <CssBaseline />

      <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
            H O R I Z O N
          </Typography>
          <nav>
            <Link variant="button" color="textPrimary" href="#" className={classes.link}>
              INICIO
            </Link>
            <Link variant="button" color="textPrimary" href="#" className={classes.link}>
              PERFIL
            </Link>
            <Link variant="button" color="textPrimary" href="#" className={classes.link}>
              ORDENES
            </Link>
          </nav>

          <IconButton aria-label="Carrito" color="inherit" onClick={handleClickOpen}>
            <Badge badgeContent= {productsCout} color="secondary">
              <ShoppingCartRounded />
            </Badge>
          </IconButton>
          <SimpleDialog selectedValue={selectedValue} open={open} carItems={products} onClose={handleClose} />

        </Toolbar>
      </AppBar>

      {/* Hero unit */}
      <Container maxWidth="sm" component="main" className={classes.heroContent}>
        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
          Productos
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" component="p">
          Bienvenido a nuestra tienda H O R I Z O N.
        </Typography>
      </Container>


      {/* End hero unit */}
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

      {/* Footer */}
      <Container maxWidth="md" component="footer" className={classes.footer}>
        <Grid container spacing={4} justify="space-evenly">
          {footers.map((footer) => (
            <Grid item xs={6} sm={3} key={footer.title}>
              <Typography variant="h6" color="textPrimary" gutterBottom>
                {footer.title}
              </Typography>
              <ul>
                {footer.description.map((item) => (
                  <li key={item}>
                    <Link href="#" variant="subtitle1" color="textSecondary">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </Grid>
          ))}
        </Grid>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>
      {/* End footer */}
    </React.Fragment>
  );
}

export default Home;