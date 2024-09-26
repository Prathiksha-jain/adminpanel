import React, { useState, useCallback, useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/App.css";
import "../Styles/addEvent.css";
import zoneSchoolMap from "./SchoolData";
import Sidebar from "../Components/SideBar";

const backendUrl = process.env.REACT_APP_BACKEND_URL;


const allOptions = ["Beds and Pillows", "Two Tier Cot", "Desk and Bench", "Solar Water Heater", "Diesel generator", "Water Purifier", "Dormitory Rooms", "Classrooms", "Bathrooms and Toilets", "Smart Board"];


const AddProject = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [schoolName, setSchoolName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [edate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [IFSC, setIFSC] = useState("");
  const [UPI, setUPI] = useState("");
  const [recommendedBy, setRecommendBY] = useState("");
  const [projectType, setProjectType] = useState("");
  const [projectSector, setProjectSector] = useState("");
  const [amount, setAmount] = useState(0);
  const [fundRaiserName, setFundRaiserName] = useState("");
  const [village, setVillage] = useState("");
  const [taluk, setTaluk] = useState("");
  const [district, setDistrict] = useState("");
  const [landDetails, setLandDetails] = useState("");
  const [totalPopulation, setTotalPopulation] = useState("");
  const [projectParticular, setProjectParticular] = useState("");
  const [projectObjective, setProjectObjective] = useState("");
  const [images, setImages] = useState({
    frontPic: null,
    assemblyPic: null,
    otherImages: []
  });
  const frontPicInputRef = useRef(null);
  const assemblyPicInputRef = useRef(null);
  const otherImagesInputRef = useRef(null);
  const [submited, setSubmited] = useState(false);
  const [zone, setZone] = useState("");
  const [rows, setRows] = useState({});
  const [selectedOptions, setSelectedOptions] = useState(new Set());
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
      e.preventDefault(); // Prevent the default behavior of Enter key
    }
  };

  const handleCheckboxChange = (e) => {
    setIsCheckboxChecked(e.target.checked);
  };

  const zoneToTalukMap = {
    'Bantwal': 'Bantwal',
    'Belthangady': 'Belthangady',
    'MangloreNorth': 'Mangalore',
    'MangloreSouth': 'Mangalore',
    'Moodabidre': 'Moodabidre',
    'Puttur': 'Puttur',
    'Sullia': 'Sullia',
  };



  const handleZoneChange = (e) => {
    const selectedZone = e.target.value;
    setZone(selectedZone);
    setTaluk(zoneToTalukMap[selectedZone] || '');
  };

  const handleSingleImageChange = (event, imageType) => {
    if (!event) {
      // If event is null, reset the specific image type
      setImages((prevImages) => ({
        ...prevImages,
        [imageType]: null, // Reset the image type
      }));
    } else {
      const file = event.target.files[0];
      setImages((prevImages) => ({
        ...prevImages,
        [imageType]: file, // Set the selected file
      }));
    }
  };
  
  const handleOtherImagesChange = (event) => {
    if (!event) {
      // If event is null, reset other images
      setImages((prevImages) => ({
        ...prevImages,
        otherImages: [], // Reset other images
      }));
      return;
    }
  
    const files = Array.from(event.target.files);
    setImages((prevImages) => ({
      ...prevImages,
      otherImages: [...prevImages.otherImages, ...files],
    }));
  };

console.log(images.frontPic,
  images.assemblyPic,
  ...images.otherImages);

  const handleDeleteRow = useCallback((key) => {
    setRows(prevRows => {
      const { [key]: _, ...remainingRows } = prevRows;

      // Re-index remaining rows
      const reIndexedRows = Object.keys(remainingRows).reduce((acc, currKey, index) => {
        acc[index + 1] = {
          ...remainingRows[currKey],
          slno: index + 1
        };
        return acc;
      }, {});

      // Update selected options based on remaining rows
      const updatedSelectedOptions = new Set(
        Object.values(reIndexedRows)
          .map(row => row.infrastructure)
          .filter(opt => opt && opt !== "Other")
      );

      setSelectedOptions(updatedSelectedOptions);
      return reIndexedRows;
    });
  }, []);

  // Handles selecting an option from the dropdown
  const handleSelectChange = (key, value) => {
    setRows(prevRows => {
      const newRows = { ...prevRows };
      const currentRow = newRows[key];

      // Remove the previously selected option from the selectedOptions set
      if (currentRow.infrastructure && currentRow.infrastructure !== "Other") {
        setSelectedOptions(prevSelectedOptions => {
          const newSelectedOptions = new Set(prevSelectedOptions);
          newSelectedOptions.delete(currentRow.infrastructure);
          return newSelectedOptions;
        });
      }

      // Update row with the new selection
      if (value === "Other") {
        newRows[key] = {
          ...currentRow,
          infrastructure: "",
          isOther: true,
        };
      } else {
        newRows[key] = {
          ...currentRow,
          infrastructure: value,  // This is where the new value should be set
          isOther: false,
        };

        // Add the new selection to the selectedOptions set
        setSelectedOptions(prevSelectedOptions => {
          const newSelectedOptions = new Set(prevSelectedOptions);
          newSelectedOptions.add(value);
          return newSelectedOptions;
        });
      }

      return newRows;
    });
  };


  const handleInputChange = (key, field, value) => {
    setRows(prevRows => {
      const newRows = { ...prevRows };
      const currentRow = newRows[key];

      // Ensure the numeric fields are treated as numbers
      let parsedValue = value;
      if (field === "demandNo" || field === "estimatedCost") {
        parsedValue = parseFloat(value) || 0; // Convert to number, default to 0 if invalid
      }

      newRows[key] = {
        ...currentRow,
        [field]: parsedValue,
      };

      if (field === "estimatedCost" || field === "demandNo") {
        const demandNo = parseFloat(newRows[key].demandNo) || 0;
        const estimatedCost = parseFloat(newRows[key].estimatedCost) || 0;
        newRows[key].totalCost = demandNo * estimatedCost; // Calculate total cost
      }

      return newRows;
    });
  };





  useEffect(() => {
    const total = Object.values(rows).reduce((sum, row) => {
      return sum + (parseFloat(row.totalCost) || 0);
    }, 0);
    setAmount(total);
  }, [rows]);

  // Handles adding a new row
  const handleAddRow = () => {
    const newKey = Object.keys(rows).length + 1;
    setRows(prevRows => ({
      ...prevRows,
      [newKey]: {
        slno: newKey,
        infrastructure: "",
        demandNo: "",
        estimatedCost: "",
        totalCost: "",
        isOther: false,
      }
    }));
  };

  // List of all possible options


  // Function to get filtered options for a row
  const getFilteredOptions = () => {
    const filteredOptions = allOptions.filter(option => !selectedOptions.has(option));
    console.log(...filteredOptions);
    return [...filteredOptions, "Other"];
  };

  const transformRows = (rows) => {
    // Transform rows data to match backend schema, making sure numeric fields are numbers
    return Object.values(rows).map(row => ({
      item: row.infrastructure,           // Text field
      quantity: Number(row.demandNo),
      amount: Number(row.estimatedCost),
      totalAmount: Number(row.totalCost)
    }));
  };



  let ID = JSON.parse(localStorage.getItem("user"));

  const handleImageChange = (e) => {
    const newImages = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  let navigate = useNavigate();

  const handelProjectType = (e) => {
    const selectedType = e.target.value;
    setProjectType(selectedType);
  };

  const handelProjectSector = (e) => {
    setProjectSector(e.target.value);
  };

  const resetForm = () => {
    setSchoolName("");
    setContact("");
    setEmail("");
    setEndDate("");
    setDescription("");
    setAccountNumber("");
    setIFSC("");
    setUPI("");
    setRecommendBY("");
    setProjectName("");
    setLandDetails("");
    setTaluk("");
    setVillage("");
    setDistrict("");
    setProjectObjective("");
    setProjectParticular("");
    setTotalPopulation("");
    setProjectType("");
    setProjectSector("");
    setFundRaiserName("");
  };

  const AddProjectDataDirectly = async (event) => {
    event.preventDefault();
    if (!images.frontPic) {
      alert("Front image is mandatory!");
      return;
    }
    if (!images.assemblyPic) {
      alert("Assembly image is mandatory!");
      return;
    }
    const formData = new FormData();
    if (projectType === "1") {
      if (projectSector === "infrastructure") {
        if (
          !selectedSchool ||
          !village ||
          !taluk ||
          !fundRaiserName ||
          !contact ||
          !email ||
          !description ||
          !amount
        ) {
          alert("Please fill in all required fields.");
          return;
        }
        formData.append("projectType", projectType);
        formData.append("schoolName", selectedSchool);
        formData.append("projectSector", projectSector);
        formData.append("village", village);
        formData.append("taluk", taluk);
        formData.append("zone", zone);
        formData.append("fundRaiserName", fundRaiserName);
        formData.append("contact", contact);
        formData.append("email", email);
        formData.append("amount", amount);
        formData.append("description", description);
        const orderedImages = [
          images.frontPic,
          images.assemblyPic,
          ...images.otherImages
        ].filter(Boolean);
        orderedImages.forEach((image, index) => {
          if (image) {
            formData.append('images', image);
          }
        });
        for (let i = 0; i < images.length; i++) {
          formData.append("images", images[i]);
        }
        const transformedRows = transformRows(rows);
        if (transformedRows.length > 0) {
          formData.append("items", JSON.stringify(transformedRows));
        }
      } else if (projectSector === "training") {
        if (
          !schoolName ||
          !village ||
          !taluk ||
          !zone ||
          !district ||
          !fundRaiserName ||
          !contact ||
          !email ||
          !edate ||
          !amount ||
          !description ||
          !accountNumber ||
          !IFSC ||
          !UPI ||
          !recommendedBy
        ) {
          alert("Please fill in all required fields.");
          return;
        }
        formData.append("projectType", projectType);
        formData.append("schoolName", schoolName);
        formData.append("projectSector", projectSector);
        formData.append("village", village);
        formData.append("taluk", taluk);
        formData.append("zone", zone);
        formData.append("district", district);
        formData.append("fundRaiserName", fundRaiserName);
        formData.append("contact", contact);
        formData.append("email", email);
        formData.append("edate", edate);
        formData.append("amount", amount);
        formData.append("description", description);
        formData.append("accountNumber", accountNumber);
        formData.append("ifscCode", IFSC);
        formData.append("upiNumber", UPI);
        formData.append("recommended", recommendedBy);
        images.forEach((image, index) => {
          formData.append(`images`, image);
        });
      } else if (projectSector === "newConstruction") {
        if (
          !projectName ||
          !village ||
          !taluk ||
          !district ||
          !fundRaiserName ||
          !contact ||
          !email ||
          !edate ||
          !amount ||
          !description ||
          !accountNumber ||
          !IFSC ||
          !UPI ||
          !recommendedBy ||
          !landDetails
        ) {
          alert("Please fill in all required fields.");
          return;
        }
        formData.append("projectType", projectType);
        formData.append("projectName", projectName);
        formData.append("projectSector", projectSector);
        formData.append("village", village);
        formData.append("taluk", taluk);
        formData.append("district", district);
        formData.append("fundRaiserName", fundRaiserName);
        formData.append("contact", contact);
        formData.append("email", email);
        formData.append("edate", edate);
        formData.append("amount", amount);
        formData.append("description", description);
        formData.append("accountNumber", accountNumber);
        formData.append("ifscCode", IFSC);
        formData.append("upiNumber", UPI);
        formData.append("recommended", recommendedBy);
        formData.append("landDetails", landDetails);
        images.forEach((image, index) => {
          formData.append(`images`, image);
        });
      } else {
        alert("Please select the project sector");
      }

      try {
        setSubmited(true);
        const response = await fetch(
          // "http://localhost:2000/admin/addEducationData",
          `${backendUrl}/admin/addEducationData`,
          {
            method: "POST",
            headers: {
              authorization: `bearer${JSON.parse(
                localStorage.getItem("token")
              )}`,
            },
            body: formData,
          }
        ).catch((error) => console.error("Error:", error));

        const result = await response.json();
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        } else if (response.status === 200) {
          alert(result.message);
          resetForm();
        } else if (response.status === 500) {
          alert("Enter all fields");
        } else {
          alert("Something went wrong");
        }
      } catch (error) {
        console.error("Error uploading data", error);
      } finally {
        setSubmited(false);
      }
    } else if (projectType === "2") {
      if (
        !projectName ||
        !village ||
        !taluk ||
        !district ||
        !projectParticular ||
        !projectObjective ||
        !fundRaiserName ||
        !contact ||
        !email ||
        !edate ||
        !amount ||
        !accountNumber ||
        !IFSC ||
        !UPI ||
        !recommendedBy ||
        !totalPopulation ||
        !landDetails
      ) {
        alert("Please fill in all required fields.");
        return;
      }
      formData.append("projectType", projectType);
      formData.append("projectName", projectName);
      formData.append("village", village);
      formData.append("taluk", taluk);
      formData.append("district", district);
      formData.append("projectParticular", projectParticular);
      formData.append("projectObjective", projectObjective);
      formData.append("fundRaiserName", fundRaiserName);
      formData.append("contact", contact);
      formData.append("email", email);
      formData.append("edate", edate);
      formData.append("amount", amount);
      formData.append("accountNumber", accountNumber);
      formData.append("ifscCode", IFSC);
      formData.append("upiNumber", UPI);
      formData.append("recommended", recommendedBy);
      formData.append("totalPopulation", totalPopulation);
      formData.append("landDetails", landDetails);
      images.forEach((image, index) => {
        formData.append(`images`, image);
      });

      try {
        setSubmited(true);
        const response = await fetch(
          // "http://localhost:2000/admin/addPublicSpacesData",
          `${backendUrl}/admin/addPublicSpacesData`,
          {
            method: "POST",
            headers: {
              authorization: `bearer${JSON.parse(
                localStorage.getItem("token")
              )}`,
            },
            body: formData,
          }
        );

        await response.json();
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        } else if (response.status === 200) {
          navigate(`/adminDashboard/${ID}`);
        } else if (response.status === 500) {
          alert("Enter all fields");
        } else {
          alert("Something went wrong");
        }
      } catch (error) {
        console.error("Error uploading data", error);
      } finally {
        setSubmited(false);
      }
    } else if (projectType === "3") {
    } else {
      alert("Select the type of project which you want to do");
    }
  };

  const AddProjectData = async (event) => {
    event.preventDefault();
    if (!images.frontPic) {
      alert("Front image is mandatory!");
      return;
    }
    if (!images.assemblyPic) {
      alert("Assembly image is mandatory!");
      return;
    }
    const formData = new FormData();

    if (projectType === "1") {
      if (projectSector === "infrastructure") {
        if (
          !selectedSchool ||
          !village ||
          !taluk ||
          !zone ||
          !fundRaiserName ||
          !description ||
          !contact ||
          !email ||
          !amount

        ) {
          alert("Please fill in all required fields.");
          return;
        }
        formData.append("projectType", projectType);
        formData.append("schoolName", selectedSchool);
        formData.append("projectSector", projectSector);
        formData.append("village", village);
        formData.append("taluk", taluk);
        formData.append("zone", zone);
        formData.append("fundRaiserName", fundRaiserName);
        formData.append("contact", contact);
        formData.append("email", email);
        formData.append("amount", amount);
        formData.append("description", description);
        const orderedImages = [
          images.frontPic,
          images.assemblyPic,
          ...images.otherImages
        ].filter(Boolean);
        orderedImages.forEach((image, index) => {
          if (image) {
            formData.append('images', image);
          }
        });
        const transformedRows = transformRows(rows);
        if (transformedRows.length > 0) {
          formData.append("items", JSON.stringify(transformedRows));
        }
      } else if (projectSector === "training") {
        if (
          !schoolName ||
          !village ||
          !taluk ||
          !district ||
          !fundRaiserName ||
          !contact ||
          !email ||
          !edate ||
          !amount ||
          !description ||
          !accountNumber ||
          !IFSC ||
          !UPI ||
          !recommendedBy
        ) {
          alert("Please fill in all required fields.");
          return;
        }
        formData.append("projectType", projectType);
        formData.append("schoolName", schoolName);
        formData.append("projectSector", projectSector);
        formData.append("village", village);
        formData.append("taluk", taluk);
        formData.append("district", district);
        formData.append("fundRaiserName", fundRaiserName);
        formData.append("contact", contact);
        formData.append("email", email);
        formData.append("edate", edate);
        formData.append("amount", amount);
        formData.append("description", description);
        formData.append("accountNumber", accountNumber);
        formData.append("ifscCode", IFSC);
        formData.append("upiNumber", UPI);
        formData.append("recommended", recommendedBy);
        images.forEach((image, index) => {
          formData.append(`images`, image);
        });
      } else if (projectSector === "newConstruction") {
        if (
          !projectName ||
          !village ||
          !taluk ||
          !district ||
          !fundRaiserName ||
          !contact ||
          !email ||
          !edate ||
          !amount ||
          !description ||
          !accountNumber ||
          !IFSC ||
          !UPI ||
          !recommendedBy ||
          !landDetails
        ) {
          alert("Please fill in all required fields.");
          return;
        }
        formData.append("projectType", projectType);
        formData.append("projectName", projectName);
        formData.append("projectSector", projectSector);
        formData.append("village", village);
        formData.append("taluk", taluk);
        formData.append("district", district);
        formData.append("fundRaiserName", fundRaiserName);
        formData.append("contact", contact);
        formData.append("email", email);
        formData.append("edate", edate);
        formData.append("amount", amount);
        formData.append("description", description);
        formData.append("accountNumber", accountNumber);
        formData.append("ifscCode", IFSC);
        formData.append("upiNumber", UPI);
        formData.append("recommended", recommendedBy);
        formData.append("landDetails", landDetails);
        images.forEach((image, index) => {
          formData.append(`images`, image);
        });
      } else {
        alert("Please select the project sector");
      }

      try {
        setSubmited(true);
        const response = await fetch(
          // "http://localhost:2000/operator/operatorAddEducationData",
          `${backendUrl}/operator/operatorAddEducationData`,
          {
            method: "POST",
            headers: {
              authorization: `bearer${JSON.parse(
                localStorage.getItem("token")
              )}`,
            },
            body: formData,
          }
        );
        const result = await response.json();
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        } else if (response.status === 200) {
          alert(result.message);
          resetForm();
        } else if (response.status === 500) {
          alert("Enter all fields");
        } else {
          alert("Something went wrong");
        }
      } catch (error) {
        console.error("Error uploading data", error);
      } finally {
        setSubmited(false);
      }
    } else if (projectType === "2") {
      if (
        !projectName ||
        !village ||
        !taluk ||
        !zone ||
        !district ||
        !projectParticular ||
        !projectObjective ||
        !fundRaiserName ||
        !contact ||
        !email ||
        !edate ||
        !amount ||
        !accountNumber ||
        !IFSC ||
        !UPI ||
        !recommendedBy ||
        !totalPopulation ||
        !landDetails
      ) {
        alert("Please fill in all required fields.");
        return;
      }
      formData.append("projectType", projectType);
      formData.append("projectName", projectName);
      formData.append("village", village);
      formData.append("taluk", taluk);
      formData.append("zone", zone);
      formData.append("district", district);
      formData.append("projectParticular", projectParticular);
      formData.append("projectObjective", projectObjective);
      formData.append("fundRaiserName", fundRaiserName);
      formData.append("contact", contact);
      formData.append("email", email);
      formData.append("edate", edate);
      formData.append("amount", amount);
      formData.append("accountNumber", accountNumber);
      formData.append("ifscCode", IFSC);
      formData.append("upiNumber", UPI);
      formData.append("recommended", recommendedBy);
      formData.append("totalPopulation", totalPopulation);
      formData.append("landDetails", landDetails);
      images.forEach((image, index) => {
        formData.append(`images`, image);
      });

      try {
        setSubmited(true);
        const response = await fetch(
          // "http://localhost:2000/operator/operatorAddPublicSpacesData",
          `${backendUrl}/operator/operatorAddPublicSpacesData`,
          {
            method: "POST",
            headers: {
              authorization: `bearer${JSON.parse(
                localStorage.getItem("token")
              )}`,
            },
            body: formData,
          }
        );
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        } else if (response.status === 200) {
          navigate(`/operatorDashboard/${ID}`);
        } else if (response.status === 500) {
          alert("Enter all fields");
        } else {
          alert("Something went wrong");
        }
      } catch (error) {
        console.error("Error uploading data", error);
      } finally {
        setSubmited(false);
      }
    } else if (projectType === "3") {
    } else {
      alert("Select the type of project which you want to do");
    }
  };

  const schools = zone ? zoneSchoolMap[zone] || {} : {};
  const filteredSchools = Object.keys(schools).filter(school => {
    const schoolCode = schools[school];
    return (
      school.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schoolCode.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }).map(school => ({
    name: school,
    code: schools[school]
  }));

  const handleSelectSchool = (schoolObj) => {
    setSearchQuery(`${schoolObj.name} - ${schoolObj.code}`); // Set search query with name and code
    setSelectedSchool(`${schoolObj.name} - ${schoolObj.code}`); // Ensure the selected school includes both name and code
    setIsDropdownOpen(false); // Close the dropdown
  };

  const handleInChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsDropdownOpen(true);
    setSelectedSchool('');
  };

  const handleBackspace = (e) => {
    if (e.key === 'Backspace' && searchQuery === '') {
      setSelectedSchool('');
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      // Check if the current search query matches any school
      const matchedSchool = Object.values(zoneSchoolMap[zone] || []).find(schoolObj =>
        `${schoolObj.name} - ${schoolObj.code}`.toLowerCase() === searchQuery.toLowerCase()
      );

      if (!matchedSchool) {
        // Only clear if nothing is selected
        setSearchQuery('');
      }
    }, 100); // Short delay to allow selection to be processed
  };

  return (
    <Sidebar>
     
        <form className="form" onKeyDown={handleKeyDown}>
          <h1>Create Project</h1>
          <div
            className="input-container"
            value={projectType}
            onChange={handelProjectType}
          >
            <label htmlFor="Category" className="d-flex">
              Select Project Type:
            </label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label
                htmlFor="education"
                style={{
                  minWidth: "100px",
                  marginRight: "10px",
                  cursor: "pointer",
                }}
              >
                Education
              </label>
              <input
                type="radio"
                id="education"
                name="Category"
                value="1"
                required
                checked={projectType === "1"}
                style={{ cursor: "pointer" }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center" }} disabled>
              <label
                htmlFor="publicSpace"
                style={{
                  minWidth: "100px",
                  marginRight: "10px",
                  color: "gray"
                }}
              >
                Public Space
              </label>
              <input
                type="radio"
                id="publicSpace"
                name="Category"
                value="2"
                required
                disabled
              />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label
                htmlFor="health"
                style={{
                  minWidth: "100px",
                  marginRight: "10px",
                  color: "gray"
                }}
              >
                Health
              </label>
              <input
                type="radio"
                id="health"
                name="Category"
                value="3"
                required
                disabled
              />
            </div>
          </div>

          {projectType === "1" ? (
            <>
              <div className="input-container">
                <label>Select the field which you need</label>
                <select
                  name="select"
                  value={projectSector}
                  id="select"
                  onChange={handelProjectSector}
                  required
                >
                  <option value="" disabled>
                    Select Field
                  </option>
                  <option value="training" disabled>Training Programs</option>
                  <option value="infrastructure">
                    Infrastructure Development
                  </option>
                  <option value="newConstruction" disabled>
                    New School/College Construction
                  </option>
                </select>
              </div>
              {projectSector === "infrastructure" ? (
                <>
                  <div className="input-container">
                    <label htmlFor="zone">Block</label>
                    <select
                      id="zone"
                      value={zone}
                      onChange={(e) => {
                        handleZoneChange(e);
                        setZone(e.target.value);
                        setSelectedSchool("");
                        setSearchQuery("");
                      }}
                      required
                    >
                      <option value="">Select a Block</option>
                      <option value="Bantwal">Bantwal</option>
                      <option value="Belthangady">Belthangady</option>
                      <option value="MangloreNorth">Manglore North</option>
                      <option value="MangloreSouth">Manglore South</option>
                      <option value="Moodabidre">Moodabidre</option>
                      <option value="Puttur">Puttur</option>
                      <option value="Sullia">Sullia</option>
                    </select>
                  </div>

                  <div className="input-container">
                    <label htmlFor="taluk">Taluk Name</label>
                    <input
                      id="taluk"
                      type="text"
                      value={taluk}
                      readOnly
                      required
                    />
                  </div>

                  {zone && (
                    <div className="input-container">
                      <label htmlFor="school">School Name</label>
                      <div className="custom-select-container">
                        <input
                          type="text"
                          placeholder="Search school or code..."
                          value={searchQuery || selectedSchool}
                          onFocus={() => setIsDropdownOpen(true)}
                          onChange={handleInChange}
                          onBlur={handleBlur}
                          onKeyDown={handleBackspace}
                          className="select-input"
                          required
                        />

                        {isDropdownOpen && filteredSchools.length > 0 && (
                          <ul className="custom-dropdown">
                            {filteredSchools.map((schoolObj, index) => (
                              <li
                                key={index}
                                onMouseDown={() =>
                                  handleSelectSchool(schoolObj)
                                }
                                className="dropdown-item"
                              >
                                {schoolObj.name} - {schoolObj.code}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="input-container">
                    <label htmlFor="text">Village name</label>
                    <input
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      placeholder="Enter the village name"
                      required
                    />
                  </div>

                  <div className="input-container">
                    <label htmlFor="about">School Description</label>
                    <textarea
                      name="about"
                      id="about"
                      cols="60"
                      rows="10"
                      maxlength="3000"
                      placeholder="Few Words About School"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className="input-container">
                    <label htmlFor="text">Headmaster/Headmistress Name</label>
                    <input
                      type="text"
                      value={fundRaiserName}
                      onChange={(e) => setFundRaiserName(e.target.value)}
                      placeholder="Enter the Name of school head"
                      required
                    />
                  </div>

                  <div className="input-container">
                    <label htmlFor="contact">
                      Headmaster/Headmistress Contact Number
                    </label>
                    <input
                      type="number"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      onWheel={(e) => e.target.blur()}
                      placeholder="Enter Phone number"
                      required
                    />
                  </div>

                  <div className="input-container">
                    <label htmlFor="contact">
                      School Headmaster/Headmistress Email
                    </label>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email-id"
                    />
                  </div>

                  <div className="input-container">
                    <label>Front Image of School</label>
                    <div className="d-flex align-items-center" style={{ gap: "10px" }}>
                      <input
                        type="file"
                        onChange={(e) => handleSingleImageChange(e, "frontPic")}
                        ref={frontPicInputRef} 
                      />
                      <button
                        type="button"
                        onClick={() => {
                          frontPicInputRef.current.value = null; 
                          handleSingleImageChange(null, "frontPic");
                        }}
                        style={{
                          cursor: "pointer",
                          background: "#f44336", 
                          color: "#fff",
                          border: "none",
                          padding: "5px 10px",
                          borderRadius: "4px",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="input-container">
                    <label>Image of Assembly</label>
                    <div className="d-flex align-items-center" style={{ gap: "10px" }}>
                      <input
                        type="file"
                        onChange={(e) => handleSingleImageChange(e, "assemblyPic")}
                        ref={assemblyPicInputRef} 
                      />
                      <button
                        type="button"
                        onClick={() => {
                          assemblyPicInputRef.current.value = null; 
                          handleSingleImageChange(null, "assemblyPic"); 
                        }}
                        style={{
                          cursor: "pointer",
                          background: "#f44336", 
                          color: "#fff",
                          border: "none",
                          padding: "5px 10px",
                          borderRadius: "4px",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="input-container">
                    <label>Other Images (you can select multiple)</label>
                    <div className="d-flex align-items-center" style={{ gap: "10px" }}>
                      <input
                        type="file"
                        multiple
                        onChange={handleOtherImagesChange}
                        ref={otherImagesInputRef} // Reference for clearing the input field
                      />
                      <button
                        type="button"
                        onClick={() => {
                          otherImagesInputRef.current.value = null; // Clear the input
                          handleOtherImagesChange(null); // Reset other images
                        }}
                        style={{
                          cursor: "pointer",
                          background: "#f44336", // Red color for 'Remove' button
                          color: "#fff",
                          border: "none",
                          padding: "5px 10px",
                          borderRadius: "4px",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/*new row dynamic creatiom*/}

                  <div className="dynamic-row">
                    <label htmlFor="requirements">Add your requirements</label>

                    {Object.keys(rows).map((key) => {
                      const row = rows[key];

                      return (
                        <div key={key} className="form-row">
                          <input
                            type="text"
                            placeholder="Sl No"
                            value={row.slno}
                            readOnly
                            className="input-fieldsl"
                          />

                          {row.isOther ? (
                            <input
                              type="text"
                              placeholder="Enter Infrastructure"
                              value={row.infrastructure}
                              onChange={(e) =>
                                handleInputChange(
                                  key,
                                  "infrastructure",
                                  e.target.value
                                )
                              }
                              className="input-field"
                            />
                          ) : (
                            <select
                              value={row.infrastructure || ""} // Ensure the value is correctly set here
                              onChange={(e) =>
                                handleSelectChange(key, e.target.value)
                              }
                              className="input-field"
                            >
                              <option value="">Select an option</option>
                              {getFilteredOptions().map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          )}
                          <input
                            type="text"
                            value={row.infrastructure || "No option selected"}
                            readOnly
                            className="input-field"
                          />

                          <input
                            type="number"
                            placeholder="Quantity"
                            value={row.demandNo}
                            onChange={(e) =>
                              handleInputChange(key, "demandNo", e.target.value)
                            }
                            onWheel={(e) => e.target.blur()}
                            className="input-field"
                          />
                          <input
                            type="number"
                            placeholder="Estimated Cost"
                            value={row.estimatedCost}
                            onChange={(e) =>
                              handleInputChange(
                                key,
                                "estimatedCost",
                                e.target.value
                              )
                            }
                            onWheel={(e) => e.target.blur()}
                            className="input-field"
                          />
                          <input
                            type="text"
                            placeholder="Total Cost"
                            value={row.totalCost}
                            readOnly
                            className="input-field"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteRow(key)}
                            className="delete-row-button"
                          >
                            Delete
                          </button>
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={handleAddRow}
                      className="add-row-button"
                    >
                      + Add Row
                    </button>
                  </div>

                  <div className="input-container">
                    <label>Total amount required </label>
                    <input
                      type="text"
                      value={amount}
                      placeholder="Enter the total amount required"
                      required
                      disabled
                    />
                  </div>

                  <div
                    className="d-flex align-items-center" // Change to align-items-center for vertical centering
                    style={{
                      width: "60%",
                      gap: "20px",
                      fontSize: "20px",
                    }}
                  >
                    <input
                      type="checkbox"
                      id="confirm-details"
                      checked={isCheckboxChecked}
                      onChange={handleCheckboxChange}
                      style={{
                        marginLeft: "0px",
                        width: "24px", // Set desired width
                        height: "24px", // Set desired height
                        cursor: "pointer",
                        marginRight: "2px", // Adds space between checkbox and label
                      }}
                    />
                    <label htmlFor="confirm-details" style={{ margin: 0, color: "red" }}>
                      I confirm the above-entered details are correct
                    </label>
                  </div>
                </>
              ) : projectSector === "newConstruction" ? (
                <>
                  <div className="input-container">
                    <label htmlFor="firstname">Project Name</label>
                    <input
                      type="text"
                      value={projectName}
                      placeholder="Name"
                      required
                      onChange={(e) => setProjectName(e.target.value)}
                    />
                  </div>
                  <div className="input-container">
                    <label htmlFor="text">Village name</label>
                    <input
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      placeholder="Enter the village name"
                      required
                    />
                  </div>
                  <div className="input-container">
                    <label htmlFor="text">Taluk name</label>
                    <input
                      type="text"
                      value={taluk}
                      onChange={(e) => setTaluk(e.target.value)}
                      placeholder="Enter the taluk name"
                      required
                    />
                  </div>
                  <div className="input-container">
                    <label htmlFor="text">District name</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="Enter the district name"
                      required
                    />
                  </div>

                  <div className="input-container">
                    <label htmlFor="about">Description of Project</label>
                    <textarea
                      name="about"
                      id="about"
                      cols="30"
                      rows="10"
                      placeholder="About the Project"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className="input-container">
                    <label htmlFor="edate">Land Measurments in acres</label>
                    <input
                      type="text"
                      value={landDetails}
                      onChange={(e) => setLandDetails(e.target.value)}
                      placeholder="Enter the Land measurements"
                      required
                    />
                  </div>

                  <div className="input-container">
                    <label htmlFor="text">Name of fund raiser</label>
                    <input
                      type="text"
                      value={fundRaiserName}
                      onChange={(e) => setFundRaiserName(e.target.value)}
                      placeholder="Enter the Name of fund raiser"
                      required
                    />
                  </div>
                  <div className="input-container">
                    <label htmlFor="contact">Contact</label>
                    <input
                      type="number"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="Enter Phone number"
                      required
                    />
                  </div>
                  <div className="input-container">
                    <label htmlFor="contact">Email-ID </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email-id"
                    />
                  </div>
                  <div className="input-container">
                    <label htmlFor="edate">Fund Raising Deadline(Date) </label>
                    <input
                      type="date"
                      value={edate}
                      onChange={(e) => setEndDate(e.target.value)}
                      placeholder="Enter the date"
                      required
                    />
                  </div>
                  <div className="input-container">
                    <label htmlFor="edate">Total amount required </label>
                    <input
                      type="text"
                      value={amount}
                      placeholder="Enter the total amount required"
                      required
                    />
                  </div>

                  <div className="input-container">
                    <h5>Bank Details:</h5>
                    <label>A/C No:</label>
                    <input
                      type="text"
                      placeholder="Enter the Account Number:"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-container">
                    <label>IFSC Code:</label>
                    <input
                      type="text"
                      placeholder="Enter the IFSC Code:"
                      value={IFSC}
                      onChange={(e) => setIFSC(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-container">
                    <label>UPI Number:</label>
                    <input
                      type="text"
                      placeholder="Enter the UPI Number:"
                      value={UPI}
                      onChange={(e) => setUPI(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-container">
                    <label>Recommended by:</label>
                    <input
                      type="text"
                      placeholder="Ex: BEO, DC..."
                      value={recommendedBy}
                      onChange={(e) => setRecommendBY(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-container">
                    <label>Images</label>
                    <input type="file" multiple onChange={handleImageChange} />
                  </div>
                </>
              ) : (
                <></>
              )}
            </>
          ) : projectType === "2" ? (
            <>
              <div className="input-container">
                <label htmlFor="firstname">Project Name</label>
                <input
                  type="text"
                  value={projectName}
                  placeholder="Name"
                  required
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>

              <div className="input-container">
                <label htmlFor="text">Village name</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="Enter the village name"
                  required
                />
              </div>

              <div className="input-container">
                <label htmlFor="text">Taluk name</label>
                <input
                  type="text"
                  value={taluk}
                  onChange={(e) => setTaluk(e.target.value)}
                  placeholder="Enter the taluk name"
                  required
                />
              </div>

              <div className="input-container">
                <label htmlFor="text">District name</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Enter the district name"
                  required
                />
              </div>

              <div className="input-container">
                <label>Project Particular</label>
                <input
                  type="text"
                  value={projectParticular}
                  onChange={(e) => setProjectParticular(e.target.value)}
                  placeholder="Enter the Project which you want"
                  required
                />
              </div>

              <div className="input-container">
                <label>Benifishory population</label>
                <input
                  type="text"
                  value={totalPopulation}
                  onChange={(e) => setTotalPopulation(e.target.value)}
                  placeholder="Enter the benifishory population in that area"
                  required
                />
              </div>

              <div className="input-container">
                <label>Land Measurments in acres</label>
                <input
                  type="text"
                  value={landDetails}
                  onChange={(e) => setLandDetails(e.target.value)}
                  placeholder="Enter the land measurements"
                  required
                />
              </div>

              <div className="input-container">
                <label htmlFor="text">Name of fund raiser</label>
                <input
                  type="text"
                  value={fundRaiserName}
                  onChange={(e) => setFundRaiserName(e.target.value)}
                  placeholder="Enter the Name of fund raiser"
                  required
                />
              </div>

              <div className="input-container">
                <label htmlFor="contact">Contact</label>
                <input
                  type="number"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Enter Phone number"
                  required
                />
              </div>

              <div className="input-container">
                <label htmlFor="contact">Email-ID </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email-id"
                />
              </div>
              <div className="input-container">
                <label htmlFor="edate">Fund Raising Deadline(Date) </label>
                <input
                  type="date"
                  value={edate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="Enter the date"
                  required
                />
              </div>

              <div className="input-container">
                <label htmlFor="edate">Total amount required </label>
                <input
                  type="text"
                  value={amount}
                  placeholder="Enter the total amount required"
                  required
                />
              </div>

              <div className="input-container">
                <label htmlFor="about">Project goal and objectives</label>
                <textarea
                  name="about"
                  id="about"
                  cols="30"
                  rows="10"
                  placeholder="About the Project"
                  value={projectObjective}
                  onChange={(e) => setProjectObjective(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="input-container">
                <h5>Bank Details:</h5>
                <label>A/C No:</label>
                <input
                  type="text"
                  placeholder="Enter the Account Number:"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                />
              </div>

              <div className="input-container">
                <label>IFSC Code:</label>
                <input
                  type="text"
                  placeholder="Enter the IFSC Code:"
                  value={IFSC}
                  onChange={(e) => setIFSC(e.target.value)}
                  required
                />
              </div>

              <div className="input-container">
                <label>UPI Number:</label>
                <input
                  type="text"
                  placeholder="Enter the UPI Number:"
                  value={UPI}
                  onChange={(e) => setUPI(e.target.value)}
                  required
                />
              </div>

              <div className="input-container">
                <label>Recommended by:</label>
                <input
                  type="text"
                  placeholder="Ex: BEO, DC..."
                  value={recommendedBy}
                  onChange={(e) => setRecommendBY(e.target.value)}
                  required
                />
              </div>

              <div className="input-container">
                <label>Images</label>
                <input type="file" multiple onChange={handleImageChange} />
              </div>
            </>
          ) : projectType === "3" ? (
            <>
              <h1>Hello</h1>
            </>
          ) : (
            <></>
          )}

          <div className="d-flex justify-content-center pb-3">
            <button type="submit" value="reset" onClick={resetForm}>
              Reset
            </button>
            {ID === "1" ? (
              <button
                type="submit"
                className="loader"
                onClick={AddProjectDataDirectly}
                disabled={!isCheckboxChecked || submited}
              >
                {submited ? "Submited..." : "Submit"}
              </button>
            ) : (
              <button
                type="submit"
                onClick={AddProjectData}
                disabled={!isCheckboxChecked || submited}
                className="loader"
              >
                {submited ? "Submited..." : "Submit"}
              </button>
            )}
          </div>
        </form>
    </Sidebar>
  );
};

export default AddProject;


