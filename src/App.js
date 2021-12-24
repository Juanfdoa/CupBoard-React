import React,{useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import Categories from './Components/Categories';
import CupBoard from './Components/CupBoard';
import Home from './Components/Home';
import Products from './Components/Products';
import Status from './Components/Status';
import Reports from './Components/Reports';
import Login from './Components/Login';

import { BrowserRouter as Router, Routes, Route,  Link } from 'react-router-dom';


function App() {

  let user = JSON.parse(sessionStorage.getItem('token'));
  const token = user;

  return(
    <div className="App container-fluid">
      <Router>
        {user && 
        <div className="dropdown mt-3" >
          <button  className="btn btn-success dropdown-toggle " type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
            Menu
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1" >
            <li><a className="dropdown-item" href="/Home">Home</a></li>
            <li><a className="dropdown-item" href="/Categories">Categories</a></li>
            <li><a className="dropdown-item" href="/Products">Products</a></li>
            <li><a className="dropdown-item" href="/CupBoard">CupBoard</a></li>
            <li><a className="dropdown-item" href="/Status">Status</a></li>
            <li><a className="dropdown-item" href="/Reports">Reports</a></li>
          </ul>
        </div>
        
        }
        

        <Routes>
          <Route path="/Categories" element={<Categories />} />
          <Route path="/Products" element={<Products />} />
          <Route path="/CupBoard" element={<CupBoard />} />
          <Route path="/Status" element={<Status />} />
          <Route path="/Reports" element={<Reports />} />
          <Route path="/Home" element={<Home />} />
          <Route exact path="/" element={<Login />} />
        </Routes>
      </Router> 
   </div>
  );
}

export default App;