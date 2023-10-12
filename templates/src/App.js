import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate} from 'react-router-dom';
import './App.css';

// Login Page
function Login(props) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loginType, setLoginType] = useState('');
const navigate = useNavigate();
  const handleSubmit = (e) => {
    const baseUrl = "http://localhost:8081";
    // prevent page reload
    e.preventDefault();


    const token = localStorage.getItem('token')
    
    var data = "{\"email\":\"" + email + "\", \"password\":\"" + pass + "\", \"type\":\"" + loginType + "\"}";
    console.log(data)

    fetch('http://localhost:8081/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data
    })
    .then((response) => {
      console.log("test1")
      if (response.status === 401) {
        console.log("Throw here")
        window.alert("Error")
      } else if (!response.ok) {
        window.alert("Error")
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      console.log("Test fronend")
      console.log(data);
      localStorage.setItem('token', data.token)
      localStorage.setItem('userID', data.user_id);

      if (loginType === 'Student') {
        window.location.href = 'http://127.0.0.1:5000/courses';
      } else if (loginType === 'Teacher') {
        window.location.href = 'http://127.0.0.1:5000/teacher';
      }

    })
    .catch((error) => {
      console.log("test2")
      console.error('There was a problem with the fetch operation:', error);
      window.alert("Error")
    });
  }
  const h2Style = {
    color: '#FF6600', // Text color
    fontSize: '24px', // Font size
    fontFamily: 'Arial, sans-serif', // Font family
    fontWeight: 'bold', // Font weight
    textTransform: 'uppercase', // Text transformation
    textAlign: 'center', // Text alignment
    margin: '10px 0', // Margin (top and bottom)
    padding: '10px', // Padding
    backgroundColor: 'lightgray', // Background color
    border: '2px solid darkblue', // Border
    borderRadius: '8px', // Border radius
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Box shadow
  };
  
  return (
    <div className='auth-form-container'>
      <h2 style={h2Style}>Welcome To EduCare 1.0</h2>
      <form className='login-form' onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" name="email" placeholder='test@gmail.com' id='email'></input>
        <label htmlFor="pwd">Password</label>
        <input value={pass} onChange={(e) => setPass(e.target.value)} type="text" name="pwd" placeholder='******' id='pwd'></input>

        <div>
          <input type='radio' value={'Student'} onChange={(e) => setLoginType(e.target.value)} name='loginType' id='Student'></input>
          <label htmlFor='Student'>Student</label>
          <input type='radio' value={'Teacher'} onChange={(e) => setLoginType(e.target.value)} name='loginType' id='Teacher'></input>
          <label htmlFor='Teacher'>Teacher</label>
        </div>

        <button className='submit-btn' type="submit">Login</button>
      </form>
      <Link to='/register' className='link-btn'>Register for a new Account!</Link>
    </div>
    
  );
}

// Registration Page
function Register(props) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(email);
    console.log(pass);
  }

  return (
    <div className='auth-form-container'>
      <form className='register-form' onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} type="text" name="name" placeholder='Abbey Lim' id='name'></input>
        <label htmlFor="email">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" name="email" placeholder='test@gmail.com' id='email'></input>
        <label htmlFor="pwd">Password</label>
        <input value={pass} onChange={(e) => setPass(e.target.value)} type="text" name="pwd" placeholder='******' id='pwd'></input>
        <button type="submit">Register</button>
      </form>
      <Link to='/login' className='link-btn'>Already have an Account? Login here</Link>
    </div>
  );
}

// //Filler Page
// function Filler() {
//   const navigate = useNavigate();

//   const handleNav = () => {
//     localStorage.setItem('token', null);
//     navigate('/login');
//   }

//   return (
//     <div>
//       <a href="http://localhost:5000/courses">Visit localhost</a>
//     </div>
//   );

// }

function App() {
  const [currentForm, setCurrentForm] = useState('login');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }

  var token = localStorage.getItem('token')
  console.log(typeof(token))

  // if (token != null) {
  //   console.log("not null")
  //   return (
  //     <Filler />
  //   )
  // }

  return (
    // <div className='App'>
    //   {
    //     currentForm === 'login'? <Login onFormSwitch={toggleForm}/>: <Register onFormSwitch={toggleForm}/>
    //   }
    // </div>
    <Router>
      <Routes>
        {/* <Route path="/" element={<Login onFormSwitch={toggleForm} />} /> */}
        <Route path="/" element={<Login onFormSwitch={toggleForm} />} />
        <Route path="/login" element={<Login onFormSwitch={toggleForm} />} />
        <Route path="/register" element={<Register onFormSwitch={toggleForm} />} />
      </Routes>
    </Router>
  );

}


export default App;
