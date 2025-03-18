import { jwtDecode } from "jwt-decode";
import React, { createContext, useState, useContext, useEffect } from "react";

// Create the Auth Context
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store the authenticated user
  const [token, setToken] = useState(null); // Store the token in memory
  // Store the loading state

  let tokenDetails;
  if (token) {
    tokenDetails = jwtDecode(token);
  }

  const [changePwdModalVisible, setChangePwdModalVisible] = useState(
    tokenDetails?.change_password || false
  );

  useEffect(() => {
    if (tokenDetails) {
      setChangePwdModalVisible(tokenDetails?.change_password);
    }
  }, [token]);

  //   // Function to log in a user
  //   const login = async (username, password) => {
  //     try {
  //       const response = await fetch("http://localhost:2323/login", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ username, password }),
  //       });

  //       if (!response.ok) {
  //         throw new Error("Invalid credentials");
  //       }

  //       const data = await response.json();
  //       setToken(data.token); // Store the token in context
  //       setUser(data.user); // Store user data
  //     } catch (error) {
  //       console.error("Login failed:", error.message);
  //     }
  //   };

  // Function to log out the user
  const logout = () => {
    setUser(null);
    setToken(null); // Remove token from memory
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        setToken,
        logout,
        changePwdModalVisible,
        setChangePwdModalVisible,
        tokenDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
