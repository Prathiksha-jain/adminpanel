/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import Chart from "chart.js/auto";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Styles/AdminDashboard.css";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { DomainVerification } from "@mui/icons-material";
import DonatorList from "./donatorlist";


const iconStyle = {
  backgroundColor: "none",
  width: "30px",
  height: "30px",
};

const controlPrevStyle = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  left: "-30px",
  zIndex: 5,
};

const controlNextStyle = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  right: "-30px",
  zIndex: 5,
};

const CustomPrevIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 14 14"
    width="50"
    height="30"
    fill="black"
  >
    <path
      fillRule="evenodd"
      d="M11.354 8.354a.5.5 0 0 1-.708 0L6.5 4.207l-.354.354a.5.5 0 0 1-.708 0 .5.5 0 0 1 0-.708L6.5 2.5l5 5-.646.646a.5.5 0 0 1-.708 0z"
    />
  </svg>
);

const CustomNextIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    width="30"
    height="30"
    fill="black"
  >
    <path
      fillRule="evenodd"
      d="M4.646 8.354a.5.5 0 0 0 .708 0L9.5 4.207l.354.354a.5.5 0 0 0 .708 0 .5.5 0 0 0 0-.708L9.5 2.5l-5 5 .646.646a.5.5 0 0 0 .708 0z"
    />
  </svg>
);

const barchartData = {
  labels: ["Public Spaces", "Education", "Event", "Health"],
  datasets: [
    {
      label: "Event Wise Funding - 2023",
      data: [150, 200, 100, 250],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

const chartData = {
  labels: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  datasets: [
    {
      label: "Funding Received - 2023",
      data: [65, 59, 80, 81, 6, 55, 40, 0, 100, 12, 1, 50],
      borderColor: "#4CAF50",
      backgroundColor: "rgba(76, 175, 80, 0.2)",
    },
  ],
};

const AdminDashboard = () => {
  const [donatorsDetails, setDonatorsDetails] = useState({
    donator: []
  });
  const [educationCount, setEducationCount] = useState(0);
  const [publicspaceCount, setPublicspaceCount] = useState(0);
  const [healthCount, setHealthCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [finalCount, setFinalCount] = useState(0);

  const [unapprovedCount, setUnapprovedCount] = useState(0);
  const navigate = useNavigate();
  const [eventname, setEventName] = useState("");


  const chartRef = useRef(null);
  const pieChartRef = useRef(null);

  useEffect(() => {
    fetchCounts();
    fetchUnapproved();
    setFinalCount(educationCount + publicspaceCount + healthCount + eventCount);
    const myChart = new Chart(chartRef.current, {
      type: "line",
      data: chartData,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });



    if (pieChartRef.current) {
      const pieChart = new Chart(pieChartRef.current, {
        type: "doughnut",
        data: {
          labels: ["Approved Projects", "UnApproved Projects"],
          datasets: [
            {
              label: "Projects",
              data: [educationCount, unapprovedCount],
              backgroundColor: ["#4CAF50", "#FFC107"],
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              display: true,
              position: "right",
            },
          },
        },
      });

      return () => {
        myChart.destroy();
        pieChart.destroy();
      };
    }
  }, [
    educationCount,
    eventCount,
    publicspaceCount,
    healthCount,
    finalCount,
    unapprovedCount,
  ]);




  const getDonatorDetails = async () => {
    let response = await fetch(
      "http://localhost:2000/users/getDonatorData"
    );
    let result = await response.json();
    setDonatorsDetails(result);

  };


  useEffect(() => {
    getDonatorDetails();
  }, []);






  const fetchCounts = async () => {
    try {
      // Fetch Events Count
      let eventsResponse = await fetch(
        "http://localhost:2000/users/getApprovedData",
        {
          headers: {
            authorization: `bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        }
      );

      if (eventsResponse.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
        return; // Exit the function if unauthorized
      }

      let eventsResult = await eventsResponse.json();
      setEventCount(eventsResult.length);
      setEventName(eventsResult.name);

      // Fetch Projects Count
      let projectsResponse = await fetch(
        "http://localhost:2000/users/getApprovedProjects",
        {
          headers: {
            authorization: `bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        }
      );

      if (projectsResponse.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
        return; // Exit the function if unauthorized
      }

      let projectsResult = await projectsResponse.json();
      setEducationCount(projectsResult.education.length);
      setPublicspaceCount(projectsResult.publicSpaces.length);
      setHealthCount(projectsResult.health.length);


    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  const fetchUnapproved = async () => {
    try {
      let response = await fetch(
        "http://localhost:2000/users/getUnapprovedProjects",
        {
          headers: {
            authorization: `bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        }
      );
      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      } else {
        let unapprovedresult = await response.json();
        setUnapprovedCount(unapprovedresult.education.length);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }


  };


  const getData = () => {
    return donatorsDetails.result || [];
  };

  const donationData = getData();
  const topDonators = donationData.slice(0, 6); // Slice to get the first 6 donators


  return (
    <div className="content">
      <main className="container">
        <div className="p-4 p-md-5 mb-4 rounded text-body-emphasis panel">
          <div class="mb-8">
            <h2 class="mb-2">Block Education Officer Dashboard</h2>
            <h5 class="text-body-tertiary fw-semibold">
              Here’s what’s going on in your City right now
            </h5>
          </div>
        </div>
        <div className="chart summary-item" style={{marginBottom:"30px"}}>
            <h2>
              Total Contributions: +{educationCount+unapprovedCount} 
            </h2>
          </div>
        <div className="summary">
        
          <div className="chart summary-item">
          <h3>Approved Projects</h3>
            <h5>{educationCount}</h5>
           
          </div>
          <div className="chart summary-item">
            <h3>Pending Projects</h3>
            <h5>{unapprovedCount}</h5>
          </div>
          
        </div>



        <div className="summary">
          <div className="chart summary-item">
            <canvas style={{marginTop:"15vh"}} ref={chartRef} />
          </div>

          <div className="chart summary-item">
            <canvas ref={pieChartRef} />
          </div>
        </div>



        <div className="row g-8">
          <div className="col-md-6">


            <div class="chart"
              style={{
                marginTop: "10px"
              }}>
              <h2 class="border-bottom pb-2 mb-0">Top-Funders</h2>

              {topDonators.length > 0 ? (
                topDonators.slice(0, 6).map((data, index) => (
                  <div key={data.id} className="d-flex text-body-secondary pt-3">
                    <span className="d-block text-dark" style={{ marginRight: "20px" }}>
                      {index + 1}.
                    </span>
                    <div className="pb-3 mb-0 small lh-sm border-bottom w-100">
                      <div className="d-flex justify-content-between" style={{ fontSize: "20px" }}>
                        <strong className="text-dark">{data.donatorName}</strong>
                      </div>
                      <span className="d-block">Phone: {data.donatorPhone}</span>
                      <span className="d-block">Email: {data.donatorMail}</span>
                      <span className="d-block">Total: {data.totalDonationCost}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No Donators Found</p>
              )}


              <small class="d-block text-end mt-3">
                <Link to="/donatorlist">View All</Link>
              </small>
            </div>

          </div>

         
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
