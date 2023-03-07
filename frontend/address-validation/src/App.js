
import './App.css';
import React, { useState } from 'react';

function App() {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const handlePost = () => {
    
    if(name)
    {
      const requestBody = { 'Name': name };
      fetch('http://localhost:5000/api/searchCountriesByClient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
      .then(res => res.json())
      .then(data =>{
        const responseDiv = document.getElementById('response');
        responseDiv.innerHTML = `Response: ${JSON.stringify(data)}`;
      })
      .catch(err => console.log(err));
    }
    else if(country)
    {
      const requestBody = { 'Country': country };
      fetch('http://localhost:5000//api/searchCountry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
      .then(res => res.json())
      .then(data =>{
        const responseDiv = document.getElementById('response');
        responseDiv.innerHTML = `Response: ${JSON.stringify(data)}`;
      })
      .catch(err => console.log(err));
    }
    
    
  };

  return (
    <div>
      <h1>Address Validator</h1>
      Name: <input type="text" value={name} onChange={e => setName(e.target.value)} />
      <br/>
      Country: <input type="text" value={country} onChange={e => setCountry(e.target.value)} />
      <br/>
      Address1: <input type="text" value={address1} onChange={e => setAddress1(e.target.value)} />
      <br/>
      Address2: <input type="text" value={address2} onChange={e => setAddress2(e.target.value)} />
      <br/>
      <button onClick={handlePost}>Find Address</button>
      <p id='response'/>
    </div>
    
  );
}

export default App;