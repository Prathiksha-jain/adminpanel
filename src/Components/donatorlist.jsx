import React,{ useEffect, useState } from "react";
import "../Styles/viewEvent.css";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useNavigate ,Link} from "react-router-dom";
import Sidebar from "../Components/SideBar";

const backendUrl = process.env.REACT_APP_BACKEND_URL;


const DonatorList = () => {
    const [donatorDetails, setDonatorsDetails] = useState({
        donator: []
    });
    let navigate = useNavigate();
    useEffect(() => {
        getDonatorDetails();
    }, []);

    const getDonatorDetails = async () => {
        let response = await fetch(
            // "http://localhost:2000/users/getDonatorData",
            `${backendUrl}/users/getDonatorData`,
        );
        let result = await response.json();

        console.log(result);
        setDonatorsDetails(result);

    };

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        "&:last-child td, &:last-child th": {
            border: 0,
        },
    }));

    const getData = () => {
        return donatorDetails.result;
    };

    const donationData = getData();

    const handleConfirm = async(id) =>{
        try{
            const response = await fetch(
                // `http://localhost:2000/admin/confirmDonatorDetails/${id}`,
                `${backendUrl}/admin/confirmDonatorDetails/${id}`,
                {
                headers: {
                    authorization: `bearer${JSON.parse(
                      localStorage.getItem("token")
                    )}`,
                  },
            });
            let result = await response.json();
            if (response.status === 401) {
                localStorage.removeItem("token");
                navigate("/");
            }else if(response.status === 200){
                alert(result.message);
                getDonatorDetails();
            }
        }catch(error){
            console.error("Error Occured",error);
        }
    }

    const handleReject = async(id) => {
        console.log(id);
        try{
            const response = await fetch(
                // `http://localhost:2000/admin/rejectDonatorDetails/${id}`,
                `${backendUrl}/admin/rejectDonatorDetails/${id}`,
                {
                headers: {
                    authorization: `bearer${JSON.parse(
                      localStorage.getItem("token")
                    )}`,
                  },
            });
            let result = await response.json();
            if (response.status === 401) {
                localStorage.removeItem("token");
                navigate("/");
            }else if(response.status === 200){
                alert(result.message);
                getDonatorDetails();
            }
        }catch(error){
            console.error("Error Occured",error);
        }
    }

    return (
    <Sidebar>
            <TableContainer component={Paper} className="table-container-project">
                <Table
                    sx={{ minWidth: 950 }}
                    aria-label="customized table"
                    className="styled-table"
                >
                    <TableHead>
                        <TableRow sx={{ height: "50px" }}>
                            <StyledTableCell>Sl.no</StyledTableCell>
                            <StyledTableCell align="center">Name</StyledTableCell>
                            <StyledTableCell align="center">Phone</StyledTableCell>
                            <StyledTableCell align="center">Mail-ID</StyledTableCell>
                            <StyledTableCell align="center">Adress</StyledTableCell>
                            <StyledTableCell align="center">Total Cost</StyledTableCell>
                            <StyledTableCell align="center">Actions</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {donationData?.map((data, index) => (
                            <StyledTableRow key={data.id}>
                                <StyledTableCell component="th" scope="row">
                                    {index + 1}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                    {data.donatorName}
                                </StyledTableCell>
                                <StyledTableCell align="left">{data.donatorPhone}</StyledTableCell>
                                <StyledTableCell align="left">{data.donatorMail}</StyledTableCell>
                                <StyledTableCell align="left">{data.donatorAddress}</StyledTableCell>
                                <StyledTableCell align="left">{data.totalDonationCost}</StyledTableCell>
                                <StyledTableCell align="center">
                                    <div style={{display:"flex",justifyContent:"center"}}>
                                <Link
                                    className="view-button"
                                    to={"/donatorDetails/" + data._id}
                                >
                                    View
                                </Link>
                                    {data.confirm === true ? (<>
                                    <button className="view-button" disabled>Confirmed</button>
                                    </>):(
                                    <div style={{ display: "flex" }}>
                                        <button className="view-button"
                                            onClick={() =>
                                                handleConfirm(data._id)
                                            }>
                                            Confirm
                                        </button>
                                        <button className="view-button"
                                            onClick={() =>
                                                handleReject(data._id)
                                            }>
                                            Reject
                                        </button>
                                    </div>
                                )}
                                </div>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>  
        </Sidebar>
        )
}

export default DonatorList;