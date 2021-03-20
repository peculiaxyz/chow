import React, { useState, useEffect } from "react";
import { LeftBackArrow } from './../../components/back-btn'
import { MealOptionModel } from './../../models/models'
import { AppSettings } from './../../shared/shared'
import "./meal-details.styles.css";
import LinearProgress from '@material-ui/core/LinearProgress';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function MealDetailsPage({ history, match }) {
  const [selectedMeal, setSelectedMeal] = useState();
  const [snackState, setSnackState] = useState({ isOpen: false, msg: "Success", timeout: 2000, severity: "info", lastRide: false });
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = () => {
    setShowModal(true);

    return;
  };

  const handleSnackClose = () => {
    setIsLoading(false);
    setSnackState({
      isOpen: false
    });
    if (snackState.lastRide) {
      history.push("/");
    }
  };

  const handleMealEdit = () => {
    console.debug("Edit page not implemented");
  };

  const loadSelectedMealInfo = () => {
    const cachedData = localStorage.getItem(match.params.id);
    if (cachedData) {
      const cachedMeal = JSON.parse(cachedData);
      console.debug(`Fetch meal by id ${match.params.id} returned from local cache`, cachedMeal);
      setSelectedMeal(cachedMeal);
      setIsLoading(false);
      return;
    }

    const fetchUrl = `${AppSettings.mealsAPI.baseURL}mealoptions/${match.params.id}`;
    fetch(fetchUrl)
      .then(res => res.json())
      .then(res => {
        console.debug(`Fetch meal by id ${match.params.id} returned`, res);
        setSelectedMeal(res);
        localStorage.setItem(match.params.id, JSON.stringify(res));
      })
      .catch((e) => {
        console.error(e);
      });
    setIsLoading(false);

  }

  const handleDeleteAccept = () => {
    setShowModal(false);
    setIsLoading(true);
    const cachedData = localStorage.getItem(match.params.id);
    if (cachedData) {
      localStorage.removeItem(match.params.id);
    }

    fetch(`${AppSettings.mealsAPI.baseURL}mealoptions?id=${selectedMeal.mealId}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(res => {
        setSnackState({
          isOpen: true,
          timeout: 700,
          lastRide: true,
          severity: "info",
          msg: "Meal successfully deleted"
        });
      })
      .catch(err => {
        setSnackState({
          isOpen: true,
          timeout: 1500,
          severity: "error",
          msg: err
        });
      });
  };

  const handleDeleteReject = () => {
    setShowModal(false);
  };

  useEffect(() => {
    loadSelectedMealInfo();
  }, []);


  return (
    <div className="container">
      <header>
        <LeftBackArrow className="back-arrow" />
        <h1>{selectedMeal?.name}</h1>
      </header>

      <section className="detailsBody">

      </section>


      <section className="action-btns">
        <button className="chow-btn-outline edit-btn" onClick={handleMealEdit}>
          Edit<i className="fa fa-edit btn-icon"></i>
        </button>
        <button className="chow-btn" onClick={handleDelete}>
          Delete<i className="fa fa-trash btn-icon"></i>
        </button>
      </section>
      <Dialog
        open={showModal}
        onClose={() => { }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm delete?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this meal?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteReject} color="primary">
            No, God Stop!
          </Button>
          <Button onClick={handleDeleteAccept} color="primary" autoFocus>
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackState.isOpen} autoHideDuration={snackState.timeout} onClose={handleSnackClose}>
        <Alert severity={snackState.severity}>
          {snackState.msg}
        </Alert>
      </Snackbar>
      {isLoading ? <LinearProgress color="secondary" /> : ""}

    </div>
  );
}

export default MealDetailsPage;
