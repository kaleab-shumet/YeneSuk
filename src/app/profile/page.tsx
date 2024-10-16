"use client";
import React from "react";
import { Tabs } from "antd";
import { useSelector } from "react-redux";
import CategoriesList from "./components/CategoriesList";
import { useRouter, useSearchParams } from "next/navigation";
import ProductsList from "./components/ProductsList";
import UsersOrdersList from "./components/UsersOrdersList";
import AdminOrdersList from "./components/AdminOrdersList";
import AdminPurchaseList from "./components/AdminPurchaseList";
import AdminVendorList from "./components/AdminVendorList";
import PersonalInfo from "./components/PersonalInfo";
import UsersList from "./components/UsersList";
import AdminDashboard from "./components/AdminDashboard";

function Profile() {
  const { currentUser } = useSelector((state: any) => state.user);
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "1";
  const [selectedTab, setSelectedTab] = React.useState(id);
  const router = useRouter();

  return (
    <div>
      {currentUser.isAdmin && (
        <Tabs
          defaultActiveKey="1"
          onChange={(key) => {
            router.push(`/profile?id=${key}`);
            setSelectedTab(key);
          }}
          activeKey={selectedTab}
        >
          <Tabs.TabPane tab="Dashboard" key="0">
            <AdminDashboard />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Orders" key="1">
            <AdminOrdersList />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Products" key="2">
            <ProductsList />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Purchases" key="3">
            <AdminPurchaseList />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Vendors" key="4">
            <AdminVendorList />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Categories" key="5">
            <CategoriesList />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Users" key="6">
            <UsersList />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Personal Information" key="7">
            <PersonalInfo />
          </Tabs.TabPane>
        </Tabs>
      )}
      {!currentUser.isAdmin && (
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Orders" key="1">
            <UsersOrdersList />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Personal Information" key="2">
            <PersonalInfo />
          </Tabs.TabPane>
        </Tabs>
      )}
    </div>
  );
}

export default Profile;
