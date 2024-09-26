
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "@splidejs/react-splide/css";
import "../Styles/App.css";
import "../Styles/viewEventDetails.css";
const backendUrl = process.env.REACT_APP_BACKEND_URL;


const DonatorDetails = () => {
    const [detailData, setDetailData] = useState(null);
    const navigate = useNavigate("");
    const params = useParams();

    useEffect(() => {
        donatorData();
    }, []);



    const donatorData = async () => {
        try {
            let response = await fetch(
                // `http://localhost:2000/users/getDonatorData/${params.id}`,
                `${backendUrl}/admin/getDonatorsDetails/${params.id}`,
                {
                    headers: {
                        authorization: `bearer${JSON.parse(localStorage.getItem("token"))}`,
                    },
                }
            );
            let result = await response.json();
            if (response.status === 401) {
                localStorage.removeItem("token");
                navigate("/");
            } else if (result) {
                setDetailData(result);
                console.log(result);

            } else {
                console.error("Error fetching data");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    if (!detailData) {
        return 0;
    }


    return (
        <div className="content">
            <div className="details-container">
                <h1
                    className="event-title"
                    style={{ textAlign: "center", width: "100%" }}
                >
                    Donator's Detail

                </h1>



                <main>
                    <h1 className="text-body-emphasis">
                        Details about {detailData.donatorName}

                    </h1>


                    <hr className="col-12 col-md-12 mb-5" />
                </main>
                <div className="row funding-amount ">


                    <div className="amount-card col-lg-10"
                        style={{ marginTop: "30px" }}>
                        <div
                            style={{ marginBottom: "-20px" }}>
                            <h2>Donator's Detail:</h2>
                        </div>
                        <br />
                        <table className="event-table">
                            <tbody>
                                <tr style={{ fontSize: "1.3rem" }}>
                                    <td >Name:</td>
                                    <td>{detailData.donatorName}</td>
                                </tr>
                                <tr style={{ fontSize: "1.3rem" }}>
                                    <td >Phone No:</td>
                                    <td>{detailData.donatorPhone}</td>
                                </tr>
                                <tr style={{ fontSize: "1.3rem" }}>
                                    <td >Mail</td>
                                    <td>{detailData.donatorMail}</td>
                                </tr>
                                <tr style={{ fontSize: "1.3rem" }}>
                                    <td >Address</td>
                                    <td>{detailData.donatorAddress}</td>
                                </tr>
                                <tr style={{ fontSize: "1.3rem" }}>
                                    <td >Donation Cost:</td>
                                    <td>{detailData.totalDonationCost}</td>
                                </tr>

                            </tbody>
                        </table>
                    </div>

                    <div className="amount-card col-lg-10" style={{ marginTop: "30px" }}>
                        <div style={{ marginBottom: "-20px" }}>
                            <h2>Project's Donated:</h2>
                        </div>
                        <br />
                        <table className="event-table">
                            <tbody>

                                <tr style={{ fontSize: "1.5rem" }}>
                                    <td>Item No.</td>
                                    <td>Item Name</td>
                                    <td>Quantity</td>
                                    <td>Total Cost</td>
                                </tr>
                                {detailData?.donatedItems?.map((item, index) => (
                                    <tr key={index} style={{ fontSize: "1.3rem" }}>
                                        <td>{`Item ${index + 1}`}</td>
                                        <td>{item.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.totalCost}</td>
                                    </tr>
                                ))}
                            
                        </tbody>
                    </table>
                </div>



            </div>
        </div>
        </div >
    );

};
export default DonatorDetails;
