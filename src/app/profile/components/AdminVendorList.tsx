/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect } from "react";
import { Button, Table, message } from "antd";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/navigation";

function AdminVendorList() {
  const router = useRouter();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = React.useState<boolean>(false);
  const [selectedVendor, setSelectedVendor] = React.useState<any>(null); // [1]
  const [vendors, setVendors] = React.useState([]);

  const getVendors = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/vendors");
      setVendors(response.data.data);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVendors();
  }, []);

  const deleteVendor = async (vendorId: string) => {
    try {
      setDeleteLoading(true);
      await axios.delete(`/api/vendors/${vendorId}`);
      message.success("Vendor deleted successfully");
      getVendors();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      render: (createdBy: any) => createdBy.name,
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
              type="default"
              className="btn-small"
              onClick={() => {
                setSelectedVendor(params);
                deleteVendor(params._id);
              }}
              loading={deleteLoading && selectedVendor?._id === params._id}
            >
              Delete
            </Button>
            <Button
              type="primary"
              className="btn-small"
              onClick={() => {
                router.push(`/profile/edit_vendor/${params._id}`);
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
          onClick={() => router.push("/profile/add_vendor")}
        >
          Add Vendor
        </Button>
      </div>

      <div className="mt-5">
        <Table
          columns={columns}
          dataSource={vendors}
          loading={loading}
          pagination={false}
        />
      </div>
    </div>
  );
}

export default AdminVendorList;
