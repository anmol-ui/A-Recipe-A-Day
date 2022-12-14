import React,{useRef,useState} from "react";
import Subscribed from "./Subscribed";
import Axios from "axios";
import { useEffect } from 'react';
import EmailService from "./email.jsx";
import EmailConfirm from "./sendConfirmation.jsx";
import Confirm from "./Confirm";

function FormComp() {
  const name = useRef(null);
  const email = useRef(null);
  const [isSubscribed,setSubscribed] = useState("false");
  const [isConfirm,setConfirm] = useState("false");
  const [personDetails,setPersonDetails] = useState({
    pname: "",
    pemail: ""
  }); 

  const MINUTE_MS = 10000;

  // useEffect(() => {
  //   // This will fire only on mount.
  //   const interval = setInterval(() => {
  //     //getting data from backend using axios
  //   Axios.get("http://localhost:3001/database/get").then((response)=>{
  //     for(let i=0;i<response.data.length;i++){
  //       EmailService.sendEmail(response.data[i].name,response.data[i].emailID);
  //       console.log(response.data[i].name,response.data[i].emailID);
  //     }
  //   });
  //   }, MINUTE_MS);
  
  //   return () => clearInterval(interval);
  // }, [])

  function confirmEmail(event){ //function to handle the get click event of get subscription button
    setConfirm("true");
    event.preventDefault();
    setPersonDetails({pname:name.current.value,pemail:email.current.value});
    // EmailConfirm.sendEmail(name.current.value,email.current.value);
    EmailService.sendEmail(name.current.value,email.current.value);
  }

  return (
    <>
    <div>
    {isConfirm === "true" ? <Confirm /> /*<Subscribed n={personDetails.pname} e={personDetails.pemail} />*/:
    <form onSubmit={confirmEmail}>
      <div style={{display:"block"}}>
        <label style={{marginRight:"4px"}} for="name">Name: </label>
        <input ref={name} type="text" id="name" name="name" size="30" required />
      </div>
      <div style={{display:"block",margin:"0.3rem 0"}}>
        <label style={{marginRight:"9px"}} for="email">Email:  </label>
        <input ref={email} type="email" id="email" name="email" size="30" required />
      </div>
      <button style={{marginLeft:"2.1rem",width:"16rem"}} className="form-submit-button" type="submit" size="50">Get A Free Subscription</button>
    </form>
    }
    </div>
    </>
  );
}

export default FormComp;

