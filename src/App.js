import React from "react";
import "./App.css";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import DailyViewPage from './pages/daily-view-page';
import TestItemsList from './testdata/seed';

function A() {
  return (
    <React.Fragment>
      <h1>I am A</h1>
      <button>
        <Link to="/">Back</Link>
      </button>
    </React.Fragment>
  );
}

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
        <h4>BBD</h4>
      </header>
      <main>
        <Route path="/" exact component={NavGrid} />
        <Route path="/events" component={DailyViewPage} />
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
