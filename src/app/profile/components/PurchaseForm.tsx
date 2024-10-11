"use client";
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation"; // For app directory

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

interface VendorOption {
  id: string;
  name: string;
}

interface PurchaseFormProps {
  purchaseId?: string;
}

const PurchaseForm: React.FC<PurchaseFormProps> = ({ purchaseId }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
  const [vendorOptions, setVendorOptions] = useState<VendorOption[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(false);

  const handleProductSearch = async (query: string) => {
    const optionsData = await fetchOptionsData("/api/products?search=", query);
    setProductOptions(optionsData);
  };

  const handleVendorSearch = async (query: string) => {
    const optionsData = await fetchOptionsData("/api/vendors?search=", query);
    setVendorOptions(optionsData);
  };

  const handleProductChange = (pid: string, index: number) => {
    if (isReadOnly) return;

    const currentItems = form.getFieldValue("items") || [];
    const oldProductId = currentItems[index]?.productId;

    setSelectedProducts((prevSelected) => {
      const newSelected = prevSelected.filter((id) => id !== oldProductId);
      return [...newSelected, pid];
    });

    form.setFieldsValue({
      items: currentItems.map((item: Item, i: number) =>
        i === index ? { ...item, productId: pid } : item
      ),
    });

    calculateTotalAmount();
  };

  const fetchOptionsData = async (apiUrl: string, query: string) => {
    setIsLoading(true);

    try {
      const res = await axios.get(apiUrl + query);
      setIsLoading(false);
      return res.data.data.map((e: any) => ({ id: e._id, name: e.name }));
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      return [];
    }
  };

  const handleFormSubmit = async (values: any) => {
    if (isReadOnly) return;

    setSubmitLoading(true);
    const data = { vendorId: values.vendorId, items: values.items };
    try {
      const purchaseResponse = await axios.post("/api/purchases", data);
      message.success(purchaseResponse.data.message);
      router.push("/profile?id=3");
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(error.response.data.message);
      } else {
        message.error("An error occurred while saving the purchase");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const fetchPurchaseData = async () => {
    try {
      const response = await axios.get(`/api/purchases/${purchaseId}`);
      const purchaseData = response.data;

      console.log("purchaseData", purchaseData);

      const optionVendor: VendorOption = {
        id: purchaseData.vendor._id,
        name: purchaseData.vendor.name,
      };

      setVendorOptions([optionVendor]);

      const optionsProduct: ProductOption[] = purchaseData.items.map(
        (item: any) => ({
          id: item.product._id,
          name: item.product.name,
        })
      );

      setProductOptions(optionsProduct);

      const formValues = {
        vendorId: purchaseData.vendor._id,
        items: purchaseData.items.map((item: any) => ({
          productId: item.product._id,
          purchasingPrice: item.purchasingPrice,
          sellingPrice: item.sellingPrice,
          quantity: item.quantity,
        })),
      };

      form.setFieldsValue(formValues);

      setSelectedProducts(
        purchaseData.items.map((item: any) => item.product._id)
      );

      calculateTotalAmount();
    } catch (error) {
      console.error("Error fetching purchase data:", error);
      message.error("Failed to load purchase data");
    }
  };

  const calculateTotalAmount = () => {
    const items = form.getFieldValue("items") || [];
    const total = items.reduce((sum: number, item: Item) => {
      return sum + (item.purchasingPrice || 0) * (item.quantity || 0);
    }, 0);
    setTotalAmount(total);
  };

  useEffect(() => {
    if (purchaseId) {
      setIsReadOnly(true);
      fetchPurchaseData();
    } else {
      handleProductSearch("");
      handleVendorSearch("");
      setIsReadOnly(false);
      form.setFieldsValue({ items: [{}] });
      setTotalAmount(0);
    }
  }, [purchaseId]);

  useEffect(() => {
    form.setFields([{ name: "items", touched: false }]);
    calculateTotalAmount();
  }, [form.getFieldValue("items")]);

  return (
    <Form form={form} onFinish={handleFormSubmit} layout="vertical">
      <div className="flex p-3">
        <Form.Item
          name="vendorId"
          label="Vendor"
          className="flex-1 me-9"
          rules={[{ required: true, message: "Vendor is required" }]}
        >
          <Select
            className="w-full"
            showSearch
            onSearch={handleVendorSearch}
            placeholder="Select a Vendor"
            filterOption={false}
            loading={isLoading}
            allowClear
            onClick={() => handleVendorSearch("")}
            disabled={isReadOnly}
            style={{
              backgroundColor: 'white', // Matches normal background
              color: '#4a5568', // Tailwind's gray-800
              border: '1px solid #cbd5e0', // Tailwind's gray-300
              cursor: 'default', // Indicate non-interactivity
            }}
          >
            {vendorOptions.map((option) => (
              <Option key={option.id} value={option.id}>
                {option.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {!isReadOnly && (
          <div className="flex-2 flex-col items-end content-end">
            <Button
              type="primary"
              onClick={() => {
                const items = form.getFieldValue("items") || [];
                form.setFieldsValue({ items: [...items, {}] });
              }}
            >
              Add Item
            </Button>
          </div>
        )}
      </div>

      <Form.List
        name="items"
        rules={[
          {
            validator: async (_, items) => {
              if (!items || items.length === 0) {
                return Promise.reject(
                  new Error("At least one item is required")
                );
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <div
                key={field.key}
                className="flex space-x-2 p-3 m-1 items-end"
                style={{ border: "1px solid grey" }}
              >
                <Form.Item
                  {...field}
                  name={[field.name, "productId"]}
                  className="flex-1"
                  label="Product"
                  rules={[{ required: true, message: "Product is required" }]}
                >
                  <Select
                    className="w-full"
                    showSearch
                    onSearch={handleProductSearch}
                    placeholder="Select a product"
                    filterOption={false}
                    loading={isLoading}
                    onClick={() => handleProductSearch("")}
                    onChange={(val) => handleProductChange(val, index)}
                    allowClear
                    disabled={isReadOnly}
                  >
                    {productOptions
                      .filter(
                        (option) =>
                          !selectedProducts.includes(option.id) ||
                          option.id ===
                            form.getFieldValue(["items", index, "productId"])
                      )
                      .map((option) => (
                        <Option key={option.id} value={option.id}>
                          {option.name}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  {...field}
                  name={[field.name, "purchasingPrice"]}
                  className="flex-1"
                  label="Purchasing Price"
                  rules={[
                    { required: true, message: "Purchasing Price is required" },
                    {
                      validator: (_, value) => {
                        const num = parseFloat(value);
                        if (isNaN(num) || num <= 0) {
                          return Promise.reject(
                            "Purchasing Price must be greater than 0"
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Purchasing Price"
                    onChange={() => calculateTotalAmount()}
                    readOnly={isReadOnly}
                  />
                </Form.Item>

                <Form.Item
                  {...field}
                  name={[field.name, "sellingPrice"]}
                  className="flex-1"
                  label="Selling Price(Inc.VAT)"
                  rules={[
                    { required: true, message: "Selling Price is required" },
                    {
                      validator: (_, value) => {
                        const num = parseFloat(value);
                        if (isNaN(num) || num <= 0) {
                          return Promise.reject(
                            "Selling Price must be greater than 0"
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Selling Price"
                    readOnly={isReadOnly}
                  />
                </Form.Item>

                <Form.Item
                  {...field}
                  name={[field.name, "quantity"]}
                  className="flex-1"
                  label="Quantity"
                  rules={[
                    { required: true, message: "Quantity is required" },
                    {
                      validator: (_, value) => {
                        const num = parseInt(value, 10);
                        if (isNaN(num) || num <= 0) {
                          return Promise.reject(
                            "Quantity must be greater than 0"
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input
                    type="number"
                    min="1"
                    placeholder="Quantity"
                    onChange={() => calculateTotalAmount()}
                    readOnly={isReadOnly}
                  />
                </Form.Item>

                {!isReadOnly && (
                  <Button
                    onClick={() => {
                      const items = form.getFieldValue("items");
                      const removedProductId = items[field.name]?.productId;
                      if (removedProductId) {
                        setSelectedProducts((prevSelected) =>
                          prevSelected.filter((id) => id !== removedProductId)
                        );
                      }
                      remove(field.name);
                      calculateTotalAmount();
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </>
        )}
      </Form.List>

      <div className="mt-4 mb-4">
        <strong>Total Amount: ${totalAmount.toFixed(2)}</strong>
      </div>

      {!isReadOnly && (
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitLoading}>
            Save
          </Button>
        </Form.Item>
      )}
    </Form>
  );
};

export default PurchaseForm;
