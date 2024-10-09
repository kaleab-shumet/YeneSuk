"use client";
import React from "react";
import axios from "axios";
import { message } from "antd";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import VendorForm from "../../components/VendorForm";

function EditVendor({ params }: { params: any }) {
  const [loading = false, setLoading] = React.useState<boolean>(false);
  const [loadingVendor = false, setLoadingVendor] =
    React.useState<boolean>(false);
  const [vendor = {}, setVendor] = React.useState<any>(null);
  const router = useRouter();
  const onSave = async (values: any) => {
    try {
      setLoading(true);
      await axios.put(`/api/vendors/${params.vendorId}`, values);
      message.success("Vendor updated successfully");
      router.refresh();
      router.back();
    } catch (error: any) {
      message.error(error.message || error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const getVendor = async () => {
    try {
      setLoadingVendor(true);
      const response = await axios.get(`/api/vendors/${params.vendorId}`);
      setVendor(response.data);
    } catch (error: any) {
      message.error(error.message || error.response.data.message);
    } finally {
      setLoadingVendor(false);
    }
  };

  React.useEffect(() => {
    getVendor();
  }, []);
  return (
    <div>
      {loadingVendor && <Loader />}
      <h1 className="text-2xl font-bold text-gray-800">Edit Vendor</h1>
      <hr />

      {vendor && (
        <VendorForm loading={loading} onSave={onSave} initialValues={vendor} />
      )}
    </div>
  );
}

export default EditVendor;
