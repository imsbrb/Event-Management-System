import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearAuthError } from '../features/auth/authSlice';

export default function Register() {
  const [form,setForm] = useState({name:'',email:'',password:'',confirm:''});
  const [errors,setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, error } = useSelector((state) => state.auth);

  // Clear any old error (e.g. from the login page) when this page opens
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  // As soon as someone is logged in, leave this page
  useEffect(() => {
    if(currentUser) navigate('/events');
  }, [currentUser, navigate]);

  function handleChange(e){
    setForm({...form,[e.target.name]:e.target.value});
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email address';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.confirm !== form.password) errs.confirm = 'Passwords do not match';
    return errs;
  }

  function handleSubmit(e){
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if(Object.keys(errs).length > 0) return;

    dispatch(
      registerUser({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      })
    )
  }

  return(
    <div className="auth-page">
      <h1>Create an Account</h1>
      <form onSubmit={handleSubmit} noValidate>
        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} />
        </label>
        {errors.name && <p className="error">{errors.name}</p>}
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} />
        </label>
        {errors.email && <p className="error">{errors.email}</p>}
        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={handleChange} />
        </label>
        {errors.password && <p className="error">{errors.password}</p>}
        <label>
          Confirm Password
          <input name="confirm" type="password" value={form.confirm} onChange={handleChange} />
        </label>
        
        {errors.confirm && <p className="error">{errors.confirm}</p>}
        {error && <p className="error">{error}</p>}

        <button type="submit">Register</button>
        
      </form>
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );


}