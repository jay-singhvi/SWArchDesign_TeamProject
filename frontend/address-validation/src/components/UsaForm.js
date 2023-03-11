import React, { useState } from "react";
import USA from "../assets/images/usa.png";
import usaStates from "../assets/data/usaStates.json";


function USAForm({ setFormData, formRefs }) {
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
                  name="Name"
                  ref={formRefs.nameRef}
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
                    ref={formRefs.address1Ref}
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
                    ref={formRefs.address2Ref}
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
                    ref={formRefs.cityRef}
                  />
                </div>
                <div className=" w-full px-3 mb-3">
                  <label className=" block uppercase tracking-wide text-black text-xs font-bold mb-2">
                    State
                  </label>
                  {/*
                  <input
                    onChange={updateForm}
                    className=" appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="text"
                    name="State"
                    placeholder="State"
                  />
                  */}
                  <select
                    name="State"
                    onChange={updateForm}
                    className=" appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  >
                    <option value="">Select a state</option>
                    {usaStates.map((state) => (
                      <option key={state.name} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className=" w-full px-3 mb-3">
                  <label className=" block uppercase tracking-wide text-black text-xs font-bold mb-2">
                    Zip Code
                  </label>
                  <input
                    onChange={updateForm}
                    className=" appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="text"
                    name="ZipCode"
                    placeholder="Zip Code"
                    ref={formRefs.zipcodeRefs}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
}

export default USAForm