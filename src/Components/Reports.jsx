import React, {useState , useEffect} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import swal from 'sweetalert';


function Reports() {

const url = "https://localhost:44374/api/cupboard/expire";
const [expired, setExpired]= useState([]);
const [expire5, setExpire5]= useState([]);

let user = JSON.parse(sessionStorage.getItem('token'));
const token = user;

const getRequest = async () =>{
   await axios.get(url, {headers:{'Authorization': 'Bearer '+ token}})
   .then(response =>{
      setExpired(response.data.expired.$values);
      setExpire5(response.data.expire5Days.$values)
      console.log(response.data.expired)
      console.log(response.data.expire5Days);
   }).catch(error => {
      console.log(error);
   })
}
   
useEffect(()=>{
   getRequest()
},[])


const Authorization=()=>{
   swal({
      title:"Unauthorized",
      text: "please register and start section",
      icon:"error",
      button: "Details",
   }).then(function() {
      window.location = "/";
  });
}



return (
   <div className="App">
      {user === null && Authorization()}
      <div className="container">
         <div className="row">
            <div className="col-md-6">
            <center><h3>EXPIRED PRODUCTS</h3></center>
      <table className="table table-bordered">
         <thead>
            <tr>
               <td>ID</td>
               <td>PRODUCT</td>
               <td>EXPIRE DATE</td>
               <td>QUANTITY</td>
            </tr>
         </thead>
         <tbody>
         {expired.map(expired =>(
               <tr key={expired.id}>
                  <td>{expired.id}</td>
                  <td>{expired.productId}</td>
                  <td style={{backgroundColor:"red"}}>{expired.expireDate}</td>
                  <td>{expired.quantity}</td>
               </tr>
            ))}
         </tbody>
      </table>
            </div>
            <div className="col-md-6">
               <center><h3>PRODUCTS EXPIRE IN 5 DAYS</h3></center>
               <table className="table table-bordered">
                  <thead>
                     <tr>
                        <td>ID</td>
                        <td>PRODUCT</td>
                        <td >EXPIRE DATE</td>
                        <td>QUANTITY</td>
                     </tr>
                  </thead>
                  <tbody>
                  {expire5.map(expire=>(
                        <tr key={expire.id}>
                           <td>{expire.id}</td>
                           <td>{expire.productId}</td>
                           <td style={{backgroundColor:"yellow"}}>{expire.expireDate}</td>
                           <td>{expire.quantity}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   </div>
   

);
}

export default Reports;