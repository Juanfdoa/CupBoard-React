import React, {useState , useEffect} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalFooter,ModalHeader, ModalBody} from "reactstrap"
import swal from 'sweetalert';

function Categories() {
const [categories, setCategories]=useState([]);
const [search, setSearch]=useState("");

const url = "https://localhost:44374/api/categories";
const [data, setData]= useState([]);
const [modalEdite, setModalEdite]= useState(false);
const [modalInsert, setModalInsert]= useState(false);
const [modalDelete, setModalDelete]= useState(false);
const [categorySelected, setCategorySelected]= useState({
   id: ' ',
   name: ' '
});

const handleChange=e=>{
   const{name, value}=e.target;
   setCategorySelected({
      ...categorySelected,
      [name]: value
   });
   console.log(categorySelected);
   setSearch(e.target.value);                 //search
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
     setCategories(response.data.$values);         //Barra de busqueda
     console.log(response.data.$values)
  }).catch(error => {
     console.log(error);
  })
}

const postRequest = async () =>{
   delete categorySelected.id
   await axios.post(url, categorySelected, {headers:{'Authorization': 'Bearer '+ token}})
   .then(response =>{
      setData(data.concat(response.data));
      console.log(response.data.$values);
      openCloseModalInsert();
   }).catch(error => {
      console.log(error);
   })
 }

 const putRequest = async () =>{
   await axios.put(url + "/" + categorySelected.id, categorySelected, {headers:{'Authorization': 'Bearer '+ token}})
   .then(response =>{
      var answer = response.data;
      var auxData = data;
      auxData.map(category=>{
         if(category.id === categorySelected.id){
            category.name = answer.name;
         }
      });
      openCloseModalEdite();
   }).catch(error => {
      console.log(error);
   })
 }

const deleteRequest = async () =>{
   await axios.delete(url + "/" + categorySelected.id, {headers:{'Authorization': 'Bearer '+ token}})
   .then(response =>{
      setData(data.filter(category => category.id !== response.data));
      openCloseModalDelete();
   }).catch(error=>{
      console.log(error);
   })
}

const selectCategory=(category, caso)=>{
   setCategorySelected(category);
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
   setCategories(searchResult);
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
   <div className="App">
         {user === null && Authorization()}
      <div className="container">
         <div className="row">
            <div className="col-md-6">
            <button onClick={()=>openCloseModalInsert()} className="btn btn-success" >Insert new Category</button>
            <br /><br />
            </div>
            <div className="col-md-6">
              <div className="containerInput">
                 <input
                 className="form-control inputBuscar"
                 value={search}
                 placeholder="Search category by name"
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
            {categories.map(category =>(
               <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>
                     <button className="btn btn-primary" onClick={()=>selectCategory(category, "Edite")}>Edite</button>{"  "}
                     <button className="btn btn-danger" onClick={()=>selectCategory(category, "Delete")}>Delete</button>
                  </td>
               </tr>
            ))}
         </tbody>
      </table>

      <Modal isOpen={modalInsert}>
         <ModalHeader>Insert Category</ModalHeader>
         <ModalBody>
            <div className="form-group">
               <label>Name</label>
               <br />
               <input type="text" className="form-control" name="name" onChange={handleChange}/>
               <br />
            </div>
         </ModalBody>
         <ModalFooter>
            <button onClick={()=>postRequest()} className="btn btn-primary">Insert</button>
            <button onClick={()=>openCloseModalInsert()} className="btn btn-danger">Cancel</button>
         </ModalFooter>
      </Modal>


      <Modal isOpen={modalEdite}>
         <ModalHeader>Edite Category</ModalHeader>
         <ModalBody>
            <div className="form-group">
            <label>Id</label>
               <br />
               <input type="number" className="form-control" readOnly value={categorySelected && categorySelected.id}/>
               <br />
               <label>Name</label>
               <br />
               <input type="text" className="form-control" name="name" onChange={handleChange} value={categorySelected && categorySelected.name} />
               <br />
            </div>
         </ModalBody>
         <ModalFooter>
            <button onClick={()=>putRequest()} className="btn btn-primary">Edite</button>
            <button onClick={()=>openCloseModalEdite()} className="btn btn-danger">Cancel</button>
         </ModalFooter>
      </Modal>

      <Modal isOpen={modalDelete}>
         <ModalBody>
            ¿Do you want to delete the category {categorySelected && categorySelected.name}
         </ModalBody>
         <ModalFooter>
            <button className="btn btn-danger" onClick={()=>deleteRequest()}>Yes</button>
            <button className="btn ntn-secondary" onClick={()=>openCloseModalDelete()}>No</button>
         </ModalFooter>
      </Modal>
   </div>
);
}

export default Categories;