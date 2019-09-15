import React, { useState, useEffect } from "react";
import "./daily-view-page.css";
import GroupedListItem from "../../components/grouped-list-item/grouped-list-item";
import TestItemsList, { periods } from "../../testdata/seed";


const getMealsForPeriod = ({repository, period}) => {
  const dayNum = new Date().getDay() == 0? 7: new Date().getDay();
  return repository.filter(item => {
    return item.day === dayNum && item.period === period;
  });
}

const DailyViewPage = props => {
  const db_mock = TestItemsList;
  const [hasErrors, setHasErros] = useState(false);
  const [mealOptions, setMealOptions] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("mealOptionsList") === null) {
      fetch("https://chow-api.azurewebsites.net/api/chow-options/all")
        .then(res => res.json())
        .then(res => {
          setMealOptions(res);
          localStorage.setItem("mealOptionsList", JSON.stringify(res));
          console.log("Results retrned from a api: ", res);
        })
        .catch(() => setHasErros({ hasErrors: true }));
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

  return (
    <>
      <header className="page-header">
        <section>
          <h1>Today</h1>
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
        <GroupedListItem mealOptions={breakfastMeals} period="1"/>
        <GroupedListItem mealOptions={brunchMeals} period="2"/>
        <GroupedListItem mealOptions={lunchMeals} period="3"/>
        <GroupedListItem mealOptions={afternoonSnackMeals} period="4"/>
        <GroupedListItem mealOptions={supperMeals} period="5"/>
        <GroupedListItem mealOptions={eveningSnackMeals} period="6"/>
      </article>
      <footer>
        <button className="action-btn" onClick={viewAddPage}>Add new</button>
      </footer>
    </>
  );
};

export default DailyViewPage;
