import React, {useState , useEffect} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import swal from 'sweetalert';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrashAlt, faEdit, faWindowClose, faSave} from '@fortawesome/free-solid-svg-icons';

function CupBoard() {
const [cupBoard, setCupBoard]= useState([]);
const [search, setSearch]= useState("");

const url =("https://localhost:44374/api/cupboard");
const [data , setData] = useState ([]);
const [status, setStatus] = useState([]);
const [product, setProducts] = useState([]);
const [modalInsert, setModalInsert]= useState(false);
const [modalEdite, setModalEdite]= useState(false);
const [modalDelete, setModalDelete]= useState(false);
const [cupBoardSelected, setCupBoardSelected]= useState({
   id: '',
   productId:'',
   expireDate:'',
   quantity:'',
   statusId:'',

});

const handleChange=e=>{
   const{name , value}=e.target;
   setCupBoardSelected({
      ...cupBoardSelected,
      [name]: value
   });
   console.log(cupBoardSelected);
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
      console.log(response.data.$values)
   }).catch(error => {
      console.log(error);
   })
 }

const getProducts = async () =>{
   await axios.get("https://localhost:44374/api/products", {headers:{'Authorization': 'Bearer '+ token}})
   .then(response =>{
      setProducts(response.data.$values);
      //console.log(response.data.$values)
   }).catch(error => {
      console.log(error);
   })
}

const getStatus = async () =>{
   await axios.get("https://localhost:44374/api/status", {headers:{'Authorization': 'Bearer '+ token}})
   .then(response =>{
      setStatus(response.data.$values);
      //console.log(response.data.$values)
   }).catch(error => {
      console.log(error);
   })
}
 
useEffect(()=>{
    getRequest()
    getProducts()
    getStatus()
},[])

const postRequest = async () =>{
   await axios.post(url, cupBoardSelected, {headers:{'Authorization': 'Bearer '+ token}})
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
   await axios.put(url+"/"+cupBoardSelected.id, cupBoardSelected, {headers:{'Authorization': 'Bearer '+ token}})
   .then(response =>{
      var answer = response.data;
      var auxData = data;
      auxData.map(cupBoard=>{
         if(cupBoard.id === cupBoardSelected.id){
            cupBoard.productId = answer.productId;
            cupBoard.expireDate = answer.expireDate;
            cupBoard.quantity = answer.quantity;
            cupBoard.statusId = answer.statusId;
         }
      });
      getRequest();
      openCloseModalEdite();
   }).catch(error => {
      console.log(error);
   })
}

const deleteRequest = async () =>{
   await axios.delete(url + "/" + cupBoardSelected.id, {headers:{'Authorization': 'Bearer '+ token}})
   .then(response =>{
      setData(data.filter(cupBoard => cupBoard.id !== response.data));
      getRequest();
      openCloseModalDelete();
   }).catch(error=>{
      console.log(error);
   })
}

const selectCupBoard=(cupBoard, caso)=>{
   setCupBoardSelected(cupBoard);
   (caso === "Edite")?
   openCloseModalEdite(): openCloseModalDelete();
}

const filter=(searchTearm)=>{
   var searchResult = data.filter((element)=>{
      if(element.product.name.toString().toLowerCase().includes(searchTearm.toLowerCase())){
         return element;
      }
      if(element.expireDate.toString().toLowerCase().includes(searchTearm.toLowerCase())){
         return element;
      }
      if(element.quantity.toString().toLowerCase().includes(searchTearm.toLowerCase())){
         return element;
      }
   });
   setCupBoard(searchResult);
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
   <div className="App container">
      {user === null && Authorization()}
      <div className="container">
         <h1>CupBoard</h1>
         <div className="row">
            <div className="col-md-6">
            <button onClick={()=>openCloseModalInsert()} className="btn btn-success" >Insert new CupBoard</button>
            <br /><br />
            </div>
            <div className="col-md-6">
              <div className="containerInput">
                 <input
                 className="form-control inputBuscar"
                 value={search}
                 placeholder="Search by product name, expire date, or quantity"
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
               <td>PRODUCT</td>
               <td>EXPIRE DATE</td>
               <td>QUANTITY</td>
               <td>STATUS</td>
               <td>ACTIONS</td>
            </tr>
         </thead>
         <tbody>
            {cupBoard && data.map((cupboard) =>(
               <tr key={cupboard.id}>
                  <td>{cupboard.id}</td>
                  <td>{cupboard?.product?.name}</td>
                  <td>{cupboard.expireDate}</td>
                  <td>{cupboard.quantity}</td>
                  <td>{cupboard.statusId}</td>
                  <td>
                     <button className="btn btn-primary" onClick={()=>selectCupBoard(cupboard, "Edite")}><FontAwesomeIcon icon={faEdit} /></button>{"  "}
                     <button className="btn btn-primary" onClick={()=>selectCupBoard(cupboard, "Delete")}><FontAwesomeIcon icon={faTrashAlt} /></button>
                  </td>
               </tr>
            ))}
         </tbody>
      </table>

      <Modal isOpen={modalInsert}>
         <ModalHeader>Insert CupBoard</ModalHeader>
         <ModalBody>
         <div className="form-group">
               <label>Product</label>
               <br />
               <select name="productId" className="form-control" onChange={handleChange}>
               <option disabled selected>select one option</option>
                  {
                     product.map(product=>(
                        <option key={product.id} value={product.id}>{product.name}</option>
                     ))
                  }
               </select>
               
               <br />
               <label>Expire Date</label>
               <br />
               <input type="Date" name="expireDate" className="form-control" onChange={handleChange} />
               <br />
               <label>Quantity</label>
               <br />
               <input type="number" name="quantity" className="form-control"  onChange={handleChange} />
               <br />
               <label>Status</label>
               <br />
               <select name="statusId" className="form-control"  onChange={handleChange} >
               <option disabled selected>select one option</option>
                  {
                     status.map(status=>(
                        <option key={status.id} value={status.id}>{status.name}</option>
                     ))
                  }
               </select>
               
            </div>
         </ModalBody>
         <ModalFooter>
            <button className="btn btn-primary" onClick={()=>postRequest()}><FontAwesomeIcon icon={faSave} /></button>
            <button className="btn btn-primary" onClick={()=>openCloseModalInsert()}><FontAwesomeIcon icon={faWindowClose} /></button>
         </ModalFooter>
      </Modal>

      <Modal isOpen={modalEdite}>
         <ModalBody>
            <div className="form-group">
               <label>Id</label>
               <br />
               <input type="number" name="id" className="form-control" readOnly value={cupBoardSelected && cupBoardSelected.id} />
               <br />
               <label>Product</label>
               <br />
               <select name="productId" className="form-control" onChange={handleChange}>
               <option value={cupBoardSelected && cupBoardSelected.productId}>{cupBoardSelected?.product?.name}</option>
                  {
                     product.map(product=>(
                        <option key={product.id} value={product.id}>{product.name}</option>
                     ))
                  }
               </select>
               <br />
               <label>Expire Date</label>
               <br />
               <input type="Date" name="expireDate" className="form-control" onChange={handleChange} value={cupBoardSelected && cupBoardSelected.expireDate} />
               <br />
               <label>Quantity</label>
               <br />
               <input type="number" name="quantity" className="form-control"  onChange={handleChange} value={cupBoardSelected && cupBoardSelected.quantity}/>
               <br />
               <label>Status</label>
               <br />
               <select name="statusId" className="form-control"  onChange={handleChange} >
               <option value={cupBoardSelected && cupBoardSelected.statusId}>{cupBoardSelected.statusId}</option>
                  {
                     status.map(status=>(
                        <option key={status.id} value={status.id}>{status.name}</option>
                     ))
                  }
               </select>
            </div>
         </ModalBody>
         <ModalFooter>
            <button className="btn btn-primary" onClick={()=>putRequest()}><FontAwesomeIcon icon={faEdit} /></button>
            <button className="btn btn-primary" onClick={()=>openCloseModalEdite()}><FontAwesomeIcon icon={faWindowClose} /></button>
         </ModalFooter>
      </Modal>

      <Modal isOpen={modalDelete}>
         <ModalBody>
            ¿Do you want to delete the CupBoard {cupBoardSelected && cupBoardSelected.id}
         </ModalBody>
         <ModalFooter>
            <button className="btn btn-danger" onClick={()=>deleteRequest()}><FontAwesomeIcon icon={faTrashAlt} /></button>
            <button className="btn btn-primary" onClick={()=>openCloseModalDelete()}><FontAwesomeIcon icon={faWindowClose} /></button>
         </ModalFooter>
      </Modal>


   </div>
)   
}

export default CupBoard;