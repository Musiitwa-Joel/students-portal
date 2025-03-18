import React from "react";

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
      code: "600014",
      name: "LIBRARY FEES",
      currency: "UGX",
      amount: 40500,
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
      code: "600003",
      name: "GUILD FEE",
      currency: "UGX",
      amount: 45000,
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
    {
      code: "600006",
      name: "REGISTRATION FEES",
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
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div style={{ padding: "0px", width: "100%", marginBottom: "20px" }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>CODE</th>
              <th style={thStyle}>NAME</th>
              <th style={thStyle}>AMOUNT</th>
              <th style={thStyle}>TYPE</th>
            </tr>
          </thead>
          <tbody>
            {feesData.map((fee, index) => (
              <tr key={index}>
                <td style={tdStyle}>{fee.code}</td>
                <td style={tdStyle}>{fee.name}</td>
                <td style={tdStyle}>{fee.amount.toLocaleString()} UGX</td>
                <td style={tdStyle}>{fee.type}</td>
              </tr>
            ))}
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <td colSpan="2" style={tdStyle}>
                TOTAL:
              </td>
              <td style={tdStyle}>{totalAmountSem1.toLocaleString()} UGX</td>
              <td style={tdStyle}></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sem1Yr1;
