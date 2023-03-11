import React, { useState, useRef } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableFooter from "@mui/material/TableFooter";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import USAForm from "./components/UsaForm";
import JapanForm from "./components/JapanForm";
import CanadaForm from "./components/CanadaForm";
import IndiaForm from "./components/IndiaForm";
import DefaultForm from "./components/DefaultForm";
import MexicoForm from "./components/MexicoForm";

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
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  // Set of Counries under consideration
  const countries = [
    { name: "Default" },
    { name: "United States of America" },
    { name: "Japan" },
    { name: "India" },
    { name: "Mexico" },
    { name: "Canada" },
  ];

  // Function to render form based on Countries
  function renderForm() {
    if (countryList.length === 1) {
      console.log(countryList);
      if (countryList.includes("United States of America"))
        return <USAForm setFormData={setFormData} formRefs={formRefs}/>;
      else if (countryList.includes("India"))
        return <IndiaForm setFormData={setFormData} formRefs={formRefs}/>;
      else if (countryList.includes("Japan"))
        return <JapanForm setFormData={setFormData} formRefs={formRefs}/>;
      else if (countryList.includes("Mexico"))
        return <MexicoForm setFormData={setFormData} formRefs={formRefs}/>;
      else if (countryList.includes("Canada"))
        return <CanadaForm setFormData={setFormData} />;
      else return <DefaultForm setFormData={setFormData} formRefs={formRefs}/>;
    }
    // Renders form for multiple selected countries
    else {
      return <DefaultForm setFormData={setFormData} formRefs={formRefs}/>;
    }
  }

  // Handles selected country and set ths
  function handleSelectedCountry(event) {
    const selectedOptions = Array.from(event.target.selectedOptions);
    const selectedValues = selectedOptions.map((option) => option.value);
    setCountryList(selectedValues);
  }

  const formRefs = {
    nameRef: useRef(),
    address1Ref: useRef(),
    address2Ref: useRef(),
    cityRef: useRef(),
    stateRef: useRef(),
    zipcodeRef: useRef(),
    // add more refs as needed
  };

  // Keep country selected by reset the fields for new search
  function Reset()
  {
    setFormData({});
    setCountryList(countryList);
    Object.values(formRefs).forEach((ref) => {
      if (ref && ref.current) {
        ref.current.value = '';
      }
    });
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
    Reset();
  }

  // Give all the options of countries to user for selection
  return (
    <div className=" items-center justify-between min-h-screen  ">
      <div className="  py-10 flex flex-col items-center border-2 border-black">
        <h1 className=" uppercase tracking-widest font-bold text-xl underline">
          Authentic Address
        </h1>
        <p className=" text-gray-400 text-sm">
          Welcome to Authentic Address, an address validator
        </p>

        {/* select countries */}
        <div className=" mt-5">
          <select
            className=" p-5 outline-none focus:outline-none"
            multiple
            value={countryList}
            onChange={handleSelectedCountry}
          >
            {countries.map((country) => (
              <option
                className=" cursor-pointer uppercase tracking-widest p-2 hover:bg-gray-300 m-3"
                key={country.name}
                value={country.name}
              >
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {renderForm()}

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
              <h1 className=" text-center uppercase font-bold tracking-widest">
                Results
              </h1>
            </div>
            <TableContainer sx={{ minHeight: 500 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell
                      sx={{ fontWeight: "fontWeightBold", textAlign: "left" }}
                    >
                      Name
                    </StyledTableCell>
                    {countryList.includes("India") ? (
                      <StyledTableCell
                        sx={{ fontWeight: "fontWeightBold", textAlign: "left" }}
                      >
                        Street Address
                      </StyledTableCell>
                    ) : (
                      <StyledTableCell
                        sx={{ fontWeight: "fontWeightBold", textAlign: "left" }}
                      >
                        Address 01
                      </StyledTableCell>
                    )}
                    {countryList.includes("Mexico") ?null: (
                    <StyledTableCell
                      sx={{ fontWeight: "fontWeightBold", textAlign: "left" }}
                    >
                      Address 02
                    </StyledTableCell>
                    )}
                    <StyledTableCell
                      sx={{ fontWeight: "fontWeightBold", textAlign: "left" }}
                    >
                      City
                    </StyledTableCell>

                    {countryList.includes("Canada") ? (
                      <StyledTableCell
                        sx={{ fontWeight: "fontWeightBold", textAlign: "left" }}
                      >
                        Province
                      </StyledTableCell>
                    ) : countryList.includes("Japan") ? null : (
                      <StyledTableCell
                        sx={{ fontWeight: "fontWeightBold", textAlign: "left" }}
                      >
                        State
                      </StyledTableCell>
                    )}

                    {countryList.includes("India") ? (
                      <StyledTableCell
                        sx={{ fontWeight: "fontWeightBold", textAlign: "left" }}
                      >
                        Pin Code
                      </StyledTableCell>
                    ) : (
                      <StyledTableCell
                        sx={{ fontWeight: "fontWeightBold", textAlign: "left" }}
                      >
                        Zip Code
                      </StyledTableCell>
                    )}
                    <StyledTableCell
                      sx={{ fontWeight: "fontWeightBold", textAlign: "center" }}
                    >
                      Country
                    </StyledTableCell>
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
                      <StyledTableCell sx={{ textAlign: "left" }}>
                        {address.Name}
                      </StyledTableCell>
                      <StyledTableCell sx={{ textAlign: "left" }}>
                        {address.Address1}
                      </StyledTableCell>
                       {countryList.includes("Mexico") ?null: (
                      <StyledTableCell sx={{ textAlign: "left" }}>
                        {address.Address2}
                      </StyledTableCell>
                      )}
                      <StyledTableCell>{address.City}</StyledTableCell>
                      {countryList.includes("Japan") ?null: (
                      <StyledTableCell>{address.State}</StyledTableCell>
                      )}
                      <StyledTableCell>{address.ZipCode}</StyledTableCell>
                      <StyledTableCell sx={{ textAlign: "center" }}>
                        {address.Country}
                      </StyledTableCell>
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

<>
  <USAForm />
  <JapanForm />
  <CanadaForm />
  <IndiaForm />
  <MexicoForm />
  <DefaultForm />
</>;

export default App;
