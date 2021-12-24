import React, {useState , useEffect} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalFooter,ModalHeader, ModalBody} from "reactstrap"
import swal from 'sweetalert';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrashAlt, faEdit, faWindowClose, faSave} from '@fortawesome/free-solid-svg-icons';

function Products() {
const [products, setProducts]=useState([]);
const [search, setSearch]=useState("");

const url = "https://localhost:44374/api/products";
const [data, setData]= useState([]);
const [categories, setCategories]= useState([]);
const [modalInsert, setModalInsert]= useState(false);
const [modalEdite, setModalEdite]= useState(false);
const [modalDelete, setModalDelete]= useState(false);
const [productSelected, setProductSelected]= useState({
   id:'',
   name: '',
   categoryId: '',
   barCode: '',
   category:''
});

const handleChange=e=>{
   const{name , value}=e.target;
   setProductSelected({
      ...productSelected,
      [name]: value
   });
   console.log(productSelected);
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
     setProducts(response.data.$values);
     console.log(response.data.$values);
  }).catch(error => {
     console.log(error);
  })
}


const postRequest = async () =>{
   delete productSelected.id;
   await axios.post(url, productSelected, {headers:{'Authorization': 'Bearer '+ token}})
   .then(response =>{
      //setData(data.concat(response.data));
      //console.log(response.data.$values);
      getRequest();
      openCloseModalInsert();
   }).catch(error => {
      console.log(error);
   })
 }

useEffect(()=>{
   getRequest()
},[])

const getCategories = async () =>{
   await axios.get("https://localhost:44374/api/categories", {headers:{'Authorization': 'Bearer '+ token}})
   .then(response =>{
      setCategories(response.data.$values);
      //console.log(response.data.$values)
   }).catch(error => {
      console.log(error);
   })
 }

 useEffect(()=>{
   getCategories()
},[])

const putRequest = async () =>{
   await axios.put(url+"/"+productSelected.id, productSelected, {headers:{'Authorization': 'Bearer '+ token}})
   .then(response =>{
      var answer = response.data;
      var auxData = data;
      auxData.map(product=>{
         if(product.id === productSelected.id){
            product.name = answer.name;
            product.category = answer.category;
            product.barCode = answer.barCode;
         }
      });
      getRequest();
      openCloseModalEdite();
   }).catch(error => {
      console.log(error);
   })
}

const deleteRequest = async () =>{
   await axios.delete(url + "/" + productSelected.id, {headers:{'Authorization': 'Bearer '+ token}})
   .then(response =>{
      setData(data.filter(product => product.id !== response.data));
      getRequest();
      openCloseModalDelete();
   }).catch(error=>{
      console.log(error);
   })
}

const selectProduct=(product, caso)=>{
   setProductSelected(product);
   (caso === "Edite")?
   openCloseModalEdite(): openCloseModalDelete();
}

const filter=(searchTearm)=>{
   var searchResult = data.filter((element)=>{
      if(element.name.toString().toLowerCase().includes(searchTearm.toLowerCase())){
         return element;
      }
      if(element.barCode.toString().toLowerCase().includes(searchTearm.toLowerCase())){
         return element;
      }
      if(element.category.name.toString().toLowerCase().includes(searchTearm.toLowerCase())){
         return element;
      }
   });
   setProducts(searchResult);
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
         <h1>Products</h1>
         <div className="row">
            <div className="col-md-6">
            <button onClick={()=>openCloseModalInsert()} className="btn btn-success" >Insert new product</button>
            <br /><br />
            </div>
            <div className="col-md-6">
              <div className="containerInput">
                 <input
                 className="form-control inputBuscar"
                 value={search}
                 placeholder="Search product by name, category or barcode"
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
               <td>CATEGORY</td>
               <td>BARCODE</td>
               <td>ACTIONS</td>
            </tr>
         </thead>
         <tbody>
            {products && products.map((product) =>(
               <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.category.name}</td>
                  <td>{product.barCode}</td>
                  <td>
                     <button className="btn btn-primary" onClick={()=>selectProduct(product, "Edite")}><FontAwesomeIcon icon={faEdit} /></button>{"  "}
                     <button className="btn btn-primary"onClick={()=>selectProduct(product, "Delete")}><FontAwesomeIcon icon={faTrashAlt} /></button>
                  </td>
               </tr>
            ))}
         </tbody>
      </table>

      <Modal isOpen={modalInsert}>
         <ModalHeader>Insert Product</ModalHeader>
         <ModalBody>
            <div className="form-group">
               <label>Name</label>
               <br />
               <input type="text" name="name" className="form-control" onChange={handleChange}  />
               <br />
               <label>Category</label>
               <br />
               <select name="categoryId" className="form-control" onChange={handleChange}>
                  <option disabled selected>select one option</option>
                  {categories.map(category=>(
                     <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
               </select>
               <br />
               <label>BarCode</label>
               <br />
               <input type="number" name="barcode" className="form-control" onChange={handleChange} />
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
               <label>ID</label>
               <br />
               <input type="number" name="id" className="form-control" readOnly value={productSelected && productSelected.id} />
               <br />
               <label>Name</label>
               <br />
               <input type="text" name="name" className="form-control" onChange={handleChange} value={productSelected && productSelected.name} />
               <br />
               <label>Category</label>
               <br />
               <select name="categoryId" className="form-control" onChange={handleChange}>
                  <option value={productSelected && productSelected.categoryId}>{productSelected.category.name}</option>
                  {categories.map(category=>(
                     <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
               </select>
               <br />
               <label>BarCode</label>
               <br />
               <input type="number" name="barcode" className="form-control" onChange={handleChange} value={productSelected && productSelected.barCode}/>
            </div>
         </ModalBody>
         <ModalFooter>
            <button className="btn btn-primary" onClick={()=>putRequest()}><FontAwesomeIcon icon={faEdit} /></button>
            <button className="btn btn-primary" onClick={()=>openCloseModalEdite()}><FontAwesomeIcon icon={faWindowClose} /></button>
         </ModalFooter>
      </Modal>


      <Modal isOpen={modalDelete}>
         <ModalBody>
            ¿Do you want to delete the product {productSelected && productSelected.name}
         </ModalBody>
         <ModalFooter>
            <button className="btn btn-danger" onClick={()=>deleteRequest()}><FontAwesomeIcon icon={faTrashAlt} /></button>
            <button className="btn btn-primary" onClick={()=>openCloseModalDelete()}><FontAwesomeIcon icon={faWindowClose} /></button>
         </ModalFooter>
      </Modal>
   </div>
);
}

export default Products;