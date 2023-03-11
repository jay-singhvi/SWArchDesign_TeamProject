import React, { useState } from "react";
import IND from "../assets/images/india.png";
import indiaStates from "../assets/data/indianStates.json";

function IndiaForm({ setFormData, formRefs }) {
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
                  ref={formRefs.nameRef}
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
                    {indiaStates.map((state) => (
                      <option key={state.name} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </select>
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
            </div>
          </form>
        </div>
      </div>
    );
  }

export default IndiaForm