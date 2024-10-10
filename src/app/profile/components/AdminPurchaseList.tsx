/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect } from "react";
import { Button, Table, message } from "antd";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/navigation";

function AdminPurchaseList() {
  const router = useRouter();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = React.useState<boolean>(false);
  const [selectedPurchase, setSelectedPurchase] = React.useState<any>(null); // [1]
  const [purchases, setPurchases] = React.useState([]);

  const getPurchases = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/purchases");
      setPurchases(response.data.data);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPurchases();
  }, []);

  const deletePurchase = async (purchaseId: string) => {
    try {
      setDeleteLoading(true);
      await axios.delete(`/api/purchases/${purchaseId}`);
      message.success("Purchase deleted successfully");
      getPurchases();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    {
      title: "Purchase Id",
      dataIndex: "_id",
    },
    {
      title: "Purchased By",
      dataIndex: ["purchasedBy","name"],
    },
    {
      title: "Vendor",
      dataIndex: ["vendor","name"],
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
    },
    
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (createdAt: any) =>
        moment(createdAt).format("DD MMM YYYY hh:mm A"),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (action: any, params: any) => {
        return (
          <div className="flex gap-3 items-center">
            <Button
              type="primary"
              className="btn-small"
              onClick={() => {
                router.push(`/profile/edit_purchase/${params._id}`);
              }}
            >
              Edit
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex justify-end">
        <Button
          type="primary"
          onClick={() => router.push("/profile/purchase_item")}
        >
          Purchase Item
        </Button>
      </div>

      <div className="mt-5">
        <Table
          columns={columns}
          dataSource={purchases}
          loading={loading}
          pagination={false}
        />
      </div>
    </div>
  );
}

export default AdminPurchaseList;
