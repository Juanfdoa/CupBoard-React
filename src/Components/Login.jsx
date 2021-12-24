import React, {useState , useEffect} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import swal from 'sweetalert';
import LoginService from "../Services/Login";
import canasta from '../assets/img/canasta.jpg'

function Login() {
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
      window.location = "/Home";
   });

   console.log(user)
  } catch (error) {
      console.log(error);
  }
}

return (
   <div className="App">
      <div className="container-fluid">
         <div className="row">
            <div className="col-md-6 mt-5">
               <br /><br /><br />
               <img src={canasta} width="750" height="500" />
            </div>

            <div className="col-md-6">
               <div>
                  <div className="form-group mt-5">
                      <br /><br /><br /><br /><br /><br />
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

export default Login;