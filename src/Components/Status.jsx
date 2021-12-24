import React, {useState , useEffect} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalFooter,ModalHeader, ModalBody} from "reactstrap";
import swal from 'sweetalert';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrashAlt, faEdit, faWindowClose, faSave} from '@fortawesome/free-solid-svg-icons';

function Status() {
const [status, setStatus]= useState([]);
const [search, setSearch]= useState("");

const url = "https://localhost:44374/api/status";
const [data, setData]= useState([]);
const [modalEdite, setModalEdite]= useState(false);
const [modalInsert, setModalInsert]= useState(false);
const [modalDelete, setModalDelete]= useState(false);
const [statusSelected, setStatusSelected]= useState({
   id : ' ',
   name : ' '
})


const handleChange=e=>{
   const{name , value}=e.target;
   setStatusSelected({
      ...statusSelected,
      [name]: value
   });
   console.log(statusSelected);
   setSearch(e.target.value);
   filter(e.target.value);
}

const openCloseModalInsert=()=>{
   setModalInsert(!modalInsert);
}

const openCloseModalEdite=()=>{
   setModalEdite(!modalEdite);
}

const openCloseModalDelete=()=>{
   setModalDelete(!modalDelete);
}

let user = JSON.parse(sessionStorage.getItem('token'));
const token = user;

const getRequest = async () =>{
  await axios.get(url, {headers:{'Authorization': 'Bearer '+ token}})
  .then(response =>{
     setData(response.data.$values);
     setStatus(response.data.$values);
     console.log(response.data.$values);
  }).catch(error => {
     console.log(error);
  })
}

const postRequest = async () =>{
   delete statusSelected.id;
   await axios.post(url,statusSelected, {headers:{'Authorization': 'Bearer '+ token}})
   .then(response =>{
      //setData(data.concat(response.data));
      //console.log(response.data.$values);
      getRequest();
      openCloseModalInsert();
   }).catch(error => {
      console.log(error);
   })
 }

 const putRequest = async () =>{
   await axios.put(url + "/" + statusSelected.id, statusSelected, {headers:{'Authorization': 'Bearer '+ token}})
   .then(response =>{
      var answer = response.data;
      var auxData = data;
      auxData.map(status=>{
         if(status.id === statusSelected.id){
            status.name = answer.name;
         }
      });
      getRequest();
      openCloseModalEdite();
   }).catch(error => {
      console.log(error);
   })
 }

 const deleteRequest = async () =>{
   await axios.delete(url + "/" + statusSelected.id, {headers:{'Authorization': 'Bearer '+ token}})
   .then(response =>{
      setData(data.filter(status => status.id !== response.data));
      getRequest();
      openCloseModalDelete();
   }).catch(error=>{
      console.log(error);
   })
}

 const selectStatus=(status, caso)=>{
   setStatusSelected(status);
   (caso === "Edite")?
   openCloseModalEdite(): openCloseModalDelete();
}

useEffect(()=>{
   getRequest()
},[])

const filter=(searchTearm)=>{
   var searchResult = data.filter((element)=>{
      if(element.name.toString().toLowerCase().includes(searchTearm.toLowerCase())){
         return element;
      }
   });
   setStatus(searchResult);
}

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
return(
   <div className="App container" >
      {user === null && Authorization()}
      <div className="container">
         <h1>Status</h1>
         <div className="row">
            <div className="col-md-6">
            <button onClick={()=>openCloseModalInsert()} className="btn btn-success" >Insert new Status</button>
            <br /><br />
            </div>
            <div className="col-md-6">
              <div className="containerInput">
                 <input
                 className="form-control inputBuscar"
                 value={search}
                 placeholder="Search status by name"
                 onChange={handleChange}
               />
            </div>   
            </div>
         </div>
      </div> 
      <table className="table Table-bordered">
         <thead>
            <tr>
               <td>ID</td>
               <td>NAME</td>
               <td>ACTIONS</td>
            </tr>
         </thead>
         <tbody>
            {status.map(status =>(
               <tr key={status.id}>
                  <td>{status.id}</td>
                  <td>{status.name}</td>
                  <td>
                     <button className="btn btn-primary" onClick={()=>selectStatus(status, "Edite")}><FontAwesomeIcon icon={faEdit} /></button>{"  "}
                     <button className="btn btn-primary" onClick={()=>selectStatus(status, "Delete")}><FontAwesomeIcon icon={faTrashAlt} /></button>
                  </td>
               </tr>
            ))}
         </tbody>
      </table>

      <Modal isOpen={modalInsert}>
         <ModalHeader>Insert Status</ModalHeader>
         <ModalBody>
            <div className="form-group">
               <label>Name</label>
               <br />
               <input type="text" className="form-control" name="name" onChange={handleChange}/>
               <br />
            </div>
         </ModalBody>
         <ModalFooter>
            <button className="btn btn-primary" onClick={()=>postRequest()}><FontAwesomeIcon icon={faSave} /></button>{"  "}
            <button className="btn btn-primary" onClick={()=>openCloseModalInsert()}><FontAwesomeIcon icon={faWindowClose} /></button>
         </ModalFooter>
      </Modal>

      <Modal isOpen={modalEdite}>
         <ModalHeader>Edite Status</ModalHeader>
         <ModalBody>
            <div className="form-group">
               <label>Id</label>
               <br />
               <input type="text" className="form-control" readOnly value={statusSelected && statusSelected.id} />
               <br />
               <label>Name</label>
               <br />
               <input type="text" className="form-control" name="name" onChange={handleChange} value={statusSelected && statusSelected.name} />
               <br />
            </div>
         </ModalBody>
         <ModalFooter>
            <button className="btn btn-primary" onClick={()=>putRequest()}><FontAwesomeIcon icon={faEdit} /></button>{"  "}
            <button className="btn btn-primary" onClick={()=>openCloseModalEdite()} ><FontAwesomeIcon icon={faWindowClose} /></button>
         </ModalFooter>
      </Modal>

      <Modal isOpen={modalDelete}>
         <ModalBody>
            ¿Do you want to delete the status {statusSelected && statusSelected.name}
         </ModalBody>
         <ModalFooter>
            <button className="btn btn-danger" onClick={()=>deleteRequest()}><FontAwesomeIcon icon={faTrashAlt} /></button>
            <button className="btn btn-primary" onClick={()=>openCloseModalDelete()}><FontAwesomeIcon icon={faWindowClose} /></button>
         </ModalFooter>
      </Modal>
   </div>
);
}

export default Status;