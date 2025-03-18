import React from "react";
import "./Sem1Yr1.css";
const Sem1Yr1 = () => {
  const feesData = [
    {
      code: "600001",
      name: "TUITION",
      currency: "UGX",
      amount: 1129400,
      type: "TUITION",
    },
    {
      code: "600006",
      name: "REGISTRATION FEES",
      currency: "UGX",
      amount: 50000,
      type: "FUNCTIONAL",
    },
    {
      code: "600004",
      name: "DEVELOPMENT FEE",
      currency: "UGX",
      amount: 100000,
      type: "FUNCTIONAL",
    },
    {
      code: "600023",
      name: "IDENTITY CARD",
      currency: "UGX",
      amount: 15000,
      type: "FUNCTIONAL",
    },
    {
      code: "600003",
      name: "GUILD FEE",
      currency: "UGX",
      amount: 45000,
      type: "FUNCTIONAL",
    },
    {
      code: "600008",
      name: "UNDERGRADUATE GOWN",
      currency: "UGX",
      amount: 50000,
      type: "FUNCTIONAL",
    },
    {
      code: "600007",
      name: "ICT",
      currency: "UGX",
      amount: 45000,
      type: "FUNCTIONAL",
    },
    {
      code: "600025",
      name: "JOURNAL",
      currency: "UGX",
      amount: 10000,
      type: "FUNCTIONAL",
    },
    {
      code: "600021",
      name: "RULES FEE",
      currency: "UGX",
      amount: 2000,
      type: "FUNCTIONAL",
    },
    {
      code: "600014",
      name: "LIBRARY FEES",
      currency: "UGX",
      amount: 40500,
      type: "FUNCTIONAL",
    },
    {
      code: "600022",
      name: "CAUTION MONEY",
      currency: "UGX",
      amount: 10000,
      type: "FUNCTIONAL",
    },
    {
      code: "600011",
      name: "EXAMINATION FEES",
      currency: "UGX",
      amount: 40000,
      type: "FUNCTIONAL",
    },
    {
      code: "600024",
      name: "MEDICAL FEES",
      currency: "UGX",
      amount: 50000,
      type: "FUNCTIONAL",
    },
  ];

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "10px",
    fontWeight: "bold",
  };

  const thStyle = {
    border: "1px solid #dddddd",
    textAlign: "left",
    padding: "4px",
    backgroundColor: "#f2f2f2",
    whiteSpace: "nowrap",
  };

  const tdStyle = {
    border: "1px solid #dddddd",
    textAlign: "left",
    padding: "4px",
    whiteSpace: "nowrap",
  };

  const totalAmountSem1 = feesData.reduce((acc, fee) => acc + fee.amount, 0);

  return (
    <div className="fees-table-container">
      <div className="table-wrapper">
        <table className="fees-table">
          <thead>
            <tr>
              <th>CODE</th>
              <th>NAME</th>
              <th>AMOUNT</th>
              <th>TYPE</th>
            </tr>
          </thead>
          <tbody>
            {feesData.map((fee, index) => (
              <tr key={index}>
                <td>{fee.code}</td>
                <td>{fee.name}</td>
                <td>{fee.amount.toLocaleString()} UGX</td>
                <td>{fee.type}</td>
              </tr>
            ))}
            <tr className="total-row">
              <td colSpan="2">TOTAL:</td>
              <td>{totalAmountSem1.toLocaleString()} UGX</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sem1Yr1;
