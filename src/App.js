import React from 'react';
import Categories from './Components/Categories';
import CupBoard from './Components/CupBoard';
import Home from './Components/Home';
import Products from './Components/Products';
import Status from './Components/Status';
import Reports from './Components/Reports';

import { BrowserRouter as Router, Routes, Route,  Link } from 'react-router-dom';


function App() {
    return(
       <Router>
          <div className="container mt-5">
        <div className="btn-group">
         <Link to="/" className="btn btn-dark">
           Home
         </Link>
         <Link to="/Categories" className="btn btn-dark">
           Categories
         </Link>
         <Link to="/Products" className="btn btn-dark">
           Products
         </Link>
         <Link to="/CupBoard" className="btn btn-dark">
           CupBoard
         </Link>
         <Link to="/Status" className="btn btn-dark">
           Status
         </Link>
         <Link to="/Reports" className="btn btn-dark">
           Reports
         </Link>
        </div>
         <hr />
        
        <Routes>
        <Route path="/Categories" element={<Categories />} />
        <Route path="/Products" element={<Products />} />
        <Route path="/CupBoard" element={<CupBoard />} />
        <Route path="/Status" element={<Status />} />
        <Route path="/Reports" element={<Reports />} />
        <Route exact path="/" element={<Home />} />
        </Routes>
        
        </div>
       </Router>
     
    );
}

export default App;