"use client";
import React from "react";
import VendorForm from "../components/VendorForm";
import axios from "axios";
import { message } from "antd";
import { useRouter } from "next/navigation";

function AddVendor() {
  const [loading = false, setLoading] = React.useState<boolean>(false);
  const router = useRouter();
  const onSave = async (values: any) => {
    try {
      setLoading(true);
      await axios.post("/api/vendors", values);
      message.success("Vendor created successfully");
      router.push("/profile?id=1");
    } catch (error: any) {
      message.error(error.message || error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Add Vendor</h1>
      <hr />

      <VendorForm
        loading={loading}
        onSave={onSave}
      />
    </div>
  );
}

export default AddVendor;
