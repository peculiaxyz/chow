import React, {useState} from "react";
import './grouped-list-item.css';

const GroupedListItem = ({mealOptions}) => {

  const mealsList = mealOptions? mealOptions:[];
  const [mealOptionIdx, setMealOptionIdx] = useState(0);
  const defaultMeal = mealsList? mealsList[0]: {};
  const [visibleMealOption, setVisibleMealOption] = useState(defaultMeal);

  const viewNextOption = () =>{
    let newIdx = mealOptionIdx + 1;
    if(newIdx >= mealOptions.length){
      newIdx = 0;
    }

    setMealOptionIdx(newIdx);
    setVisibleMealOption(mealsList[mealOptionIdx]);
  };

  return (
    <div className="content-wrapper">
      <section className="list-item">
        <div className="list-item-bullet">
          <i className="fa fa-circle"></i>
        </div>

        <div className="list-item-content">
        { visibleMealOption? visibleMealOption.shortName:'' }
        <ul className="descrList">
          <li>{ visibleMealOption? visibleMealOption.description:'' }</li>
        </ul>
        </div>
        <div className="list-item-action-btn" onClick={viewNextOption}>
          <i className="fa fa-chevron-right"></i>
        </div>
      </section>
    </div>
  );
};

export default GroupedListItem;
