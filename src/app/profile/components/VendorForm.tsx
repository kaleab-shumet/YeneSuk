/* eslint-disable @next/next/no-img-element */
import { getAntdFieldRequiredRule } from "@/helpers/validations";
import { Button, Form } from "antd";
import React from "react";
import { useRouter } from "next/navigation";

function VendorForm({ loading, initialValues, onSave }: VendorFormProps) {
  const router = useRouter();

  return (
    <div>
      <Form
        layout="vertical"
        className="mt-10 flex flex-col xl:grid grid-cols-3 gap-5"
        onFinish={onSave}
        initialValues={initialValues}
      >
        <div className="col-span-3">
          <Form.Item
            label="Name"
            name="name"
            rules={getAntdFieldRequiredRule("Name is required")}
          >
            <input />
          </Form.Item>
        </div>
        <div className="col-span-3">
          <Form.Item
            label="Email"
            name="email"
            rules={getAntdFieldRequiredRule("Email is required")}
          >
            <input type="email" />
          </Form.Item>
        </div>

        <Form.Item
          label="Phone"
          name="phone"
          rules={getAntdFieldRequiredRule("Phone is required")}
        >
          <input type="tel" />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={getAntdFieldRequiredRule("Address is required")}
        >
          <input />
        </Form.Item>        

        <div className="col-span-3 justify-end flex gap-5">
          <Button onClick={() => router.back()}>Back</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default VendorForm;

interface VendorFormProps {
  loading: boolean;
  onSave: any;
  initialValues?: any;
}
