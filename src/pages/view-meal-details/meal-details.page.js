import React from "react";
import { LeftBackArrow } from './../../components/back-btn'
import "./meal-details.styles.css";

function MealDetailsPage({ match }) {
  const handleDelete = () => {
    alert("Are you sure, this cant  be undone?");
  };

  const handleMealEdit = () => {
    alert("Edit page coming soon");
  };

  console.debug("Match prop in details page: ", match);
  return (
    <>
      <header>
        <LeftBackArrow className="back-arrow" />
        <h1>Meal details</h1>
      </header>


      <section className="action-btns">
        <button className="chow-btn-outline edit-btn" onClick={handleMealEdit}>
          Edit<i className="fa fa-edit btn-icon"></i>
        </button>
        <button className="chow-btn" onClick={handleDelete}>
          Delete<i className="fa fa-trash btn-icon"></i>
        </button>
      </section>
    </>
  );
}

export default MealDetailsPage;
