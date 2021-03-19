import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import DailyViewPage from "./pages/daily-view-page/daily-view-page";
import AddMealPage from "./pages/add-meal/add-meal.page";
import MealDetailsPage from './pages/view-meal-details/meal-details.page';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { AppSettings } from './shared/shared';

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

function App() {
  const classes = useStyles();

  return (
    <>
      <AppBar className={classes.root} position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h5" className={classes.title}>
            {AppSettings.Apptitle}
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Router className="content-container">
        <main>
          <Switch>
            <Route path="/" exact component={DailyViewPage} />
            <Route path="/create" exact component={AddMealPage} />
            <Route path="/details/:id" exact component={MealDetailsPage} />
          </Switch>
        </main>
        {/* <footer>
        <span>
          &copy; All rights reserved.{" "}
          <a href="https://peculia.xyz">peculia.xyz</a>
        </span>
      </footer> */}
      </Router>
    </>
  );
}

export default App;
