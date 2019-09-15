import React, {useState,useEffect} from "react";
import './grouped-list-item.css';

const GroupedListItem = ({mealOptions, period}) => {

  const [mealsList, setmealsList] = useState(mealOptions? mealOptions:[]);
  const [mealOptionIdx, setMealOptionIdx] = useState(0);
  const [visibleMealOption, setVisibleMealOption] = useState(mealsList[0]);

  const viewNextOption = () =>{
    let newIdx = mealOptionIdx + 1;
    if(newIdx >= mealOptions.length){
      newIdx = 0;
    }
    setMealOptionIdx(newIdx);
    setVisibleMealOption(mealsList[mealOptionIdx]);
  };

  useEffect(()=>{
    setVisibleMealOption(mealOptions[0]);
    setmealsList(mealOptions);
  }, [mealOptions])

  return (
    <div className="content-wrapper">
      <section className="list-item">
        <div className="list-item-bullet">
          {period}
          {/* <i className="fa fa-ellipsis-v"></i> */}
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
