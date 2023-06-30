import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Signup = (props) => {  
  const [register, setRegister] = useState({name:"", email: "", password: "", cpassword:""}) 
  let navigate = useNavigate();

  const handleSubmit= async(e)=>{
    e.preventDefault();
    const {name, email, password} = register;
    if(register.cpassword===register.password)
    {
      const response = await fetch("http://localhost:5000/api/auth/createUser", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
        // body: JSON.stringify({name, email, password})
        body: JSON.stringify({name, email, password})
      });
      setRegister({name:"", email:"", password:"", cpassword:""})
      const json = await response.json()
      console.log(json);
      
      if (json.success)
      {
        // Save the auth token and redirect
        localStorage.setItem('token', json.authtoken);
        navigate("/login");
        props.showAlert("Account created successfully", "success");
      }
      else
      {
         props.showAlert("Invalid details", "danger");
      }
    }
    else
    {
      setRegister({password:"", cpassword:""})
      props.showAlert("Password and Confirm password should be same", "warning");
    }
        
  }
  const onChange = (e)=>{
    setRegister({...register, [e.target.name]: e.target.value})
}
  return (
    <div className='container pt-5'>
      <h2 className='my-2'>Create a account to use iNoteBook</h2>
     <form onSubmit={handleSubmit}>
        <div className="my -3">
          <label htmlFor="name" className="form-label">Full Name</label>
          <input type="text" className="form-control" id="name" name='name' 
            value={register.name} onChange={onChange} required/>          
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
          <input type="email" className="form-control" value={register.email} 
          onChange={onChange} id="email" name="email" aria-describedby="emailHelp" />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name='password' autoComplete='false' minLength={5} 
            value={register.password}  required onChange={onChange}/>
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">Confirm Password</label>
          <input type="password" className="form-control" id="cpassword" name='cpassword' autoComplete='false' minLength={5}
           required  value={register.cpassword} onChange={onChange}/>
        </div>
        {/* <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
          <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
        </div> */}
        <button type="submit" className="btn btn-primary">Sign Up</button>
      </form> 
    </div>
  )
}

export default Signup
