// import axios from 'axios';
import { useState } from 'react';

function AddAuthor() {

  const [formData,setFormData] =useState({
    name:"",
    institution:"",
    dept:"",
    email:"",
    address:"",
    homepage:""
  });

  return (
    <div className="add-author-container">
      <h2>Add Author</h2>
      <form method="post" action='/api/'>
        <div className="form-group">
          <label htmlFor="Name">Name</label>
          <input type="text" id="Name" onChange={e=>setFormData(formData=>({...formData,name:e.target.value}))} placeholder="Enter author name" />
        </div>
        <div className="form-group">
          <label htmlFor="year">Year</label>
          <input type="text" id="instiution" placeholder="Enter instiution" onChange={e=>setFormData(formData=>({...formData,institution:e.target.value}))}/>
        </div>
        <div className="form-group">
          <label htmlFor="year"></label>
          <input type="text" id="year" placeholder="Enter birth year" onChange={e=>setFormData(formData=>({...formData,year:e.target.value}))}/>
       </div>
        <div className="form-group">
          <label htmlFor="year"></label>
          <input type="text" id="year" placeholder="Enter birth year" onChange={e=>setFormData(formData=>({...formData,year:e.target.value}))}/>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AddAuthor;
