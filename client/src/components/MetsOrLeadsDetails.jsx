import React, { useState, useRef } from "react";
import axios from "axios";
import { uploadImageToCloudinary } from "../hooks/uploadImage"; // compress + upload

const MetsOrLeadsDetails = () => {
  const [form, setForm] = useState({
    dateTime: "",
    name: "",
    eCode: "",
    customerName: "",
    dob: "",
    contactNo: "",
    force: "",
    bn: "",
    comp: "",
    plan: "",
    premium: "",
    clientNeeds: "",
    clientRemark: "",
    yourRemark: "",
    customerImage: "",
    latitude: "",
    longitude: "",
  });

  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openCamera = () => {
    fileInputRef.current.click();
  };

  const handleImageCapture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const imageUrl = await uploadImageToCloudinary(file);
      setForm((prev) => ({ ...prev, customerImage: imageUrl }));
    } catch (err) {
      console.error(err);
      alert("Image upload failed!");
    } finally {
      setImageUploading(false);
    }
  };

  const validateForm = () => {
    const requiredFields = [
      "dateTime",
      "name",
      "eCode",
      "customerName",
      "dob",
      "contactNo",
      "force",
      "bn",
      "comp",
      "plan",
      "premium",
      "clientNeeds",
      "clientRemark",
      "yourRemark",
    ];

    for (let field of requiredFields) {
      if (!form[field] || form[field].trim() === "") {
        alert(`Please fill the ${field.replace(/([A-Z])/g, " $1")}`);
        return false;
      }
    }

    if (!/^\d{10}$/.test(form.contactNo)) {
      alert("Contact number must be a valid 10-digit number");
      return false;
    }

    if (isNaN(form.premium) || Number(form.premium) < 0) {
      alert("Premium must be a valid positive number");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          const formWithLocation = {
            ...form,
            latitude,
            longitude,
          };

          await axios.post(
            "https://mets-or-leads-details.onrender.com/api/customers",
            formWithLocation
          );

          alert("Data saved successfully!");
          setForm({
            dateTime: "",
            name: "",
            eCode: "",
            customerName: "",
            dob: "",
            contactNo: "",
            force: "",
            bn: "",
            comp: "",
            plan: "",
            premium: "",
            clientNeeds: "",
            clientRemark: "",
            yourRemark: "",
            customerImage: "",
            latitude: "",
            longitude: "",
          });
        } catch (error) {
          console.error(error);
          alert("Failed to save data.");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to fetch location. Please enable GPS.");
        setLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
          Mets or Leads Details
        </h2>

        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Date & Time */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Date & Time
            </label>
            <input
              type="datetime-local"
              name="dateTime"
              value={form.dateTime}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-3 w-full"
              placeholder="Select Date & Time"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter Name"
              className="border border-gray-300 rounded-lg p-3 w-full"
            />
          </div>

          {/* E Code */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              ETC Code
            </label>
            <input
              name="eCode"
              value={form.eCode}
              onChange={handleChange}
              placeholder="Enter ETC Code"
              className="border border-gray-300 rounded-lg p-3 w-full"
            />
          </div>

          {/* Customer Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Customer Name
            </label>
            <input
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              placeholder="Enter Customer Name"
              className="border border-gray-300 rounded-lg p-3 w-full"
            />
          </div>

          {/* DOB */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-3 w-full"
              placeholder="Select DOB"
            />
          </div>

          {/* Contact No */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Contact No
            </label>
            <input
              name="contactNo"
              value={form.contactNo}
              onChange={handleChange}
              placeholder="Enter Contact Number"
              className="border border-gray-300 rounded-lg p-3 w-full"
            />
          </div>

          {/* Force */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Force
            </label>
            <input
              name="force"
              value={form.force}
              onChange={handleChange}
              placeholder="Enter Force"
              className="border border-gray-300 rounded-lg p-3 w-full"
            />
          </div>

          {/* BN */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">BN</label>
            <input
              name="bn"
              value={form.bn}
              onChange={handleChange}
              placeholder="Enter BN"
              className="border border-gray-300 rounded-lg p-3 w-full"
            />
          </div>

          {/* Comp */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Comp
            </label>
            <input
              name="comp"
              value={form.comp}
              onChange={handleChange}
              placeholder="Enter Comp"
              className="border border-gray-300 rounded-lg p-3 w-full"
            />
          </div>

          {/* Plan */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Plan
            </label>
            <input
              name="plan"
              value={form.plan}
              onChange={handleChange}
              placeholder="Enter Plan"
              className="border border-gray-300 rounded-lg p-3 w-full"
            />
          </div>

          {/* Premium */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Premium
            </label>
            <input
              name="premium"
              value={form.premium}
              onChange={handleChange}
              placeholder="Enter Premium"
              className="border border-gray-300 rounded-lg p-3 w-full"
            />
          </div>

          {/* Clients Needs */}
          <div className="col-span-full">
            <label className="block text-gray-700 font-semibold mb-1">
              Clients Needs / Requirements
            </label>
            <textarea
              name="clientNeeds"
              value={form.clientNeeds}
              onChange={handleChange}
              placeholder="Why above plan? Explain..."
              className="border border-gray-300 rounded-lg p-3 w-full"
            />
          </div>

          {/* Client Remark */}
          <div className="col-span-full">
            <label className="block text-gray-700 font-semibold mb-1">
              Clients Remark
            </label>
            <textarea
              name="clientRemark"
              value={form.clientRemark}
              onChange={handleChange}
              placeholder="Enter Client Remark"
              className="border border-gray-300 rounded-lg p-3 w-full"
            />
          </div>

          {/* Your Remark */}
          <div className="col-span-full">
            <label className="block text-gray-700 font-semibold mb-1">
              Your Remark
            </label>
            <textarea
              name="yourRemark"
              value={form.yourRemark}
              onChange={handleChange}
              placeholder="Enter Your Remark"
              className="border border-gray-300 rounded-lg p-3 w-full"
            />
          </div>

          {/* Camera Capture */}
          <div className="col-span-full">
            <label className="block text-gray-700 font-semibold mb-2">
              Capture Customer Image
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: "none" }}
              onChange={handleImageCapture}
            />
            <button
              type="button"
              onClick={openCamera}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow"
              disabled={imageUploading}
            >
              📷 {imageUploading ? "Uploading..." : "Capture Image"}
            </button>

            {form.customerImage && !imageUploading && (
              <img
                src={form.customerImage}
                alt="Customer"
                className="mt-2 w-32 h-32 object-cover rounded-lg shadow"
              />
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleSave}
            disabled={loading || imageUploading}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl shadow-lg flex items-center justify-center"
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                ></path>
              </svg>
            )}
            {loading ? "Saving..." : "💾 Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetsOrLeadsDetails;
