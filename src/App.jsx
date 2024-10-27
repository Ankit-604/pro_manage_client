import { Outlet } from "react-router-dom";
import "./App.css";
import React from "react";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <main className="App">
      <Toaster
        position="top-right"
        reverseOrder={true}
        toastOptions={{
          duration: 2000,
        }}
      />
      <Outlet />
    </main>
  );
}

export default App;
