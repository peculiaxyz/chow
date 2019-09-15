import React, {useState, useEffect} from "react";
import "./daily-view-page.css";
import GroupedListItem from "./../components/grouped-list-item/grouped-list-item";
import TestItemsList,{periods} from './../testdata/seed';

const DailyViewPage = (props) => {
  const db_mock = TestItemsList;  // Todo: UseEffect()
  const [hasErrors, setHasErros] = useState(false);
  const [mealOptions, setMealOptions] = useState([]);
  useEffect( ()=> {
    fetch("https://chow-api.azurewebsites.net/api/chow-options/all")
    .then(res => res.json())
    .then(res => {
      setMealOptions(res);
      console.log("Results retrned from a api: ", mealOptions);
    })
    .catch(() => setHasErros({ hasErrors: true }));
  },
  []);

  const currentDateTime = new Date();
  const dayNum = currentDateTime.getDay();

  const group_1 = db_mock.filter( item => {
    return item.day === dayNum && item.period === periods.morning;
  });

  const group_2 = db_mock.filter( item => {
    return item.day === dayNum && item.period === periods.brunch;
  });

  const group_3 = db_mock.filter( item => {
    return item.day === dayNum && item.period === periods.afternoon;
  });

  const group_4 = db_mock.filter( item => {
    return item.day === dayNum && item.period === periods.lateAfternoon;
  });

  const viewAddPage = ()=>{
    props.history.push('/create');
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
        <GroupedListItem mealOptions={group_1}/>
        <GroupedListItem mealOptions={group_1}/>
        <GroupedListItem mealOptions={group_1}/>
        <GroupedListItem mealOptions={group_1}/>
      </article>
      <footer>
        <button onClick={viewAddPage}>Add new</button>
      </footer>
    </>
  );
};

export default DailyViewPage;
