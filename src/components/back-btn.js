import React from "react";
import { Link } from "react-router-dom";

function SimpleBackBtn() {
  return (
    <>
      <button>
        <Link to="/">Back</Link>
      </button>
    </>
  );
}

export default SimpleBackBtn;
