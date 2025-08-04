import React, { useState, useEffect } from "react";
import {
  Table,
  Typography,
  Modal,
  Skeleton,
  Button,
  Alert,
  Timeline,
} from "antd";
import { useQuery } from "@apollo/client";
import "./Transactions.css";
import { CheckCircleOutlined } from "@ant-design/icons";
import { TRANSACTIONS_QUERY } from "../../../gql/queries";

// Utility function to format money as UGX
const formatUGX = (value) => {
  if (value === null || value === undefined || isNaN(value)) return "UGX 0";
  return `UGX ${Number(value).toLocaleString("en-UG", {
    style: "decimal",
    minimumFractionDigits: 0,
  })}`;
};

// Utility function to format dates
const formatDate = (timestamp) => {
  const rawDate =
    typeof timestamp === "string" && !isNaN(Number(timestamp))
      ? Number(timestamp)
      : timestamp;

  const date = new Date(rawDate);

  if (!timestamp || isNaN(date.getTime())) {
    return "INVALID DATE";
  }

  const options = {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Africa/Kampala",
  };

  const parts = new Intl.DateTimeFormat("en-UG", options).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type)?.value || "";

  const weekday = get("weekday");
  const month = get("month");
  const day = get("day");
  const year = get("year");
  const hour = get("hour");
  const minute = get("minute");
  const period = get("dayPeriod");

  return `${weekday}-${month}-${day}-${year} ${hour}:${minute} ${period}`.toUpperCase();
};

const { Link } = Typography;

const Transactions = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNarration, setSelectedNarration] = useState("");
  const [selectedInvoiceDetails, setSelectedInvoiceDetails] = useState(null);

  const { loading, error, data, refetch } = useQuery(TRANSACTIONS_QUERY, {
    onError: (err) => {
      console.error("GraphQL Error Details:", {
        message: err.message,
        networkError: err.networkError,
        graphQLErrors: err.graphQLErrors,
      });
    },
  });

  useEffect(() => {
    if (data) {
      console.log("GraphQL Data:", data);
      data.my_transactions?.forEach((tx, index) => {
        console.log(`Transaction ${tx.id}:`, {
          payment_date: tx.payment_date,
          isValid: tx.payment_date && !isNaN(new Date(Number(tx.payment_date))),
          is_dp: tx.is_dp,
          is_pp: tx.is_pp,
          allocations: tx.allocations?.length || 0,
        });
      });
    }
  }, [data]);

  const regularDataSource =
    data?.my_transactions
      ?.filter((transaction) => !transaction.is_dp)
      .map((transaction) => ({
        key: transaction.id,
        trepay_ref: transaction.prt || "N/A",
        bank: transaction.bank_name || "N/A",
        branch: transaction.bank_branch || "N/A",
        date: formatDate(transaction.payment_date),
        amount: formatUGX(transaction.amount),
        acc_yr: transaction.acc_yr || "N/A",
        study_yr:
          transaction.allocations?.[0]?.invoice_details?.study_year || "N/A",
        sem: transaction.allocations?.[0]?.invoice_details?.semester || "N/A",
        is_pp: transaction.is_pp,
        allocations: transaction.allocations || [],
      })) || [];

  const dpDataSource =
    data?.my_transactions
      ?.filter((transaction) => transaction.is_dp)
      .map((transaction) => ({
        key: transaction.id,
        trepay_ref: transaction.prt || "N/A",
        bank: transaction.bank_name || "N/A",
        branch: transaction.bank_branch || "N/A",
        date: formatDate(transaction.payment_date),
        amount: formatUGX(transaction.amount),
        acc_yr: transaction.acc_yr || "N/A",
        study_yr: "N/A",
        sem: "N/A",
        is_pp: transaction.is_pp,
        allocations: transaction.allocations || [],
      })) || [];

  const expandDataSource = (transaction) =>
    transaction.allocations?.map((allocation, index) => ({
      key: index.toString(),
      date: formatDate(allocation.allocation_date),
      narration: allocation.invoice_details?.narration || "N/A",
      status: allocation.invoice_details?.status || "Okay",
      amount: formatUGX(allocation.amount),
    })) || [];

  const handleLinkClick = (narration, transaction) => {
    const allocation = transaction.allocations?.find(
      (alloc) => alloc.invoice_details?.narration === narration
    );
    if (allocation?.invoice_details) {
      const invoice = allocation.invoice_details;
      setSelectedInvoiceDetails({
        invoiceNumber: invoice.invoice_no || "N/A",
        createdOn: formatDate(invoice.invoice_date),
        items:
          invoice.line_items?.map((item) => ({
            code: item.item_code || "N/A",
            name: item.item_name || "N/A",
            description: item.item_description || "N/A",
            qty: item.quantity || 1,
            unitAmount: formatUGX(item.unit_amount),
            total: formatUGX(item.quantity * item.unit_amount),
            date: formatDate(item.date),
          })) || [],
        total: formatUGX(invoice.total_amount),
        payments: [
          {
            ref: invoice.reference || "N/A",
            amount: formatUGX(invoice.amount_paid),
          },
        ],
        amountDue: formatUGX(invoice.amount_due),
      });
      setSelectedNarration(narration);
      setModalVisible(true);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedInvoiceDetails(null);
  };

  const expandColumns = (transaction) => [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 150,
    },
    {
      title: "Narration",
      dataIndex: "narration",
      key: "narration",
      width: 200,
      render: (text) => (
        <Link onClick={() => handleLinkClick(text, transaction)}>{text}</Link>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (text) => (
        <a style={{ color: "green" }}>
          <CheckCircleOutlined style={{ marginRight: 4 }} />
          {text}
        </a>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 120,
    },
  ];

  const columns = [
    {
      title: "PRT",
      dataIndex: "trepay_ref",
      key: "trepay_ref",
      width: 120,
      ellipsis: true,
      fixed: "left",
    },
    {
      title: "Bank",
      dataIndex: "bank",
      key: "bank",
      width: 130,
      ellipsis: true,
    },
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 220,
      ellipsis: true,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Acc. yr",
      dataIndex: "acc_yr",
      key: "acc_yr",
      width: 80,
      ellipsis: true,
    },
    {
      title: "Study. yr",
      dataIndex: "study_yr",
      key: "study_yr",
      width: 80,
      ellipsis: true,
    },
    {
      title: "Sem",
      dataIndex: "sem",
      key: "sem",
      width: 60,
      ellipsis: true,
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      ellipsis: true,
      fixed: "right",
      render: (_, record) => {
        const transaction = data?.my_transactions?.find(
          (tx) => tx.id === record.key
        );
        const isAllocated = transaction?.allocations?.length > 0;
        return (
          <a style={{ color: isAllocated ? "green" : "red" }}>
            <CheckCircleOutlined style={{ marginRight: 4 }} />
            {isAllocated ? "Allocated" : "Unallocated"}
          </a>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f0f2f5",
          padding: "20px",
        }}
      >
        <Skeleton
          active
          paragraph={{ rows: 10 }}
          title={{ width: "100%" }}
          style={{ maxWidth: "1200px", width: "100%" }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f0f2f5",
          padding: "20px",
        }}
      >
        <Alert
          message="Error Loading Transactions"
          description={
            <>
              <p>{error.message}</p>
              <Button type="primary" onClick={() => refetch()}>
                Retry
              </Button>
            </>
          }
          type="error"
          showIcon
          style={{ maxWidth: "600px", width: "100%" }}
        />
      </div>
    );
  }

  return (
    <>
      <Timeline
        items={[
          {
            color: "green",
            children: (
              <>
                <h3 style={{ margin: "16px 0 8px 16px" }}>Live Transactions</h3>
                <Table
                  className="custom-table"
                  size="small"
                  columns={columns}
                  expandable={{
                    expandedRowRender: (record) => {
                      const transaction = data?.my_transactions?.find(
                        (tx) => tx.id === record.key
                      );
                      return (
                        <Table
                          style={{ margin: 5 }}
                          size="small"
                          columns={expandColumns(transaction)}
                          dataSource={expandDataSource(transaction)}
                          pagination={false}
                          scroll={{ x: 570 }}
                        />
                      );
                    },
                    rowExpandable: (record) => {
                      const transaction = data?.my_transactions?.find(
                        (tx) => tx.id === record.key
                      );
                      return (
                        !transaction?.is_pp &&
                        transaction?.allocations?.length > 0
                      );
                    },
                    defaultExpandedRowKeys: ["0"],
                  }}
                  dataSource={regularDataSource}
                  scroll={{ x: 830 }}
                  pagination={{ pageSize: 10 }}
                />
              </>
            ),
          },
          ...(dpDataSource.length > 0
            ? [
                {
                  color: "blue",
                  children: (
                    <>
                      <h3 style={{ margin: "16px 0 8px 16px" }}>
                        Manual Transactions
                      </h3>
                      <Table
                        className="custom-table"
                        size="small"
                        columns={columns}
                        dataSource={dpDataSource}
                        pagination={false}
                        scroll={{ x: 830 }}
                        style={{ background: "#e6f7ff", borderRadius: 4 }}
                      />
                    </>
                  ),
                },
              ]
            : []),
        ]}
      />

      <Modal
        title={`Narration Details: ${selectedNarration}`}
        open={modalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
        style={{ maxWidth: "95vw" }}
      >
        {selectedInvoiceDetails && (
          <div>
            <p>
              <strong>Invoice No:</strong>{" "}
              {selectedInvoiceDetails.invoiceNumber}
            </p>
            <Table
              className="custom-tables custom-table"
              size="small"
              columns={[
                { title: "Date", dataIndex: "date", key: "date", width: 150 },
                { title: "Code", dataIndex: "code", key: "code", width: 100 },
                { title: "Name", dataIndex: "name", key: "name", width: 120 },
                {
                  title: "Description",
                  dataIndex: "description",
                  key: "description",
                  width: 200,
                },
                { title: "Qty", dataIndex: "qty", key: "qty", width: 60 },
                {
                  title: "Unit Amount",
                  dataIndex: "unitAmount",
                  key: "unitAmount",
                  width: 120,
                },
                {
                  title: "Total",
                  dataIndex: "total",
                  key: "total",
                  width: 120,
                },
              ]}
              dataSource={selectedInvoiceDetails.items}
              pagination={false}
              scroll={{ x: 870 }}
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell colSpan={5}>
                    <strong>Amount Due:</strong>{" "}
                    {selectedInvoiceDetails.amountDue}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell colSpan={2}>
                    <strong>Total:</strong> {selectedInvoiceDetails.total}
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />
          </div>
        )}
      </Modal>
    </>
  );
};

export default Transactions;
