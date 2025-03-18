import React, { useState } from "react";
import { Badge, Table, Typography, Modal } from "antd";
import "./Transactions.css";
import { CheckCircleOutlined } from "@ant-design/icons";

const { Link } = Typography;

const expandDataSource = [
  {
    key: "0",
    date: "FRI 11-OCT-2024 12:14 pm",
    narration: "Tuition",
    amount: "2500",
    status: "Allocated",
  },
  {
    key: "1",
    date: "FRI 11-OCT-2024 12:14 pm",
    narration: "Functional",
    amount: "2500",
    status: "Allocated",
  },
];

const dataSource = [
  {
    key: "0",
    trepay_ref: "TRE546548479478",
    bank: "CENTE",
    branch: "KAWUKU",
    date: "FRI 11-OCT-2024 12:14 pm",
    amount: "5000",
    acc_yr: "2021/2022",
    study_yr: "3",
    sem: "2",
  },
  {
    key: "1",
    trepay_ref: "TRE546548479479",
    bank: "CENTE",
    branch: "KAWUKU",
    date: "FRI 11-OCT-2024 12:14 pm",
    amount: "5000",
    acc_yr: "2021/2022",
    study_yr: "3",
    sem: "2",
  },
  {
    key: "2",
    trepay_ref: "TRE546548479480",
    bank: "CENTE",
    branch: "KAWUKU",
    date: "FRI 11-OCT-2024 12:14 pm",
    amount: "5000",
    acc_yr: "2021/2022",
    study_yr: "3",
    sem: "2",
  },
];

const invoiceDetails = {
  invoiceNumber: "2000100121-176584586",
  createdOn: "2024-09-06",
  items: [
    {
      code: "ALUMNI",
      name: "ALUMNI",
      description: "ALUMNI",
      qty: 1,
      unitAmount: 30000,
      total: 30000,
    },
    {
      code: "GRADUATION",
      name: "GRADUATION FEES FOR DEGREE",
      description: "Graduation Fees",
      qty: 1,
      unitAmount: 410000,
      total: 410000,
    },
  ],
  total: 440000,
  payments: [
    { ref: "677A77B3536B4", amount: 40000 },
    { ref: "E9E343D3E6EC4", amount: 400000 },
  ],
  amountDue: 0,
};

const expandColumns = (handleLinkClick) => [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Narration",
    dataIndex: "narration",
    key: "narration",
    render: (text) => <Link onClick={() => handleLinkClick(text)}>{text}</Link>,
  },
  {
    title: "Status",
    key: "status",
    render: (text, record) => (
      <a style={{ color: "green" }}>
        <CheckCircleOutlined style={{ marginRight: 4 }} />
        {record.status}
      </a>
    ),
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
  },
];

const columns = [
  {
    title: "Trepay Ref",
    dataIndex: "trepay_ref",
    key: "trepay_ref",
  },
  {
    title: "Bank",
    dataIndex: "bank",
    key: "bank",
  },
  {
    title: "Branch",
    dataIndex: "branch",
    key: "branch",
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
  },
  {
    title: "Acc. yr",
    dataIndex: "acc_yr",
    key: "acc_yr",
  },
  {
    title: "Study. yr",
    dataIndex: "study_yr",
    key: "study_yr",
  },
  {
    title: "Sem",
    dataIndex: "sem",
    key: "sem",
  },
  {
    title: "Action",
    key: "operation",
    render: () => (
      <a style={{ color: "green" }}>
        <CheckCircleOutlined style={{ marginRight: 4 }} />
        Allocated
      </a>
    ),
  },
];

const Transactions = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNarration, setSelectedNarration] = useState("");

  const handleLinkClick = (narration) => {
    setSelectedNarration(narration);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Table
        className="custom-table"
        size="small"
        columns={columns}
        expandable={{
          expandedRowRender: () => (
            <Table
              style={{ margin: 5 }}
              size="small"
              columns={expandColumns(handleLinkClick)}
              dataSource={expandDataSource}
              pagination={false}
            />
          ),
          defaultExpandedRowKeys: ["0"],
        }}
        dataSource={dataSource}
        scroll={{ x: "100%" }} // Enable horizontal scroll for responsiveness
      />

      <Modal
        title={`Narration Details: ${selectedNarration}`}
        open={modalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
        style={{ maxWidth: "95vw" }} // Make modal responsive
      >
        <div>
          <p>
            <strong>Invoice No:</strong> {invoiceDetails.invoiceNumber}
          </p>
          <p>
            <strong>Created On:</strong> {invoiceDetails.createdOn}
          </p>

          <Table
            className="custom-tables custom-table"
            size="small"
            columns={[
              { title: "Code", dataIndex: "code", key: "code" },
              { title: "Name", dataIndex: "name", key: "name" },
              {
                title: "Description",
                dataIndex: "description",
                key: "description",
              },
              { title: "Qty", dataIndex: "qty", key: "qty" },
              {
                title: "Unit Amount",
                dataIndex: "unitAmount",
                key: "unitAmount",
              },
              { title: "Total", dataIndex: "total", key: "total" },
            ]}
            dataSource={invoiceDetails.items}
            pagination={false}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell>
                  <strong>Amount Due:</strong> {invoiceDetails.amountDue}
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <strong>Total:</strong> {invoiceDetails.total}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
            scroll={{ x: "100%" }} // Enable horizontal scroll for responsiveness
          />
        </div>
      </Modal>
    </>
  );
};

export default Transactions;
