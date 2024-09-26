import React from "react";
import "./App.css";
import LoginForm from "./Components/LoginForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginAdmin from "./Components/LoginAdmin";
import LoginOperator from "./Components/LoginOperator";
import PrivateComponent from "./Components/PrivateComponent";
import AddProject from "./Components/addProject";
import EditProject from "./Components/editProject";
import ViewProject from "./Components/ViewProject";
import ViewProjectDetails from "./Components/viewProjectDetails";
import SignUp from "./Components/signup";
import ForgotPassword from "./Components/forgotPassword";
import Payment from "./Components/razorPay";
import DonatorList from "./Components/donatorlist";
import DonatorDetails from "./Components/viewDonatorDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/payment" element={<Payment />} />
        <Route path="/" element={<LoginForm />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgotPassword" element={ <ForgotPassword />} />
        <Route element={<PrivateComponent />}>
          <Route path="/adminDashboard/:id" element={<LoginAdmin />} />
          <Route path="/operatorDashboard/:id" element={<LoginOperator />} />
          <Route
            path="/addProject"
            element={
              <React.Fragment>
                {/* <Nav /> */}
                <AddProject />
              </React.Fragment>
            }
          ></Route>
          <Route
            path="/projectDetails/:id"
            element={
              <React.Fragment>
                {/* <Nav /> */}
                <ViewProjectDetails />
              </React.Fragment>
            }
          ></Route>
          <Route
            path="/editProject/:id"
            element={
              <React.Fragment>
                {/* <Nav /> */}
                <EditProject />
              </React.Fragment>
            }
          ></Route>
          <Route
            path="/viewProjects"
            element={
              <React.Fragment>
                {/* <Nav /> */}
                <ViewProject />
              </React.Fragment>
            }
          ></Route>
          <Route
            path="/donatorList"
            element={
              <React.Fragment>
                {/* <Nav /> */}
                <DonatorList />
              </React.Fragment>
            }
          ></Route>
          <Route
            path="/donatorDetails/:id"
            element={
              <React.Fragment>
                {/* <Nav /> */}
                <DonatorDetails />
              </React.Fragment>
            }
          ></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
