import React, { useState, useEffect } from "react";
import GroupedListItem from "../../components/grouped-list-item/grouped-list-item";
import { mealCategory } from "../../models/models";
import { AppSettings } from '../../shared/shared'
import { MealCard } from "./../../components/components";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import "./daily-view-page.css";


const filterMealsByCategory = ({ allMealsList, category }) => {
  if (allMealsList) {
    let filtered = allMealsList.filter(item => item.category === category);
    return filtered;
  }
  return []
}

const DailyViewPage = props => {
  const [hasErrors, setHasErros] = useState(false);
  const [mealOptions, setMealOptions] = useState([]);
  const fetchUrl = `${AppSettings.mealsAPI.baseURL}/mealoptions`;

  useEffect(() => {
    console.log(getUserInfo());
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
    const payload = await response.json();
    const { clientPrincipal } = payload;
    return clientPrincipal;
  }

  const addNewMealPage = () => {
    props.history.push("/create");
  };

  const gotoMealDetails = async (params) => {
    props.history.push(`/details/${params.mealId}`);
  }

  return (
    <>
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
