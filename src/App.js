import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import DailyViewPage from "./pages/daily-view-page/daily-view-page";
import AddMealPage from "./pages/add-meal/add-meal.page";
import MealDetailsPage from './pages/view-meal-details/meal-details.page';

function App() {
  return (
    <Router className="content-container">
      <header className="App-header">
        <h4>Chow</h4>
      </header>
      <main>
        <Switch>
        <Route path="/" exact component={DailyViewPage} />
        <Route path="/create" component={AddMealPage} />
        <Route path="/details/:id" component={MealDetailsPage}/>
        </Switch>
      </main>
      {/* <footer>
        <span>
          &copy; All rights reserved.{" "}
          <a href="https://peculia.xyz">peculia.xyz</a>
        </span>
      </footer> */}
    </Router>
  );
}

export default App;
