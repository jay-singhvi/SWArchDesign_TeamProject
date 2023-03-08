
import './App.css';
import React, { useState, setState } from 'react';

// React component for creating and sending POST request
function App() {

  // variables to handle the Request and Response
  const [countryList, setCountryList] = useState("");
  const [formData, setFormData] = useState(null);
  const [responseData, setResponseData] = useState(null);
  
  // Set of Counries under consideration
  const countries = [
    { name: "Default"},
    { name: "United States of America"},
    { name: "India"},
    { name: "Canada"}
  ];
  
  // Function to render form based on Countries
  function renderForm() {
    if (countryList.length === 1) { 
      console.log(countryList)
        if(countryList.includes("United States of America"))
          return <USAForm setFormData={setFormData} />;
        else if(countryList.includes("India"))
          return <IndiaForm setFormData={setFormData} />;
        else if(countryList.includes("Canada"))
          return <CanadaForm setFormData={setFormData} />;      
        else
          return <DefaultForm setFormData={setFormData} />;
    }
    // Renders form for multiple selected countries
    else {
      return <DefaultForm setFormData={setFormData} />
    }
  }

  // Handles selected country and set ths
  function handleSelectedCountry(event) {
    const selectedOptions = Array.from(event.target.selectedOptions);
    const selectedValues = selectedOptions.map(option => option.value);
    setCountryList(selectedValues);
  }

  // Finds address based on the form data
  async function findAddress(event) {
    event.preventDefault();

    // If only one country is selected
    if(countryList.length === 1) {

      //If selected country id default then send country field empty in JSON request
      if(countryList[0] === 'Default')
      {
        countryList[0] = ''
      }
      const updatedFormData = {...formData, "Country": countryList[0]};

      // If form data has Name attribute then search based on name and country
      if(formData !== null && formData.Name !== null){
        try {
          const response = await fetch("http://localhost:5000/api/searchCountriesByClient", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedFormData),
          });
  
          const data = await response.json();
          setResponseData(data);
        } catch (error) {
          console.error(error);
          setResponseData({ error: "An error occurred" });
        }
      }

      //If name is not mentioned then populate all addresses for that country based on JSON request
      else {
        try {
          const response = await fetch("http://localhost:5000/api/searchCountry", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedFormData),
          });

          const data = await response.json();
          setResponseData(data);
        } catch (error) {
          console.error(error);
          setResponseData({ error: "An error occurred" });
        }
      }
    }
    //If more one country is selected then send the list of countries with JSON request
    else if(countryList.length > 1){
      const updatedFormData = {...formData, "Country": countryList};

      try {
        const response = await fetch("http://localhost:5000//api/searchCountries", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFormData),
        });

        const data = await response.json();
        setResponseData(data);
      } catch (error) {
        console.error(error);
        setResponseData({ error: "An error occurred" });
      }
    }
    // If only name is mentioned then look for that name in all countries
    else if(formData !== null && formData.Name !== null){
      try {
        const response = await fetch("http://localhost:5000/api/searchCountriesByClient", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        setResponseData(data);
      } catch (error) {
        console.error(error);
        setResponseData({ error: "An error occurred" });
      }
    }
    setFormData({});
  }
  
  // Give all the options of countries to user for selection  
  return (
    <div className=' items-center bg-red-400 w-1/2 justify-items-center'>
    <div className='  py-10 flex flex-col items-center '>
      <h1>Address Validator</h1>
      <div className=' bg-green-300'>
        <select multiple value={countryList} onChange={handleSelectedCountry}>
          {countries.map((country) => (
            <option key={country.name} value={country.name}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {renderForm()}

      <button type="submit" onClick={findAddress}>
          Submit
        </button>
    
      {responseData && (
        <div>
          <h2>Post Result:</h2>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      )}
      </div>
    </div>
    
  );
}

// React component to render USA specific form
function USAForm({setFormData}) {
  const [formValues, setFormValues] = useState({});
  function updateForm(event) {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
    setFormData({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  }
  
  return (
    <div>
      <form>
        <h2>United States Form</h2> 
        Name: <input type="text" name="Name" onChange={updateForm} />
        <br/>
        Address1: <input type="text" name="Address1" onChange={updateForm} />
        <br/>
        Address2: <input type="text" name="Address2" onChange={updateForm} />
        <br/>
        City: <input type="text" name="City" onChange={updateForm} />
        <br/>
        State: <input type="text" name="State" onChange={updateForm} />
        <br/>
        ZipCode: <input type="text" name="Zipcode" onChange={updateForm} />
        <br/>
      </form>
    </div>
  );
}

// React component to render Canada specific form
function CanadaForm({setFormData}) {
  const [formValues, setFormValues] = useState({});
  function updateForm(event) {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
    setFormData({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  }
  
  return (
    <div>
      <form>
        <h2>Canada Form</h2>
        Name: <input type="text" name="Name" onChange={updateForm} />
        <br/>
        Address1: <input type="text" name="Address1" onChange={updateForm} />
        <br/>
        Address2: <input type="text" name="Address2" onChange={updateForm} />
        <br/>
        City: <input type="text" name="City" onChange={updateForm} />
        <br/>
        Province: <input type="text" name="State" onChange={updateForm} />
        <br/>
        Postalcode: <input type="text" name="ZipCode" onChange={updateForm} />
      </form>
    </div>
  );
}

// React component to render India specific form
function IndiaForm({setFormData}) {
  const [formValues, setFormValues] = useState({});
  function updateForm(event) {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
    setFormData({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  }
  
  return (
    <div>
      <form>
        <h2>India Form</h2>
        Name: <input type="text" name="Name" onChange={updateForm} />
        <br/>
        Street Address: <input type="text" name="Address1" onChange={updateForm} />
        <br/>
        Address2: <input type="text" name="Address2" onChange={updateForm} />
        <br/>
        City: <input type="text" name="City" onChange={updateForm} />
        <br/>
        State: <input type="text" name="State" onChange={updateForm} />
        <br/>
        Pincode: <input type="text" name="ZipCode" onChange={updateForm} />
        <br/>
      </form>
    </div>
  );
}

// React component to render default form
function DefaultForm({setFormData}) {

  const [formValues, setFormValues] = useState({});
  function updateForm(event) {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
    setFormData({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  }

  return (
    <div className='  bg-yellow-400'>
      <h2>Default Form</h2>
        Name: <input type="text" name="Name" onChange={updateForm} />
        <br/>
        Address1: <input type="text" name="Address1" onChange={updateForm} />
        <br/>
        Address2: <input type="text" name="Address2" onChange={updateForm} />
        <br/>
        City: <input type="text" name="City" onChange={updateForm} />
        <br/>
        State: <input type="text" name="State" onChange={updateForm} />
        <br/>
        ZipCode: <input type="text" name="Zipcode" onChange={updateForm} />
        <br/>
    </div>
  );
}

export default App;