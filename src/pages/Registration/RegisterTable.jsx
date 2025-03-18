import React, { useState, useMemo, useCallback } from "react";
import { Table, Button, InputNumber, Checkbox } from "antd";
// import PaymentSlip from "./PaymentSlip";

const initialData = [
  {
    key: "1",
    item: "Tuition Fees",
    unitCost: 1380000,
    quantity: 1,
    selected: false,
  },
  {
    key: "2",
    item: "Functional Fees",
    unitCost: 599755,
    quantity: 1,
    selected: false,
  },
  {
    key: "3",
    item: "RETAKE PAPER: CAS2102",
    unitCost: 100000,
    quantity: 1,
    selected: false,
  },
];

const studentFile = {
  biodata: {
    surname: "Doe",
    other_names: "John",
  },
  student_no: "123456",
};

const PartialPayment = () => {
  const [data, setData] = useState(initialData);
  const [modalVisible, setModalVisible] = useState(false);

  const handleQuantityChange = useCallback((value, key) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, quantity: value || 0 } : item
      )
    );
  }, []);

  const handleCheckboxChange = useCallback((key) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, selected: !item.selected } : item
      )
    );
  }, []);

  const columns = useMemo(
    () => [
      {
        title: "",
        key: "checkbox",
        width: 50,
        render: (_, record) => (
          <Checkbox
            checked={record.selected}
            onChange={(e) => {
              e.stopPropagation();
              handleCheckboxChange(record.key);
            }}
          />
        ),
      },
      {
        title: "ITEM",
        ellipsis: true,
        dataIndex: "item",
        key: "item",
      },
      {
        title: "UNIT COST (UGX)",
        ellipsis: true,
        dataIndex: "unitCost",
        key: "unitCost",
        render: (value) => value.toLocaleString(),
      },
      {
        title: "QUANTITY",
        ellipsis: true,
        key: "quantity",
        render: (_, record) => (
          <InputNumber
            className="quantity-input"
            size="small"
            min={0}
            value={record.quantity}
            onChange={(value) => handleQuantityChange(value, record.key)}
          />
        ),
      },
    ],
    [handleCheckboxChange, handleQuantityChange]
  );

  const totalAmountToPay = useMemo(
    () =>
      data
        .filter((item) => item.selected)
        .reduce((total, item) => total + item.unitCost * item.quantity, 0),
    [data]
  );

  const handleGenerateToken = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const tokenRes = {
    amount: totalAmountToPay,
    prt_expiry: "20240824",
    prt: "2250001512200",
    allocations: data
      .filter((item) => item.selected)
      .map(
        (item) =>
          `${item.item}: ${item.unitCost.toLocaleString()} UGX * ${
            item.quantity
          }`
      )
      .join("\n"),
  };

  return (
    <div className="container mx-auto p-4">
      <Table
        pagination={false}
        className="custom-table"
        size="small"
        columns={columns}
        dataSource={data}
        rowClassName={(record) => (record.selected ? "bg-blue-100" : "")}
        onRow={(record) => ({
          onClick: (event) => {
            const target = event.target;
            if (
              !target.closest(".ant-input-number") &&
              !target.closest(".ant-checkbox-wrapper")
            ) {
              handleCheckboxChange(record.key);
            }
          },
        })}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={3}>
              <div className="text-right">
                <strong>TOTAL AMOUNT TO PAY</strong>
              </div>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={3}>
              <strong>{totalAmountToPay.toLocaleString()} UGX</strong>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
      <div className="mt-4 text-right">
        <Button type="primary" onClick={handleGenerateToken}>
          GENERATE TOKEN
        </Button>
      </div>
      {/* <PaymentSlip
        visible={modalVisible}
        onClose={handleCloseModal}
        studentFile={studentFile}
        tokenRes={tokenRes}
      /> */}
    </div>
  );
};

export default PartialPayment;
