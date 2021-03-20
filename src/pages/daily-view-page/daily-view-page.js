import React, { useState, useEffect } from "react";
import { mealCategory } from "../../models/models";
import { AppSettings } from '../../shared/shared'
import { MealCard } from "./../../components/components";
import "./daily-view-page.css";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Avatar from '@material-ui/core/Avatar';
import defaultUserImg from './../../static/images/user-black.svg'
import TwitterIcon from '@material-ui/icons/Twitter';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    background: "indigo"
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));


const filterMealsByCategory = ({ allMealsList, category }) => {
  if (allMealsList) {
    let filtered = allMealsList.filter(item => item.category === category);
    return filtered;
  }
  return []
}

const DailyViewPage = props => {
  const classes = useStyles();
  const [hasErrors, setHasErros] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [mealOptions, setMealOptions] = useState([]);
  const fetchUrl = `${AppSettings.mealsAPI.baseURL}/mealoptions`;

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  }

  useEffect(() => {
    getUserInfo();
    if (localStorage.getItem("mealOptionsList") === null) {
      try {
        fetch(fetchUrl)
          .then(res => res.json())
          .then(res => {
            console.debug(`${res?.length} meal options returned from server`);
            setMealOptions(res);
            localStorage.setItem("mealOptionsList", JSON.stringify(res));
          })
          .catch((e) => {
            setHasErros({ hasErrors: true });
            console.error(e);
          });
      } catch {
        console.warn("Server is unresponsive");
      }

    } else {
      const cachedData = localStorage.getItem("mealOptionsList");
      const parseMeals = JSON.parse(cachedData)
      console.debug(`${parseMeals?.length} meal options returned from local storage cache`);
      setMealOptions(parseMeals);
    }
  }, []);

  const currentDateTime = new Date();
  const breakfastMeals = filterMealsByCategory({ allMealsList: mealOptions, category: mealCategory.breakfast });
  const brunchMeals = filterMealsByCategory({ allMealsList: mealOptions, category: mealCategory.brunch });
  const lunchMeals = filterMealsByCategory({ allMealsList: mealOptions, category: mealCategory.lunch });
  const afternoonSnackMeals = filterMealsByCategory({ allMealsList: mealOptions, category: mealCategory.afternoonSnack });
  const supperMeals = filterMealsByCategory({ allMealsList: mealOptions, category: mealCategory.supper });
  const eveningSnackMeals = filterMealsByCategory({ allMealsList: mealOptions, category: mealCategory.eveningSnack });

  async function getUserInfo() {
    const response = await fetch("/.auth/me");
    if (response?.status == 200 || response?.ok) {
      console.debug("User info retrieved!")
    } else {
      console.warn("auth.me returned", response);
      return;
    }
    const payload = await response.json();
    const { clientPrincipal } = payload;
    console.log("Client principal info: ", payload)
    setCurrentUser(clientPrincipal);
    return clientPrincipal;
  }

  const addNewMealPage = () => {
    props.history.push("/create");
  };

  const gotoMealDetails = async (params) => {
    props.history.push(`/details/${params.mealId}`);
  }

  const handleLogin = (e) => {
    // by deafult user will be redirected to home after login (i think...)
    if (currentUser) {
      setAnchorEl(e.currentTarget);
      return;
    }
    props.history.push('/login');
    window.location.reload();
    //
  }

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpenLeftMenu = (event) => {
    setDrawerOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    if(currentUser){
      props.history.push('logout');
      window.location.reload();
    }
  };

  return (
    <>
      <AppBar className={classes.root} position="static">
        <Toolbar>
          <IconButton onClick={handleOpenLeftMenu} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h5" className={classes.title}>
            {AppSettings.Apptitle}
          </Typography>
          {
            currentUser ? <Avatar onClick={handleLogin} alt={currentUser ? currentUser.userDetails : "User"} src={defaultUserImg} /> :
              <Button color="inherit" onClick={handleLogin}>{currentUser ? currentUser.userDetails : "Login"}</Button>
          }

        </Toolbar>
      </AppBar>

      <SwipeableDrawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        onOpen={()=>{}}
      >
        <List>
          {['Settings'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon><InboxIcon /></ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>

        <Divider />
      </SwipeableDrawer>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>{currentUser?.userDetails || "Guest" }</MenuItem>
        <MenuItem><TwitterIcon/></MenuItem> 
        <Divider />
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>

      <header className="page-header">
        <section>
          <h1>Daily meal plan</h1>
        </section>
        <section>
          <h1>
            <small>{currentDateTime.toDateString()}</small>
          </h1>
        </section>
      </header>
      <article className="content">
        <section className="section-divider">
          <hr />
        </section>
        <section className="cardSection">
          <MealCard mealOptions={breakfastMeals} viewMealDetailsHanlder={gotoMealDetails} />
        </section>

        <section className="cardSection">
          <MealCard mealOptions={brunchMeals} viewMealDetailsHanlder={gotoMealDetails} />
        </section>

        <section className="cardSection">
          <MealCard mealOptions={lunchMeals} viewMealDetailsHanlder={gotoMealDetails} />
        </section>

        <section className="cardSection">
          <MealCard mealOptions={afternoonSnackMeals} viewMealDetailsHanlder={gotoMealDetails} />
        </section>

        <section className="cardSection">
          <MealCard mealOptions={supperMeals} viewMealDetailsHanlder={gotoMealDetails} />
        </section>

        <section className="cardSection">
          <MealCard mealOptions={eveningSnackMeals} viewMealDetailsHanlder={gotoMealDetails} />
        </section>
      </article>
      <footer className="action-btn">
        <button className="action-btn chow-btn" onClick={addNewMealPage}>Add new</button>
      </footer>
    </>
  );
};

export default DailyViewPage;
