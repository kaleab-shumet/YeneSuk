import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
import axios from "axios";

const { Option } = Select;

interface Item {
  productId: string;
  purchasingPrice: number;
  sellingPrice: number;
  quantity: number;
}

interface ProductOption {
  id: string;
  name: string;
}
const PurchaseForm = ({ loading, onSave }: PurchaseFormProps) => {
  const optionsData = [
    { id: "1", name: "Product A" },
    { id: "2", name: "Product B" },
    { id: "3", name: "Product C" },
  ];

  const [items, setItems] = useState<Item[]>([
    {
      productId: "",
      purchasingPrice: 0,
      sellingPrice: 0,
      quantity: 0,
    },
  ]);

  const [productOptions, setProductOptions] =
    useState<ProductOption[]>(optionsData);

  const [excludeItems, setExcludeItems] = useState<string[]>([]);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        productId: "",
        purchasingPrice: 0,
        sellingPrice: 0,
        quantity: 0,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setExcludeItems((prevItems) => [
      ...prevItems.filter((e) => e != items[index].productId),
    ]);
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleInputChange = (
    index: number,
    field: keyof Item,
    value: string | number
  ) => {
    const newItems: any = [...items];
    newItems[index][field] = value as any; // Cast to any to bypass TypeScript error
    setItems(newItems);
  };

  const handleDropdownChange = (index: number, productId: string) => {
    const newItems = [...items];
    newItems[index].productId = productId;
    setItems(newItems);
  };

  const handleSearch = async (query: string) => {
    setProductOptions(optionsData.filter((e) => e.name.includes(query)));
  };

  const handleChange = (pid: string, index: number) => {
    if (excludeItems.includes(pid)) {
      message.info("Product already selected");
      return;
    }

    setExcludeItems((prevItems) => [
      ...prevItems.filter((e) => e != items[index].productId),
      pid,
    ]);

    handleDropdownChange(index, pid);
  };

  return (
    <Form onFinish={onSave} layout="vertical">
      <div className="flex p-3">
        <Form.Item label="Vendor" className="flex-1 me-9">
          {/*  <Select
            className="w-full"
            showSearch
            onSearch={handleSearch}
            placeholder="Select a Vendor"
            // value={item.productId}
            // onChange={(val) => handleChange(val, index)}
            filterOption={false}
            onClick={onSelectClicked}
            loading={isLoading}
          >
            {vendorOptions.map((option) => (
              <Option key={option.id} value={option.id}>
                {option.name}
              </Option>
            ))}
          </Select> */}
        </Form.Item>

        <div className="flex-2 flex-col items-end content-end">
          <Button type="primary" onClick={handleAddItem}>
            Add Item
          </Button>
        </div>
      </div>

      {items.map((item, index) => (
        <div
          key={index}
          className="flex space-x-2 p-3 m-1"
          style={{ border: "1px solid grey" }}
        >
          <Form.Item className="flex-1" label="Product">
            <Select
              className="w-full"
              showSearch
              onSearch={handleSearch}
              placeholder="Select a product"
              value={item.productId}
              onChange={(val) => handleChange(val, index)}
              filterOption={false}
            >
              {productOptions.map((option) => (
                <Option key={option.id} value={option.id}>
                  {option.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item className="flex-1" label="Purchasing Price">
            <Input
              placeholder="Purchasing Price"
              type="number"
              value={item.purchasingPrice}
              onChange={(e) =>
                handleInputChange(
                  index,
                  "purchasingPrice",
                  parseFloat(e.target.value)
                )
              }
            />
          </Form.Item>
          <Form.Item className="flex-1" label="Selling Price">
            <Input
              placeholder="Selling Price"
              type="number"
              value={item.sellingPrice}
              onChange={(e) =>
                handleInputChange(
                  index,
                  "sellingPrice",
                  parseFloat(e.target.value)
                )
              }
            />
          </Form.Item>
          <Form.Item className="flex-1" label="Selling Price">
            <Input
              placeholder="Quantity"
              type="number"
              value={item.quantity}
              onChange={(e) =>
                handleInputChange(index, "quantity", parseInt(e.target.value))
              }
            />
          </Form.Item>
          <Button onClick={() => handleRemoveItem(index)}>Remove</Button>
        </div>
      ))}
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PurchaseForm;

interface PurchaseFormProps {
  loading: boolean;
  onSave: any;
}
