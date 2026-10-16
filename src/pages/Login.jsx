import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearAuthError } from '../features/auth/authSlice';

export default function Login(){
    const [form,setForm] =useState({email:'',password:''});
    const [errors,setErrors] = useState({});

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {currentUser, error} =  useSelector((state) => state.auth);

    useEffect(() => {
      dispatch(clearAuthError());
    }, [dispatch]);

    useEffect(() => {
      if(currentUser) navigate('/events');
    }, [currentUser, navigate]);

    function handleChange(e){
      setForm({...form,[e.target.name]:e.target.value});
    }

    function validate(){
      const errs = {};
      if(!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email address';
      if(!form.password) errs.password = 'Password is required';
      return errs;
    }

    function handleSubmit(e){
      e.preventDefault();
      const errs = validate();
      setErrors(errs);
      if (Object.keys(errs).length > 0) return;

      dispatch(
        login({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        })
      );
    }

    return(
      <div className ="auth-page">
        <h1>Login</h1>
        <form onSubmit = {handleSubmit} noValidate>
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
          {error && <p className="error">{error}</p>}
          <button type="submit">Login</button>

        </form>

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    );

}