import React, { useState } from "react";
import SimpleBackBtn from './../../components/back-btn'
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import { AppSettings } from './../../shared/appsettings'
import "./add-meal.page.css";
import LinearProgress from '@material-ui/core/LinearProgress';
import { MealOptionModel, mealCategory } from "../../models/models";


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

const categoryOptions = [
  {
    value: mealCategory.breakfast,
    label: mealCategory.breakfast,
  },
  {
    value: mealCategory.brunch,
    label: mealCategory.brunch,
  },
  {
    value: mealCategory.lunch,
    label: mealCategory.lunch,
  },
  {
    value: mealCategory.afternoonSnack,
    label: mealCategory.afternoonSnack,
  },
  {
    value: mealCategory.supper,
    label: mealCategory.supper,
  },
  {
    value: mealCategory.eveningSnack,
    label: mealCategory.eveningSnack,
  }
];


const isNotNullOrEmpty = (strVal) => strVal !== null && strVal !== undefined && strVal !== "" && strVal.length > 3;


const postDataToRemoteServer = async ({ data }) => {
  const postOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  };
  return fetch(`${AppSettings.mealsAPI.baseURL}/mealoptions`, postOptions)
    .then(response => response.json())
    .then(res => res)
    .catch(err => {
      throw err;
    });
};

function AddMealPage(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [mealNameIsInvalid, setMealNameIsInvalid] = useState(false);

  const [mealName, setMealName] = useState("");
  const [mealDescr, setMealDescr] = useState("");
  const [mealCategory, setMealCategory] = useState(categoryOptions[0].value);
  const [estimatedMealcalories, setCalories] = useState(10);
  const [snackState, setSnackState] = useState({isOpen:false, msg: "Success", timeout: 2000, severity:"info", lastRide: false});
  let canIgo = false;


  const goHome = () => {
    if(snackState.lastRide){
      props.history.push("/");
    }
  };

  const handleMealNameChange = (event) => {
    const newVal = event.target.value;
    let isInValid = false;
    setMealName(newVal);


    if (newVal == null || newVal == undefined || newVal == "" || newVal.length < 3) {
      isInValid = true;
    }
    setMealNameIsInvalid(isInValid);
  }
  const handleMealDescrChange = event => setMealDescr(event.target.value);
  const handleCategoryChange = event => setMealCategory(event.target.value);
  const handleCalorieChange = event => setCalories(event.target.value);

  const resetForm = () => {
    setIsLoading(false);
    setMealName("");
    setMealDescr("");
    setMealCategory("");
    setCalories(0);
  };

  const validateForm = () => {
    return isNotNullOrEmpty(mealName) && isNotNullOrEmpty(mealCategory) && isNotNullOrEmpty(mealDescr) && estimatedMealcalories > 0;
  }

  const handleSnackClose = ()=> {
    setSnackState({
      isOpen: false
    });
    console.log("Can i go", canIgo);
    goHome();
  };

  const submitNewMealOption = async event => {
    event.preventDefault();
    console.log("Form valid", validateForm());
    if(!validateForm()){
      setSnackState({
        msg: "Form is invalid, please correct",
        isOpen: true,
        timeout: 2500,
        severity: "warning"
      });
      return;
    }
    const formVal = new MealOptionModel({
      name: mealName,
      category: mealCategory,
      description: mealDescr,
      calories: estimatedMealcalories,
      thumbnailURL: AppSettings.DefaultThumbnailURL
    });

    setIsLoading(true);
    try {
      await postDataToRemoteServer({ data: formVal.toJson() });
      canIgo = true;
      setSnackState({
        msg: "New meal successfully added",
        isOpen: true,
        timeout: 800,
        severity: "success",
        lastRide: true
      });
      resetForm();
    } catch (error) {
      setSnackState({
        msg: "Error adding new meal, please try again." + error,
        isOpen: true,
        timeout: 2000,
        severity: "success"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <header>
        <h2>Add a new meal</h2>
      </header>
      <form onSubmit={submitNewMealOption} style={{ backgroundColor: "transparent", padding: 0 }}>
        <TextField value={mealName}
          error={mealNameIsInvalid}
          helperText="Please enter a valid name"
          type="text"
          maxLength="250"
          placeholder="e.g. Avo Sandwich"
          onChange={handleMealNameChange}
          label="Name of the meal" />

        <TextField
          id="filled-select-currency-native"
          select
          label="Meal category"
          value={mealCategory}
          onChange={handleCategoryChange}
          InputLabelProps={{ shrink: true }}
          SelectProps={{
            native: true,
          }}
          helperText="Please select the meal category"
        >
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>

        <TextField
          id="meal-desc"
          label="Description"
          placeholder="e.g. 150g herbal shake with semi-skimmed milk"
          rowsMax={8}
          value={mealDescr}
          onChange={handleMealDescrChange}
          multiline
        />

        <TextField
          label="Estimated Calories"
          value={estimatedMealcalories}
          onChange={handleCalorieChange}
          type="number"
          InputLabelProps={{ shrink: true }}
        />

        <section className="action-btns">
          <button disabled={mealNameIsInvalid} className={mealNameIsInvalid ? "chow-btn-disabled" : "chow-btn"}>Save</button>
          {/* {mealNameIsInvalid? <button disabled className="chow-btn-disabled">Save</button>: <button className="chow-btn">Save</button>} */}
          <SimpleBackBtn />
        </section>
      </form>
      <Snackbar open={snackState.isOpen} autoHideDuration={snackState.timeout} onClose={handleSnackClose}>
        <Alert severity={snackState.severity}>
         {snackState.msg}
        </Alert>
      </Snackbar>
      {isLoading ? <LinearProgress color="secondary" /> : "" }
    </>
  );
}

export default AddMealPage;
