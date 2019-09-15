import React from "react";
import "./App.css";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import DailyViewPage from './pages/daily-view-page';
import  AddMealPage from "./pages/add-meal/add-meal.page";


function NavGrid(props) {
  const onaction = ()=>{
    console.log("History:  ", props.history)
    props.history.push('/events');
  }
  return (
    <article className="navGrid">
      <section onClick={onaction} className="events">
        <Link to="/events">A</Link>
      </section>
      <section className="grid-cell logs">B</section>

      <section className="grid-cell venues">C</section>

      <section className="grid-cell artists">E</section>

      <section className="grid-cell logs">E</section>
    </article>
  );
}

function App() {

  return (
    <Router className="content-container">
      <header className="App-header">
        <h4>Chow</h4>
      </header>
      <main>
        <Route path="/" exact component={NavGrid} />
        <Route path="/events" component={DailyViewPage} />
        <Route path="/create" component={AddMealPage}/>
      </main>
      <footer>
        <span>
          &copy; All rights reserved.{" "}
          <a href="https://peculia.xyz">peculia.xyz</a>
        </span>
      </footer>
    </Router>
  );
}

export default App;
