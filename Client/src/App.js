import React, {Component} from "react";
import { GridPage } from "./pages/GridPage.js"
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { DetailsPage } from "./pages/DetailsPage.js";
import { Navbar } from "./components/Navbar.js";
import { Error } from "./components/Error.js";

class App extends Component {
  render(){
    return (
      <BrowserRouter>  
        <Routes>
          <Route path="/" element={<Navbar />}>
            <Route index element={<Navigate replace to="top-headlines/US/general" />} />
            <Route path="top-headlines/" element={<Navigate replace to="US/general" />} />
            <Route path="top-headlines/:country" element={<GridPage />} />
            <Route path="top-headlines/:country/:category" element={<GridPage />} />
            <Route path="article/:newsID" element={<DetailsPage />} />
            <Route path="article/:country/:newsID" element={<DetailsPage />} />
            <Route path="article/:country/:category/:newsID" element={<DetailsPage />} />
            <Route path="saved" element={<GridPage saved={true} />} />
            <Route path="saved/article" element={<Navigate replace to="saved" />} />
            <Route path="saved/article/:newsID" element={<DetailsPage />} />
            <Route path="*" element={<div><Error errorText={"Path not found."} errorIcon={"fa-solid fa-circle-question"} /></div>} />
          </Route>
        </Routes>
      </BrowserRouter>
      
          
        
      
    );
  }
}

export default App;
