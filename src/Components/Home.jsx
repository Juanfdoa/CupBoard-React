import React, {useState , useEffect} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import swal from 'sweetalert';
import LoginService from "../Services/Login";

function Home() {

const [cupBoard, setCupBoard]= useState([]);
const [expired, setExpired]= useState([]);
const [expire5, setExpire5]= useState([]);

const [data, setData]= useState([]);
const [modalRegister, setModalRegister]=useState(false);
const [userSelected, setUserSelected]= useState({
   email:'',
   password:''
})

const [email, setEmail]= useState('');
const [password, setPassword]= useState('');
const [user, setUser]= useState(null);

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


const handleChange=e=>{
   const{name , value}=e.target;
   setUserSelected({
      ...userSelected,
      [name]: value
   });
   console.log(userSelected);
}

const openCloseModalRegister= ()=>{
   setModalRegister(!modalRegister)
}

const postRequest = async () =>{
   await axios.post("https://localhost:44374/api/cuentas/registrar", userSelected)
   .then(response =>{
      setData(data.concat(response.data));
      console.log(response.data.$values);
      swal({
         text:"your registration was successful",
         icon:"success",
         button:"Accept",
         timer: 4000
      });
      openCloseModalRegister();
   }).catch(error => {
      console.log(error);
   })
}



const products=()=>{
   var total = cupBoard.length;
   swal({
      title:"CupBoard",
      text: "Quantity of products: " + total,
      icon:"success",
      button: "Details",
   }).then(function() {
      window.location = "/CupBoard";
  });
}

const expiredProducts=()=>{
   var total = expired.length;
   swal({
      title:"CupBoard",
      text: "Expired products: " + total,
      icon:"error",
      button: "Details",
   }).then(function() {
      window.location = "/Reports";
  });
}

const expire5Days=()=>{
   var total = expire5.length;
   swal({
      title:"CupBoard",
      text: "Products expire in 5 days: " + total,
      icon:"warning",
      button: "Details",
   }).then(function() {
      window.location = "/Reports";
  });
}

const handleLogin= async (event)=>{
   event.preventDefault()
  try {
   const user = LoginService.login({
       email,
       password
   })

   sessionStorage.setItem('token',JSON.stringify((await user).data.token))

   setUser(user)
   setEmail('')
   setPassword('')
   swal({
      text:"Welcome",
      icon:"success",
      button:"Accept",
      timer: 4000
   }).then(function() {
      window.location = "/products";
   });

   console.log(user)
  } catch (error) {
      console.log(error);
  }
}

return (
   <div className="App">
      <div className="container">
         <div className="row">
            <div className="col-md-6">
               <div>
               <button className="btn btn-success" onClick={()=>products()}>Existing products on the cupboard</button><br /><br />
               <button className="btn btn-warning" onClick={()=>expire5Days()}>5 days to expire</button><br /><br />
               <button className="btn btn-danger" onClick={()=>expiredProducts()}>Expired Products</button>
               </div>

            </div>

            <div className="col-md-6">
               <div>
                  <div className="form-group mt-5">
                     <form onSubmit={handleLogin}>
                     <input type="email" value={email} name="email" onChange={({target})=> setEmail(target.value)} placeholder="Email" className="form-control" />
                     <br />
                     <input type="password" value={password} name="password" onChange={({target})=> setPassword(target.value)} placeholder="Password" className="form-control"/>
                     <br />
                     <center><button className="btn btn-primary" >Log in</button></center>
                     </form>
                  </div>    
               </div>
               <hr />
               <center><button className="btn btn-success" onClick={()=>openCloseModalRegister()}>Create new account</button></center>
               <Modal isOpen={modalRegister}>
                  <ModalBody>
                  <h2>Sign up</h2>
                  <div className="form-group">
                     <label>Email</label>
                     <br />
                     <input type="email" className="form-control" name="email" onChange={handleChange}/>
                     <br />
                     <label>password</label>
                     <br />
                     <input type="password" className="form-control" name="password" onChange={handleChange}/>
                  </div> 
                  </ModalBody>
                  <ModalFooter>
                  <button className="btn btn-success" onClick={()=>postRequest()}>Sign up</button>
                  <button className="btn btn-danger" onClick={()=>openCloseModalRegister()}>Cancel</button>
                  </ModalFooter>
               </Modal>
            </div>
         </div>
      </div>
   </div>
)
}

export default Home;