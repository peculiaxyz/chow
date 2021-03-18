import React, { useState, useEffect } from "react";
import GroupedListItem from "../../components/grouped-list-item/grouped-list-item";
import { mealCategory } from "../../models/models";
import {AppSettings} from '../../shared/shared'
import { MealCard } from "./../../components/components";
import "./daily-view-page.css";


const filterMealsByCategory = ({allMealsList, category}) => {
  console.debug("Filter", category, "meals")
  if(allMealsList){
    let filtered = allMealsList.filter(item => item.category === category);
    console.debug(filtered);
    return filtered;
  }
  return []
}

const DailyViewPage = props => {
  const [hasErrors, setHasErros] = useState(false);
  const [mealOptions, setMealOptions] = useState([]);
  const fetchUrl = `${AppSettings.mealsAPI.baseURL}/mealoptions`;

  useEffect(() => {
    if (localStorage.getItem("mealOptionsList") === null) {
      try{
        fetch(fetchUrl)
        .then(res =>  res.json())
        .then(res => {
          console.debug(`${res?.length} meal options returned from server`);
          setMealOptions(res);
          localStorage.setItem("mealOptionsList", JSON.stringify(res));
        })
        .catch((e) => {
          setHasErros({ hasErrors: true });
          console.error(e);
        });
      }catch{
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
  const breakfastMeals = filterMealsByCategory({allMealsList: mealOptions, category: mealCategory.lunch});// !!!
  const brunchMeals = filterMealsByCategory({allMealsList: mealOptions, category: mealCategory.brunch});
  const lunchMeals = filterMealsByCategory({allMealsList: mealOptions, category: mealCategory.lunch});
  const afternoonSnackMeals = filterMealsByCategory({allMealsList: mealOptions, category: mealCategory.afternoonSnack});
  const supperMeals = filterMealsByCategory({allMealsList: mealOptions, category: mealCategory.supper});
  const eveningSnackMeals = filterMealsByCategory({allMealsList: mealOptions, category: mealCategory.eveningSnack});

  const addNewMealPage = () => {
    props.history.push("/create");
  };

  const gotoMealDetails = (params) =>{
    props.history.push(`/details/${params.id}`);
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
      <article>
        <section className="section-divider">
          <hr />
        </section>
        <MealCard mealOptions={breakfastMeals} viewMealDetailsHanlder={gotoMealDetails} />
        <GroupedListItem mealOptions={breakfastMeals} period="1" viewItemDetails={gotoMealDetails}/>
        <GroupedListItem mealOptions={brunchMeals} period="2" viewItemDetails={gotoMealDetails}/>
        <GroupedListItem mealOptions={lunchMeals} period="3" viewItemDetails={gotoMealDetails}/>
        <GroupedListItem mealOptions={afternoonSnackMeals} period="4" viewItemDetails={gotoMealDetails}/>
        <GroupedListItem mealOptions={supperMeals} period="5" viewItemDetails={gotoMealDetails}/>
        <GroupedListItem mealOptions={eveningSnackMeals} period="6" viewItemDetails={gotoMealDetails}/>
      </article>
      <footer>
        <button className="action-btn chow-btn" onClick={addNewMealPage}>Add new</button>
      </footer>
    </>
  );
};

export default DailyViewPage;
