import React, { useState } from "react";
import SimpleBackBtn from './../../components/back-btn';
import "./add-meal.page.css";

const postDataToRemoteServer = async ({ data }) => {
  const postOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  };
  return fetch("https://chow-api.azurewebsites.net/api/chow-options", postOptions)
    .then(response => response.json())
    .then(res => res)
    .catch(err => {
      throw err;
    });
};

function AddMealPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formErrs, setFormErrs] = useState("");

  const [mealName, setMealName] = useState("");
  const [mealDescr, setMealDescr] = useState("");
  const [period, setPeriod] = useState(1);
  const [dayNum, setDayNum] = useState(1);

  const handleMealNameChange = event => setMealName(event.target.value);
  const handleMealDescrChange = event => setMealDescr(event.target.value);
  const handlePeriodChange = event => setPeriod(event.target.value);
  const handleDayNumChange = event => setDayNum(event.target.value);

  const resetForm = () => {
    setIsLoading(false);
    setFormErrs("");
    setMealName("");
    setMealDescr("");
    setPeriod(1);
    setDayNum(1);
  };

  const submitNewMealOption = async event => {
    event.preventDefault();
    const formVal = {
      id: "",
      uniqueIdentifier: "tty",
      shortName: mealName,
      description: mealDescr,
      period: Number(period),
      day: Number(dayNum)
    };

    setIsLoading(true);
    try {
      const res = await postDataToRemoteServer({ data: formVal });
    } catch (error) {
      console.error("Error submitting your form: ", error);
    } finally {
      resetForm();
    }
  };
  return (
    <>
      <header>
        <h2>Add a new meal</h2>
      </header>
      <form onSubmit={submitNewMealOption}>
        <section className="form-group">
          <label htmlFor="mealName">Meal Name</label>
          <input
            type="text"
            value={mealName}
            maxLength="100"
            onChange={handleMealNameChange}
            name="mealName"
            id="mealName"
            className="chow-text-input"
            placeholder="e.g. Protein shake"
          />
        </section>

        <section className="form-group">
          <label htmlFor="mealDescr">Description</label>
          <textarea
            rows="6"
            value={mealDescr}
            onChange={handleMealDescrChange}
            name="mealDescr"
            id="mealDescr"
            className="chow-text-area"
            placeholder="e.g. 150g herbal shake with semi-skimmed milk"
          />
        </section>

        <section className="form-group">
          <label htmlFor="dayNum">Day number</label>
          <input
            type="number"
            value={dayNum}
            onChange={handleDayNumChange}
            min="1"
            max="7"
            name="dayNum"
            id="dayNum"
            className="chow-text-input"
            placeholder="e.g. 1 - Monday, 2 -Tuesday etc."
          />
        </section>

        <section className="form-group">
          <label htmlFor="period">Period</label>
          <input
            type="number"
            value={period}
            onChange={handlePeriodChange}
            min="1"
            max="6"
            name="period"
            id="period"
            className="chow-text-input"
            placeholder="e.g. 1 - Breakfast, 2 -Lunch etc."
          />
        </section>

        <section className="action-btns">
          <button className="chow-btn">Save</button>
          <SimpleBackBtn/>
        </section>
      </form>
    </>
  );
}

export default AddMealPage;
