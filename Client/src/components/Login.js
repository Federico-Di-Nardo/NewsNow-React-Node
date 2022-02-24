import styles from "../styles/Login.module.css"
import OutsideClickHandler from 'react-outside-click-handler';
import { useEffect, useState } from "react";
import { serverCheckLogin, serverPost } from "../utils/httpClient";
import Popup from 'reactjs-popup';

export function Login({onLog, className}) {

  const cleanFormFields = () => {
    setUsername("");
    setPassword("");
    setRegUsername("");
    setRegPassword("");
    setLogInError("")
  }

  const logIn = async (prmUsername = username, prmPassword = password) => {
    const data = await serverPost("user", { operation: "03", name: prmUsername, password: prmPassword });
    if (data.errtyp === "S") {
      setIsLogged(true);
      console.log("LLEGA");
      setOpenModal((prevValue) => false);
      setLoggedUser((prevValue) => prmUsername);
      onLog();
      cleanFormFields();
    } else {
      setLogInError(data.errtxt);
    }
  }

  const signUp = () => {
    serverPost("user", {operation:"01", name:regUsername, password:regPassword})
    .then( (data) => {
      if(data.errcod === 0){
        return logIn(regUsername, regPassword);
      }
      else{
        setLogInError(data.errtxt);
      }
    })
  }
  
  const logOut = () => {
    serverPost("user", {operation:"05"})
    .then( (data) => {
      if(data.errtyp === "S"){
        setIsLogged(false);
        cleanFormFields();
        onLog();
      }
      return data;
    } );
  }

  const handleSubmit = () => {
    setLogInError("");
    if (register){
      signUp();
    }else{
      logIn()
    }
  }

  const handleKeypress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const [dropdownActive, setDropdownActive] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [logInError, setLogInError] = useState("");
  const [loggedUser, setLoggedUser] = useState("");
  const [register, setRegister] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    serverCheckLogin()
    .then( (data) => {
      setIsLogged(data);
      if(data !== false){
        setLoggedUser(data);
      }
    })
  }, []);

  // if user isn't logged, show log in button with log in/sign up modal
  if(!isLogged){
    return(
      <div className={className}>
        <Popup
          open={openModal}
          trigger={<h3 className={`navbarItem ${styles.logInNavButton}`}>Log in</h3>} modal>
          {close => (
            <div className="modal">
              <button className="close" onClick={close}>
                &times;
              </button>
              <div className="header">{register ? "Sign up" : "Log in"}</div>
              <div className="content">
                <div className={ logInError !== "" ? "modal-error" : "hidden"}>{logInError}</div>
                <form className={`${styles.modalForm} ${register ? "" : "hidden"}`}>
                  <input value={regUsername} onChange={(e)=>setRegUsername(e.target.value)} onKeyPress={handleKeypress} type="text" placeholder="New username..." />
                  <input value={regPassword} onChange={(e)=>setRegPassword(e.target.value)} onKeyPress={handleKeypress} type="password" placeholder="New password..." />
                </form>
                <form className={`${styles.modalForm} ${register ? "hidden" : ""}`}>
                  <input value={username} onChange={(e)=>setUsername(e.target.value)} onKeyPress={handleKeypress} type="text" placeholder="Username..." />
                  <input value={password} onChange={(e)=>setPassword(e.target.value)} onKeyPress={handleKeypress} type="password" placeholder="Password..." />
                </form>
                <a className={"link"}
                  onClick={(e) => { 
                    setRegister((prevValue) => !prevValue) 
                    cleanFormFields();
                  }}
                  >
                  {register ? "Already have an account? Log in" : "You don't have an account? Sign up"}</a>
              </div>
              <div className="actions">
                <button
                  className={styles.logInButton} onClick={() => handleSubmit()} >
                  {register ? "Sign up" : "Log in"}
                </button>
              </div>
            </div>
          )}
        </Popup>
      </div>
    )
  }

  //if user is logged, show dropdown with log out button
  return (
    <div className={`${styles.mainContainer} ${className}`}>
      <OutsideClickHandler
        onOutsideClick={() => { setDropdownActive(false); }}>
        <h3 
          className={`navbarItem ${styles.dropdown}`} 
          onClick={(e) => setDropdownActive(!dropdownActive)}
          >{loggedUser}
        </h3>
      </OutsideClickHandler>
      <div className={`${styles.dropdownMenu} ${dropdownActive ? "" : "hidden"}` }>
        <p className={`navbarItem ${styles.dropdownItem}`} onClick={ (e) => {logOut();} } >Log out</p>
      </div>
    </div>
  )
}
