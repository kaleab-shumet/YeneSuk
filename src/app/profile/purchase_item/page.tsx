"use client";
import React from "react";
import PurchaseForm from "../components/PurchaseForm";
import axios from "axios";
import { message } from "antd";
import { useRouter } from "next/navigation";

function PurchaseItem() {
  const [loading = false, setLoading] = React.useState<boolean>(false);
  const router = useRouter();

  
  const onSave = async (values: any) => {
    try {

      console.log(values);
      

      return
      setLoading(true);
      await axios.post("/api/purchases", values);
      message.success("Purchase created successfully");
      router.push("/profile?id=1");
    } catch (error: any) {
      message.error(error.message || error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Purchase Items</h1>
      <hr />

      <PurchaseForm />
    </div>
  );
}

export default PurchaseItem;
