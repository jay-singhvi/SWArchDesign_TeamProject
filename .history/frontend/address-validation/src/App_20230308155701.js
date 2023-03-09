import "./App.css";
import React, { useState, setState } from "react";
import USA from "./assets/usa.png";
import CND from "./assets/canada.png";
import IND from "./assets/india.png";
import { styled } from '@mui/material/styles';
import Table from "@mui/material/Table";
import TableFooter from '@mui/material/TableFooter';
import TableBody from "@mui/material/TableBody";
import TableCell,  { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

// React component for creating and sending POST request
function App() {
  // variables to handle the Request and Response
  const [countryList, setCountryList] = useState("");
  const [formData, setFormData] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - responseData.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.common.black,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));
  

  // Set of Counries under consideration
  const countries = [
    { name: "Default" },
    { name: "United States of America" },
    { name: "India" },
    { name: "Canada" },
  ];

  // Function to render form based on Countries
  function renderForm() {
    if (countryList.length === 1) {
      console.log(countryList);
      if (countryList.includes("United States of America"))
        return <USAForm setFormData={setFormData} />;
      else if (countryList.includes("India"))
        return <IndiaForm setFormData={setFormData} />;
      else if (countryList.includes("Canada"))
        return <CanadaForm setFormData={setFormData} />;
      else return <DefaultForm setFormData={setFormData} />;
    }
    // Renders form for multiple selected countries
    else {
      return <DefaultForm setFormData={setFormData} />;
    }
  }

  // Handles selected country and set ths
  function handleSelectedCountry(event) {
    const selectedOptions = Array.from(event.target.selectedOptions);
    const selectedValues = selectedOptions.map((option) => option.value);
    setCountryList(selectedValues);
  }

  // Finds address based on the form data
  async function findAddress(event) {
    event.preventDefault();

    // If only one country is selected
    if (countryList.length === 1) {
      //If selected country id default then send country field empty in JSON request
      if (countryList[0] === "Default") {
        countryList[0] = "";
      }
      const updatedFormData = { ...formData, Country: countryList[0] };

      // If form data has Name attribute then search based on name and country
      if (formData !== null && formData.Name !== null) {
        try {
          const response = await fetch(
            "http://127.0.0.1:5000/api/searchCountriesByClient",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedFormData),
            }
          );

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
          const response = await fetch(
            "http://127.0.0.1:5000/api/searchCountry",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedFormData),
            }
          );

          const data = await response.json();
          setResponseData(data);
        } catch (error) {
          console.error(error);
          setResponseData({ error: "An error occurred" });
        }
      }
    }
    //If more one country is selected then send the list of countries with JSON request
    else if (countryList.length > 1) {
      const updatedFormData = { ...formData, Country: countryList };

      try {
        const response = await fetch(
          "http://127.0.0.1:5000//api/searchCountries",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedFormData),
          }
        );

        const data = await response.json();
        setResponseData(data);
      } catch (error) {
        console.error(error);
        setResponseData({ error: "An error occurred" });
      }
    }
    // If only name is mentioned then look for that name in all countries
    else if (formData !== null && formData.Name !== null) {
      try {
        const response = await fetch(
          "http://127.0.0.1:5000/api/searchCountriesByClient",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        const data = await response.json();
        setResponseData(data);
      } catch (error) {
        console.error(error);
        console.log(error);
        setResponseData({ error: "An error occurred" });
      }
    }
    setFormData({});
  }

  // Give all the options of countries to user for selection
  return (
    <div className=" items-center justify-between min-h-screen  ">
      <div className="  py-10 flex flex-col items-center border-2 border-black">
        <h1 className=" uppercase tracking-widest font-bold text-xl">
        Authentic Address
        </h1>
        <div className=" mt-3">
          <select
            className=" p-5 outline-none focus:outline-none"
            multiple
            value={countryList}
            onChange={handleSelectedCountry}
          >
            {countries.map((country) => (
              <option
                className=" cursor-pointer uppercase tracking-widest p-2 hover:bg-gray-300"
                key={country.name}
                value={country.name}
              >
                {country.name}
              </option>
            ))}
          </select>
          {/* <Select
            className=" p-5 outline-none focus:outline-none"
            isMulti
            value={countryList}
            options={countryOptions}
            onChange={handleSelectedCountry}
          />
           */}
        </div>

        {renderForm()}

        {/* <button type="submit" onClick={findAddress}>
          Submit
        </button> */}
        <a class="relative inline-block text-lg group mt-10">
          <span class="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
            <span class="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
            <span class="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
            <button
              type="submit"
              onClick={findAddress}
              className=" relative uppercase tracking-widest text-sm"
            >
              Submit
            </button>
          </span>
          <span
            class="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"
            data-rounded="rounded-lg"
          ></span>
        </a>

        {/* output */}
        {responseData && (
          <div className="mt-40 mb-14">
            <div className="">
              <h1 className=" text-center uppercase font-bold tracking-widest">Results</h1>
            </div>
            <TableContainer sx={{ minHeight: 500 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell sx={{fontWeight:"fontWeightBold", textAlign:"left"}}>Name</StyledTableCell>
                    <StyledTableCell sx={{fontWeight:"fontWeightBold",textAlign:"center"}}>Address 01</StyledTableCell>
                    <StyledTableCell sx={{fontWeight:"fontWeightBold",textAlign:"left"}}>Address 02</StyledTableCell>
                    <StyledTableCell sx={{fontWeight:"fontWeightBold",textAlign:"left"}}>City</StyledTableCell>
                    <StyledTableCell sx={{fontWeight:"fontWeightBold",textAlign:"left"}}>State</StyledTableCell>
                    <StyledTableCell sx={{fontWeight:"fontWeightBold",textAlign:"center"}}>Zip Code</StyledTableCell>
                    <StyledTableCell sx={{fontWeight:"fontWeightBold",textAlign:"center"}}>Country</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? responseData.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : responseData
                  ).map((address) => (
                    <StyledTableRow key={address._id}>
                      <StyledTableCell sx={{textAlign:"left"}}>{address.Name}</StyledTableCell>
                      <StyledTableCell  sx={{textAlign:"center"}}>{address.Address1}</StyledTableCell>
                      <StyledTableCell sx={{textAlign:"left"}}>{address.Address2}</StyledTableCell>
                      <StyledTableCell>{address.City}</StyledTableCell>
                      <StyledTableCell>{address.State}</StyledTableCell>
                      <StyledTableCell>{address.ZipCode}</StyledTableCell>
                      <StyledTableCell  sx={{textAlign:"center"}}>{address.Country}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[
                        5,
                        10,
                        25,
                        { label: "All", value: -1 },
                      ]}
                      colSpan={3}
                      count={responseData.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      SelectProps={{
                        inputProps: {
                          "aria-label": "rows per page",
                        },
                        native: true,
                      }}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </div>
        )}
      </div>
    </div>
  );
}

// React component to render USA specific form
function USAForm({ setFormData }) {
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
    <div className=" bg-gradient-to-b from-blue-400 to-red-500 items-center mt-5 px-10 py-5 min-w-fit">
      <div>
        <form>
          <div className=" flex items-center justify-center space-x-2">
            <img src={USA} className=" h-8 w-8 rounded-full" />
            <h2 className=" uppercase tracking-wider font-medium">
              United States Form
            </h2>
          </div>

          <div className=" mt-2 space-y-3">
            <div className="w-full px-3 mb-3">
              <label
                className="block uppercase tracking-wide text-black text-xs font-bold mb-2"
                for="grid-first-name"
              >
                Full Name
              </label>
              <input
                onChange={updateForm}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                type="text"
                placeholder="Full Name"
              />
            </div>

            {/* address 01 02 */}
            <div className=" flex">
              <div className=" w-full px-3 mb-3">
                <label className=" block uppercase tracking-wide text-black text-xs font-bold mb-2">
                  Address 01
                </label>
                <input
                  onChange={updateForm}
                  className=" appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="text"
                  name="Address1"
                  placeholder="Address Line 01"
                />
              </div>
              <div className=" w-full px-3 mb-3">
                <label className=" block uppercase tracking-wide text-black text-xs font-bold mb-2">
                  Address 02
                </label>
                <input
                  onChange={updateForm}
                  className=" appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="text"
                  name="Address2"
                  placeholder="Address Line 02"
                />
              </div>
            </div>

            {/* city state and zip */}
            <div className=" flex">
              <div className=" w-full px-3 mb-3">
                <label className=" block uppercase tracking-wide text-black text-xs font-bold mb-2">
                  City
                </label>
                <input
                  onChange={updateForm}
                  className=" appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="text"
                  name="City"
                  placeholder="City"
                />
              </div>
              <div className=" w-full px-3 mb-3">
                <label className=" block uppercase tracking-wide text-black text-xs font-bold mb-2">
                  State
                </label>
                <input
                  onChange={updateForm}
                  className=" appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="text"
                  name="State"
                  placeholder="State"
                />
              </div>
              <div className=" w-full px-3 mb-3">
                <label className=" block uppercase tracking-wide text-black text-xs font-bold mb-2">
                  Zip Code
                </label>
                <input
                  onChange={updateForm}
                  className=" appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="text"
                  name="Zipcode"
                  placeholder="Zip Code"
                />
              </div>
            </div>

            {/* Name: <input type="text" name="Name" onChange={updateForm} />
            <br /> */}
            {/* Address1:{" "}
            <input type="text" name="Address1" onChange={updateForm} />
            <br /> */}
            {/* Address2:{" "}
            <input type="text" name="Address2" onChange={updateForm} />
            <br /> */}
            {/* City: <input type="text" name="City" onChange={updateForm} />
            <br />
            State: <input type="text" name="State" onChange={updateForm} />
            <br />
            ZipCode: <input type="text" name="Zipcode" onChange={updateForm} />
            <br /> */}
          </div>
        </form>
      </div>
    </div>
  );
}

// React component to render Canada specific form
function CanadaForm({ setFormData }) {
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
    <div className="bg-gradient-to-b from-white to-red-500 items-center mt-5 px-10 py-5">
      <div>
        <form>
          <div className=" flex items-center justify-center space-x-2">
            <img src={CND} className=" h-8 w-8 rounded-full" />
            <h2 className=" uppercase tracking-wider font-medium">
              Canada Form
            </h2>
          </div>
          <div className=" mt-2 space-y-3">
            <div className="w-full px-3 mb-3">
              <label
                className="block uppercase tracking-wide text-black text-xs font-bold mb-2"
                for="grid-first-name"
              >
                Full Name
              </label>
              <input
                onChange={updateForm}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                type="text"
                name="Name"
                placeholder="Name"
              />
            </div>

            {/* address 01 02 */}
            <div className=" flex">
              <div className=" w-full px-3 mb-3">
                <label className=" block uppercase tracking-wide text-black text-xs font-bold mb-2">
                  Address 01
                </label>
                <input
                  onChange={updateForm}
                  className=" appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="text"
                  name="Address1"
                  placeholder="Address Line 01"
                />
              </div>
              <div className=" w-full px-3 mb-3">
                <label className=" block uppercase tracking-wide text-black text-xs font-bold mb-2">
                  Address 02
                </label>
                <input
                  onChange={updateForm}
                  className=" appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="text"
                  name="Address2"
                  placeholder="Address Line 02"
                />
              </div>
            </div>

            {/* city state and zip */}
            <div className=" flex">
              <div className=" w-full px-3 mb-3">
                <label className=" block uppercase tracking-wide text-black text-xs font-bold mb-2">
                  City
                </label>
                <input
                  onChange={updateForm}
                  className=" appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="text"
                  name="City"
                  placeholder="City"
                />
              </div>
              <div className=" w-full px-3 mb-3">
                <label className=" block uppercase tracking-wide text-black text-xs font-bold mb-2">
                  Province
                </label>
                <input
                  onChange={updateForm}
                  className=" appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="text"
                  name="State"
                  placeholder="Province"
                />
              </div>
              <div className=" w-full px-3 mb-3">
                <label className=" block uppercase tracking-wide text-black text-xs font-bold mb-2">
                  Postal Code
                </label>
                <input
                  onChange={updateForm}
                  className=" appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="text"
                  name="ZipCode"
                  placeholder="Postal Code"
                />
              </div>
            </div>
          </div>

          {/* Name: <input type="text" name="Name" onChange={updateForm} />
          <br />
          Address1: <input type="text" name="Address1" onChange={updateForm} />
          <br />
          Address2: <input type="text" name="Address2" onChange={updateForm} />
          <br />
          City: <input type="text" name="City" onChange={updateForm} />
          <br />
          Province: <input type="text" name="State" onChange={updateForm} />
          <br />
          Postalcode: <input type="text" name="ZipCode" onChange={updateForm} /> */}
        </form>
      </div>
    </div>
  );
}

// React component to render India specific form
function IndiaForm({ setFormData }) {
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
    <div className=" bg-gradient-to-b from-orange-400 to-green-500 items-center mt-6 px-10 py-5">
      <div>
        <form>
          <div className=" flex items-center justify-center space-x-2">
            <img src={IND} className=" h-8 w-8 rounded-full" />
            <h2 className=" uppercase tracking-wider font-medium">
              India Form
            </h2>
          </div>

          <div className=" mt-2 space-y-3">
            <div className="w-full px-3 mb-3">
              <label
                className="block uppercase tracking-wide text-black text-xs font-bold mb-2"
                for="grid-first-name"
              >
                Full Name
              </label>
              <input
                onChange={updateForm}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                type="text"
                name="Name"
                placeholder="Full Name"
              />
            </div>
            {/* address 01 02 */}
            <div className=" flex">
              <div className=" w-full px-3 mb-3">
                <label className=" block uppercase tracking-wide text-black text-xs font-bold mb-2">
                  Street Address
                </label>
                <input
                  onChange={updateForm}
                  className=" appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="text"
                  ame="Address1"
                  placeholder="Street Address"
                />
              </div>
              <div className=" w-full px-3 mb-3">
                <label className=" block uppercase tracking-wide text-black text-xs font-bold mb-2">
                  Address 02
                </label>
                <input
                  onChange={updateForm}
                  className=" appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="text"
                  name="Address2"
                  placeholder="Address Line 02"
                />
              </div>
            </div>

            {/* city state and zip */}
            <div className=" flex">
              <div className=" w-full px-3 mb-3">
                <label className=" block uppercase tracking-wide text-black text-xs font-bold mb-2">
                  City
                </label>
                <input
                  onChange={updateForm}
                  className=" appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="text"
                  name="City"
                  placeholder="City"
                />
              </div>
              <div className=" w-full px-3 mb-3">
                <label className=" block uppercase tracking-wide text-black text-xs font-bold mb-2">
                  State
                </label>
                <input
                  onChange={updateForm}
                  className=" appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="text"
                  name="State"
                  placeholder="State"
                />
              </div>
              <div className=" w-full px-3 mb-3">
                <label className=" block uppercase tracking-wide text-black text-xs font-bold mb-2">
                  Pin Code
                </label>
                <input
                  onChange={updateForm}
                  className=" appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="text"
                  name="ZipCode"
                  placeholder="Pin Code"
                />
              </div>
            </div>

            {/* Name: <input type="text" name="Name" onChange={updateForm} />
            <br />
            Street Address:{" "}
            <input type="text" name="Address1" onChange={updateForm} />
            <br />
            Address2:{" "}
            <input type="text" name="Address2" onChange={updateForm} />
            <br />
            City: <input type="text" name="City" onChange={updateForm} />
            <br />
            State: <input type="text" name="State" onChange={updateForm} />
            <br />
            Pincode: <input type="text" name="ZipCode" onChange={updateForm} />
            <br /> */}
          </div>
        </form>
      </div>
    </div>
  );
}

// React component to render default form
function DefaultForm({ setFormData }) {
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
    <div className=" bg-gray-100 items-center mt-6 px-10 py-5">
      <h2 className="uppercase tracking-wider font-medium text-center">
        Default Form
      </h2>

      <div className=" mt-2 space-y-3">
        <div className="w-full px-3 mb-3">
          <label
            className="block uppercase tracking-wide text-black text-xs font-bold mb-2"
            for="grid-first-name"
          >
            Full Name
          </label>
          <input
            onChange={updateForm}
            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            type="text"
            placeholder="Full Name"
          />
        </div>

        {/* address 01 02 */}
        <div className=" flex">
          <div className=" w-full px-3 mb-3">
            <label className=" block uppercase tracking-wide text-black text-xs font-bold mb-2">
              Address 01
            </label>
            <input
              onChange={updateForm}
              className=" appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="text"
              name="Address1"
              placeholder="Address Line 01"
            />
          </div>
          <div className=" w-full px-3 mb-3">
            <label className=" block uppercase tracking-wide text-black text-xs font-bold mb-2">
              Address 02
            </label>
            <input
              onChange={updateForm}
              className=" appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="text"
              name="Address2"
              placeholder="Address Line 02"
            />
          </div>
        </div>

        {/* city state and zip */}
        <div className=" flex">
          <div className=" w-full px-3 mb-3">
            <label className=" block uppercase tracking-wide text-black text-xs font-bold mb-2">
              City
            </label>
            <input
              onChange={updateForm}
              className=" appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="text"
              name="City"
              placeholder="City"
            />
          </div>
          <div className=" w-full px-3 mb-3">
            <label className=" block uppercase tracking-wide text-black text-xs font-bold mb-2">
              State
            </label>
            <input
              onChange={updateForm}
              className=" appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="text"
              name="State"
              placeholder="State"
            />
          </div>
          <div className=" w-full px-3 mb-3">
            <label className=" block uppercase tracking-wide text-black text-xs font-bold mb-2">
              Zip Code
            </label>
            <input
              onChange={updateForm}
              className=" appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="text"
              name="Zipcode"
              placeholder="Zip Code"
            />
          </div>
        </div>
      </div>
      {/* Name: <input type="text" name="Name" onChange={updateForm} />
      <br />
      Address1: <input type="text" name="Address1" onChange={updateForm} />
      <br />
      Address2: <input type="text" name="Address2" onChange={updateForm} />
      <br />
      City: <input type="text" name="City" onChange={updateForm} />
      <br />
      State: <input type="text" name="State" onChange={updateForm} />
      <br />
      ZipCode: <input type="text" name="Zipcode" onChange={updateForm} />
      <br /> */}
    </div>
  );
}

export default App;
