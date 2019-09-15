import React, { useState } from "react";
import "./add-meal.page.css";

function AddMealPage() {
  return (
      <>
      <header>
          <h2>Add new meal</h2>
      </header>
    <form>
      <section className="form-group">
        <label htmlFor="mealName">Meal Name</label>
        <input type="text" maxLength="100" name="mealName" id="mealName" placeholder="e.g. Protein shake" />
      </section>

      <section className="form-group">
        <label htmlFor="mealDescr">Description</label>
        <textarea rows="6" name="mealDescr" id="mealDescr" placeholder="e.g. 150g herbal shake with semi-skimmed milk" />
      </section>

      <section className="form-group">
        <label htmlFor="dayNum">Day number</label>
        <input type="number" min="1" max="7" name="dayNum" id="dayNum" placeholder="e.g. 1 - Monday, 2 -Tuesday etc." />
      </section>

      <section className="form-group">
        <label htmlFor="period">Period</label>
        <input type="number" min="1" max="4" name="period" id="period" placeholder="e.g. 1 - Breakfast, 2 -Lunch etc." />
      </section>

      <section className="form-group">
        <button>Save</button>
      </section>
    </form>
    </>
  );
}

export default AddMealPage;
