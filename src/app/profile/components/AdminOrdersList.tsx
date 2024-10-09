import React, { useEffect } from "react";
import axios from "axios";
import { Table, message } from "antd";
import moment from "moment";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { showConfirm } from "./ConfirmDialog";

function AdminOrdersList() {
  const router = useRouter();
  const [loading = false, setLoading] = React.useState<boolean>(false);
  const [statusUpdateLoading = false, setStatusUpdateLoading] =
    React.useState<boolean>(false);
  const [orders = [], setOrders] = React.useState([]);

  const orderStatusList = ["created", "completed", "cancelled"];

  const getOrders = async () => {
    try {
      setLoading(true);
      const endPoint = `/api/orders`;
      const response = await axios.get(endPoint);
      console.log(response.data);
      setOrders(response.data);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onStatusUpdate = async (orderId: string, status: string) => {
    try {
      let uConfirm = true;
      if (status == "cancelled") {
        uConfirm = await showConfirm(
          "Cancel Order",
          "Are you sure you want to cancel this order ?"
        );
      }

      if (!uConfirm) return;
      setStatusUpdateLoading(true);
      const endPoint = `/api/orders/${orderId}`;
      await axios.put(endPoint, { orderStatus: status });
      message.success("Order status updated successfully");
      getOrders();
    } catch (error: any) {
      message.error(error.response.data.message);
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
    },
    {
      title: "User",
      dataIndex: "user",
      render: (user: any) => user.name,
    },
    {
      title: "Placed On",
      dataIndex: "createdAt",
      render: (date: string) => moment(date).format("DD MMM YYYY hh:mm a"),
    },
    {
      title: "Total",
      dataIndex: "total",
    },
    {
      title: "Status",
      dataIndex: "orderStatus",
      render: (status: string, record: any) => (
        <div>
          <select
            value={status}
            onChange={(e) => {
              onStatusUpdate(record._id, e.target.value);
            }}
            disabled={status === "cancelled" ? true : false}
          >
            {status !== "created"
              ? orderStatusList
                  .filter((i) => i !== "created")
                  .map((os) => <option value={os}>{os}</option>)
              : orderStatusList.map((os) => <option value={os}>{os}</option>)}
          </select>
        </div>
      ),
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
      render: (status: string) => status.toUpperCase(),
    },
    {
      title: "Action",
      render: (record: any) => (
        <div className="flex gap-5">
          <span
            className="underline cursor-pointer"
            onClick={() => {
              router.push(`/profile/orders/${record._id}`);
            }}
          >
            View
          </span>
        </div>
      ),
    },
  ];
  return (
    <div>
      {statusUpdateLoading && <Loader />}
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="_id"
        loading={loading}
        pagination={false}
      />
    </div>
  );
}

export default AdminOrdersList;
