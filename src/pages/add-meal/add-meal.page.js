import React, { useState } from "react";
import SimpleBackBtn from './../../components/back-btn'
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { AppSettings } from './../../shared/appsettings'
import "./add-meal.page.css";
import { MealOptionModel, mealCategory } from "../../models/models";



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


const postDataToRemoteServer = async ({ data }) => {
  const postOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  };
  console.debug(`Adding new meal to db`, postOptions.body);
  // return fetch(`${AppSettings.mealsAPI.baseURL}/mealoptions`, postOptions)
  //   .then(response => response.json())
  //   .then(res => res)
  //   .catch(err => {
  //     throw err;
  //   });
};

function AddMealPage() {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [formErrs, setFormErrs] = useState("");
  const [mealNameIsInvalid, setMealNameIsInvalid] = useState(false);

  const [mealName, setMealName] = useState("");
  const [mealDescr, setMealDescr] = useState("");
  const [mealCategory, setMealCategory] = useState("");
  const [estimatedMealcalories, setCalories] = useState(0);

  const handleMealNameChange = (event) => {
    const newVal = event.target.value;
    setMealName(newVal);
    setMealNameIsInvalid(false);

    if(newVal == null || newVal || undefined || newVal == "" || newVal.length < 3){
      setMealNameIsInvalid(true);
    }
  }
  const handleMealDescrChange = event=> setMealDescr(event.target.value);
  const handleCategoryChange = event => setMealCategory(event.target.value);
  const handleCalorieChange = event => setCalories(event.target.value);

  const resetForm = () => {
    setIsLoading(false);
    setFormErrs("");
    setMealName("");
    setMealDescr("");
    setMealCategory("");
    setCalories(0);
  };

  const submitNewMealOption = async event => {
    event.preventDefault();
    const formVal = new MealOptionModel({
      name: mealName,
      category: mealCategory,
      description: mealDescr,
      calories: estimatedMealcalories,
      thumbnailURL: AppSettings.DefaultThumbnailURL
    });

    setMealNameIsInvalid(true);

    setIsLoading(true);
    try {
      await postDataToRemoteServer({ data: formVal.toJson() });
      console.debug("New meal successfully added");
      resetForm();
    } catch (error) {
      console.error("Error adding new meal, please try again", error);
    } finally {
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
          {mealNameIsInvalid? <button disabled className="chow-btn-disabled">Save</button>: <button className="chow-btn">Save</button>}
          <SimpleBackBtn />
        </section>
      </form>
    </>
  );
}

export default AddMealPage;
