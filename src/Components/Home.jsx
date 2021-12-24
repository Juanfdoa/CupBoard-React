import React, {useState , useEffect} from 'react';
import products from '../assets/img/products.jpg';
import alert from '../assets/img/alert.png';
import expire from '../assets/img/expire_products.jpg'
import axios from 'axios';



function Home() {

   const [cupBoard, setCupBoard]= useState([]);
   const [expired, setExpired]= useState([]);
   const [expire5, setExpire5]= useState([]);

   let user1 = JSON.parse(sessionStorage.getItem('token'));
   const token = user1;

   const getRequest = async () =>{
      await axios.get("https://localhost:44374/api/cupboard", {headers:{'Authorization': 'Bearer '+ token}})
      .then(response =>{
         setCupBoard(response.data.$values);
         console.log(response.data.$values)
      }).catch(error => {
         console.log(error);
      })
   }
   
   const getExpired = async () =>{
      await axios.get("https://localhost:44374/api/cupboard/expire", {headers:{'Authorization': 'Bearer '+ token}})
      .then(response =>{
         setExpired(response.data.expired.$values);
         setExpire5(response.data.expire5Days.$values);
         console.log(response.data.expired.$values);
         console.log(response.data.expire5Days.$values);
      }).catch(error => {
         console.log(error);
      })
   }
    
   useEffect(()=>{
       getRequest()
       getExpired()
   },[])



   return(
      <div className="App">
         <br /><br /><br /><br /><br />
         <div className="container">
            <div className="row">
               <div className="col-md-4">
                  <div classname="card" styled="width: 10rem">
                     <img src={products} classname="card-img-top" width="400" height="300" />
                     <div classname="card-body">
                        <center><h3 classname="card-title">Products on Cupboard</h3></center>
                        <center><h2>{cupBoard.length}</h2></center>
                        <center><a href="/CupBoard" class="btn btn-primary">Details</a></center>
                     </div>
                  </div>
               </div>
               <div className="col-md-4">
                  <div classname="card" styled="width: 18rem">
                     <img src={alert} classname="card-img-top" width="400" height="300"/>
                     <div classname="card-body">
                        <center><h3 classname="card-title">products about to expire </h3></center>
                        <center><h2>{expire5.length}</h2></center>
                        <center><a href="/Reports" class="btn btn-primary">Details</a></center>
                     </div>
                  </div>
               </div>
               <div className="col-md-4">
                  <div classname="card" styled="width: 18rem">
                     <img src={expire} classname="card-img-top" width="400" height="300" />
                     <div classname="card-body">
                        <center><h3 classname="card-title">Products expired</h3></center>
                        <center><h2>{expired.length}</h2></center>
                        <center><a href="/Reports" class="btn btn-primary">Details</a></center>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
   
}

export default Home;