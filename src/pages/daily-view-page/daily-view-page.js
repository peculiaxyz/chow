import React, { useState, useEffect } from "react";
import "./daily-view-page.css";
import GroupedListItem from "../../components/grouped-list-item/grouped-list-item";
import { periods, FakeMealOptions } from "../../data/seed";
import {AppSettings} from '../../shared/shared'


const getMealsForPeriod = ({repository, period}) => {
  const dayNum = new Date().getDay() == 0? 7: new Date().getDay();
  return repository.filter(item => {
    return item.day === dayNum && item.period === period;
  });
}

const DailyViewPage = props => {
  const [hasErrors, setHasErros] = useState(false);
  const [mealOptions, setMealOptions] = useState([]);
  const fetchUrl = `${AppSettings.mealsAPI.baseURL}/chow-options/all`;

  useEffect(() => {
    if (localStorage.getItem("mealOptionsList") === null) {
      setMealOptions(FakeMealOptions);
      // console.log(FakeMealOptions);

      try{
        fetch(fetchUrl)
        .then(res =>  {
          // if(res){
          //   return res.json();
          // }
        })
        .then(res => {
          // setMealOptions(res);
          // localStorage.setItem("mealOptionsList", JSON.stringify(res));
        })
        .catch((e) => {
          setHasErros({ hasErrors: true });
          console.error(e);
          // setMealOptions(FakeMealOptions);
        });
      }catch{
        console.warn("Server is unresponsive");
      }
      

    } else {
      const cachedData = localStorage.getItem("mealOptionsList");
      setMealOptions(JSON.parse(cachedData));
    }
  }, []);

  const currentDateTime = new Date();
  const breakfastMeals = getMealsForPeriod({repository: mealOptions, period: periods.breakfast});
  const brunchMeals = getMealsForPeriod({repository: mealOptions, period: periods.brunch});
  const lunchMeals = getMealsForPeriod({repository: mealOptions, period: periods.lunch});
  const afternoonSnackMeals = getMealsForPeriod({repository: mealOptions, period: periods.afternoonSnack});
  const supperMeals = getMealsForPeriod({repository: mealOptions, period: periods.supper});
  const eveningSnackMeals = getMealsForPeriod({repository: mealOptions, period: periods.eveningSnack});

  const viewAddPage = () => {
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
        <GroupedListItem mealOptions={breakfastMeals} period="1" viewItemDetails={gotoMealDetails}/>
        <GroupedListItem mealOptions={brunchMeals} period="2" viewItemDetails={gotoMealDetails}/>
        <GroupedListItem mealOptions={lunchMeals} period="3" viewItemDetails={gotoMealDetails}/>
        <GroupedListItem mealOptions={afternoonSnackMeals} period="4" viewItemDetails={gotoMealDetails}/>
        <GroupedListItem mealOptions={supperMeals} period="5" viewItemDetails={gotoMealDetails}/>
        <GroupedListItem mealOptions={eveningSnackMeals} period="6" viewItemDetails={gotoMealDetails}/>
      </article>
      <footer>
        <button className="action-btn chow-btn" onClick={viewAddPage}>Add new</button>
      </footer>
    </>
  );
};

export default DailyViewPage;
