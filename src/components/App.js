import React from "react";
import FormComp from "./FormComp";
import NavbarComp from "./NavbarComp";
import DescriptionComp from "./DescriptionComp";

const countOfSubscribers = 4000;

function App() {
  return (
    <div style={{textAlign:"center"}}>
      <NavbarComp />
      <p style={{margin:"4rem"}}>Get a free subscription -- nearly {countOfSubscribers} subscribers across various countries enjoy it.</p>
      <FormComp />
      <DescriptionComp />
      <img src={require('../images/NewYorkTimes.svg.png')} alt="new york times" width={"300"} />
    </div>
  );
}

export default App;
