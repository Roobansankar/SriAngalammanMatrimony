// import React, { useState, useRef, useEffect } from "react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import "./BiodataDisplay.css";
// import headerpic from "./Assets/header.png";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function safeParseChart(value) {
//   if (!value || value === "" || value === "[]" || value === null) return [];

//   try {
//     const parsed = JSON.parse(value);
//     if (Array.isArray(parsed)) return parsed;
//   } catch (e) {}

//   return value
//     .split(",")
//     .map((x) => x.trim())
//     .filter((x) => x !== "");
// }

// export default function BiodataDisplay({ setUser: setAppUser }) {
//   const [biodataList, setBiodataList] = useState([]);
//   const [selectedId, setSelectedId] = useState(null);
//   const [currentData, setCurrentData] = useState(null);
//   const [downloading, setDownloading] = useState(false);
//   const printRef = useRef();

//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const emptyGrid = Array(12).fill("-");

//   // ----------------------------
//   // FETCH USER FROM API
//   // ----------------------------
//   useEffect(() => {
//     const email = localStorage.getItem("loggedInEmail");
//     if (!email) {
//       navigate("/login");
//       return;
//     }

//     const fetchUser = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/auth/user", {
//           params: { email },
//         });

//         console.log(res)

//         if (res.data?.success) {
//           const user = res.data.user;
//           if (typeof setAppUser === "function") setAppUser(user);

//           const mapped = {
//             id: user.ID,
//             type: user.Gender === "Male" ? "groom" : "bride",
//             name: user.Name || "",
//             date: user.Regdate?.slice(0, 10) || "",
//             birth_date: user.DOB?.slice(0, 10) || "",
//             birth_time: user.TOB || "",
//             birth_place: user.POB || "",
//             education: user.Education || "",
//             occupation: user.Occupation || "",
//             // company_details: `${user.occu_details || ""}, ${
//             //   user.workinglocation || ""
//             // }`,
//             company_details: user.company_name || "",

//             monthly_income: user.Annualincome || "",
//             height: user.HeightText || "",
//             weight: user.Weight || "",
//             complexion: user.Complexion || "",
//             family_deity: `-, ${user.City || ""}`,
//             kulam: user.Caste || "",
//             kootam: user.Subcaste || "",
//             father_name: user.Fathername || "",
//             father_phone: user.Mobile || "",
//             father_occupation: user.Fathersoccupation || "",
//             father_native_place: user.POB || "",
//             mother_name: user.Mothersname || "",
//             mother_phone: user.Mobile || "",
//             mother_occupation: user.Mothersoccupation || "",
//             mother_native_place: user.POB || "",
//             address: user.Address || "",
//             family_income: `${user.Annualincome || ""}, ${
//               user.family_wealth || ""
//             }`,
//             siblings_details: `${user.noofbrothers || 0} Brothers, ${
//               user.noofsisters || 0
//             } Sisters`,
//             star: user.Star || "",
//             rasi: user.Moonsign || "",
//             lagnam: user.Star || "",
//             suddham: "",
//             rahu: user.Raghu || "",
//             ketu: user.Keethu || "",
//             sevvai: user.Sevai || "",
//             // navamsam: emptyGrid,
//             // rasi_grid: emptyGrid,
//             navamsam: [
//               user.a1,
//               user.a2,
//               user.a3,
//               user.a4,
//               user.a5,
//               user.a6,
//               user.a7,
//               user.a8,
//               user.a9,
//               user.a10,
//               user.a11,
//               user.a12,
//             ],

//             rasi_grid: [
//               user.g1,
//               user.g2,
//               user.g3,
//               user.g4,
//               user.g5,
//               user.g6,
//               user.g7,
//               user.g8,
//               user.g9,
//               user.g10,
//               user.g11,
//               user.g12,
//             ],

//             dasa_balance: "",
//             other_notes: user.PartnerExpectations || "",
//             mail_id: user.ConfirmEmail || "",
//             blood_group: user.BloodGroup || "",
//           };

//           setBiodataList([mapped]);
//           setSelectedId(mapped.id);
//           setCurrentData(mapped);
//         } else {
//           navigate("/login");
//         }
//       } catch (err) {
//         navigate("/login");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [navigate, setAppUser]);

//   if (loading) return <div className="p-8">Loading...</div>;
//   if (!currentData) return <div className="p-8">No user found</div>;

//   // ----------------------------
//   // SELECT BIODATA
//   // ----------------------------
//   const handleBiodataSelect = (id) => {
//     const selected = biodataList.find((b) => b.id === id);
//     setSelectedId(id);
//     setCurrentData(selected);
//   };

//   // ----------------------------
//   // ORIGINAL PDF GENERATION
//   // ----------------------------
//   const downloadPDF = async () => {
//     setDownloading(true);
//     try {
//       const element = printRef.current;
//       element.classList.add("pdf-generation");

//       await new Promise((resolve) => setTimeout(resolve, 100));

//       const canvas = await html2canvas(element, {
//         scale: 2,
//         useCORS: true,
//         logging: false,
//         backgroundColor: "#ffffff",
//         width: 1275,
//         height: element.scrollHeight,
//       });

//       element.classList.remove("pdf-generation");

//       const pdf = new jsPDF({
//         orientation: "portrait",
//         unit: "mm",
//         format: "legal",
//       });

//       const imgWidth = 215.9;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
//       const imgData = canvas.toDataURL("image/png");
//       const pageHeight = 355.6;

//       if (imgHeight > pageHeight) {
//         const scaledHeight = pageHeight;
//         const scaledWidth = (canvas.width * pageHeight) / canvas.height;
//         const xOffset = (imgWidth - scaledWidth) / 2;
//         pdf.addImage(imgData, "PNG", xOffset, 0, scaledWidth, scaledHeight);
//       } else {
//         const yOffset = (pageHeight - imgHeight) / 2;
//         pdf.addImage(imgData, "PNG", 0, yOffset, imgWidth, imgHeight);
//       }

//       pdf.save(
//         `Biodata_${currentData.name}_${currentData.type}_${currentData.id}.pdf`
//       );
//     } catch (error) {
//       alert("Failed to generate PDF. Try again.");
//     } finally {
//       setDownloading(false);
//     }
//   };

//   const downloadBtnThemeClass =
//     currentData.type === "groom" ? "groom-theme" : "bride-theme";

//   return (
//     <div>
//       {/* BIODATA CONTENT + BUTTON BLOCK */}
//       {/* <div className="responsive-biodata-wrapper bg-[#FFF4E0] "> */}
//       {/* <div className="responsive-biodata-wrapper bg-gradient-to-br from-[#1e0036] via-[#3a0066] to-black"> */}
//       <div
//         className="responsive-biodata-wrapper bg-cover bg-center bg-no-repeat"
//         style={{
//           backgroundImage:
//             "url('https://static.vecteezy.com/system/resources/previews/021/430/833/original/abstract-colorful-dark-blue-and-purple-gradient-blurred-background-night-sky-gradient-blue-gradation-wallpaper-for-background-themes-abstract-background-in-purple-and-blue-tones-web-design-banner-vector.jpg')",
//         }}
//       >
//         {/* This bar is now a block above the design, aligned right */}
//         <div className="display-controls-bar">
//           {/* Dropdown kept for future, hidden via CSS */}
//           <div className="display-select-wrapper">
//             <label htmlFor="biodata-select">Select Biodata:</label>
//             <select
//               id="biodata-select"
//               value={selectedId}
//               onChange={(e) => handleBiodataSelect(parseInt(e.target.value))}
//             >
//               {biodataList.map((biodata) => (
//                 <option key={biodata.id} value={biodata.id}>
//                   {biodata.type === "groom" ? "Groom" : "Bride"} -{" "}
//                   {biodata.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <button
//             onClick={downloadPDF}
//             disabled={downloading}
//             className={`mt-20 display-download-btn ${downloadBtnThemeClass}`}
//           >
//             {downloading ? "Generating..." : "Download PDF"}
//           </button>
//         </div>

//         <div ref={printRef} className="display-biodata-container">
//           {/* HEADER */}
//           <div
//             style={{
//               backgroundColor:
//                 currentData.type === "groom" ? "#b3f0ab" : "#eabdd2",
//             }}
//             className="display-header"
//           >
//             <img
//               alt="header"
//               width={"1275px"}
//               height={"340px"}
//               src={headerpic}
//             />
//           </div>

//           <div className="display-div">
//             <h2>{currentData.type === "bride" ? "பெண்" : "ஆண்"} வரன் ஜாதகம்</h2>
//           </div>

//           <div className="display-form-content">
//             {/* NAME + DATE */}
//             <div className="display-form-row">
//               <span>
//                 பெயர்:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "720px" }}
//                 >
//                   <span className="display-data">{currentData.name}</span>
//                 </div>
//               </span>

//               <span>
//                 தேதி:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "280px" }}
//                 >
//                   <span className="display-data">{currentData.date}</span>
//                 </div>
//               </span>
//             </div>

//             {/* BIRTH SECTION */}
//             <div className="display-form-row">
//               <span>
//                 பிறந்த தேதி:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "188px" }}
//                 >
//                   <span className="display-data">{currentData.birth_date}</span>
//                 </div>
//                 பிறந்த நேரம்:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "188px" }}
//                 >
//                   <span className="display-data">{currentData.birth_time}</span>
//                 </div>
//                 பிறந்த ஊர்:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "200px" }}
//                 >
//                   <span className="display-data">
//                     {currentData.birth_place}
//                   </span>
//                 </div>
//               </span>
//             </div>

//             {/* EDUCATION / JOB */}
//             <div className="display-form-row">
//               <span>
//                 வரனின்படிப்பு:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "400px" }}
//                 >
//                   <span className="display-data">{currentData.education}</span>
//                 </div>
//                 வேலை:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "420px" }}
//                 >
//                   <span className="display-data">{currentData.occupation}</span>
//                 </div>
//               </span>
//             </div>

//             {/* COMPANY DETAILS */}
//             <div className="display-form-row">
//               <span>
//                 நிறுவனம் பெயர் & ஊர்:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "810px" }}
//                 >
//                   <span className="display-data">
//                     {currentData.company_details}
//                   </span>
//                 </div>
//               </span>
//             </div>

//             {/* INCOME / HEIGHT / WEIGHT */}
//             <div className="display-form-row">
//               <span>
//                 மாதவருமானம்:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "250px" }}
//                 >
//                   <span className="display-data">
//                     {currentData.monthly_income}
//                   </span>
//                 </div>
//                 உயரம்:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "80px" }}
//                 >
//                   <span className="display-data">{currentData.height}</span>
//                 </div>
//                 எடை:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "85px" }}
//                 >
//                   <span className="display-data">{currentData.weight}</span>
//                 </div>
//                 நிறம்:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "125px" }}
//                 >
//                   <span className="display-data">{currentData.complexion}</span>
//                 </div>
//               </span>
//             </div>

//             {/* FAMILY DEITY */}
//             <div className="display-form-row">
//               <span>
//                 குலதெய்வம்,ஊர்:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "912px" }}
//                 >
//                   <span className="display-data">
//                     {currentData.family_deity}
//                   </span>
//                 </div>
//               </span>
//             </div>

//             {/* KULAM + KOOTAM */}
//             <div className="display-form-row">
//               <span>
//                 குலம்:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "480px" }}
//                 >
//                   <span className="display-data">{currentData.kulam}</span>
//                 </div>
//                 , கூட்டம்:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "480px" }}
//                 >
//                   <span className="display-data">{currentData.kootam}</span>
//                 </div>
//               </span>
//             </div>

//             {/* FATHER */}
//             <div className="display-form-row">
//               <span>
//                 தந்தைப்பெயர்:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "425px" }}
//                 >
//                   <span className="display-data">
//                     {currentData.father_name}
//                   </span>
//                 </div>
//                 அலைபேசி:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "340px" }}
//                 >
//                   <span className="display-data">
//                     {currentData.father_phone}
//                   </span>
//                 </div>
//               </span>
//             </div>

//             {/* FATHER OCCUPATION */}
//             <div className="display-form-row">
//               <span>
//                 தந்தையின்பணி:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "425px" }}
//                 >
//                   <span className="display-data">
//                     {currentData.father_occupation}
//                   </span>
//                 </div>
//                 பூர்வீகம்:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "345px" }}
//                 >
//                   <span className="display-data">
//                     {currentData.father_native_place}
//                   </span>
//                 </div>
//               </span>
//             </div>

//             {/* MOTHER */}
//             <div className="display-form-row">
//               <span>
//                 தாய்பெயர்:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "458px" }}
//                 >
//                   <span className="display-data">
//                     {currentData.mother_name}
//                   </span>
//                 </div>
//                 அலைபேசி:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "358px" }}
//                 >
//                   <span className="display-data">
//                     {currentData.mother_phone}
//                   </span>
//                 </div>
//               </span>
//             </div>

//             {/* MOTHER OCCUPATION */}
//             <div className="display-form-row">
//               <span>
//                 தாயின்பணி:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "435px" }}
//                 >
//                   <span className="display-data">
//                     {currentData.mother_occupation}
//                   </span>
//                 </div>
//                 பூர்வீகம்:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "410px" }}
//                 >
//                   <span className="display-data">
//                     {currentData.mother_native_place}
//                   </span>
//                 </div>
//               </span>
//             </div>

//             {/* ADDRESS */}
//             <div className="display-form-row">
//               <span>
//                 முகவரி:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "1075px" }}
//                 >
//                   <span className="display-data">{currentData.address}</span>
//                 </div>
//               </span>
//             </div>

//             {/* FAMILY INCOME */}
//             <div className="display-form-row">
//               <span>
//                 குடும்பவருமானம்/வசதிகள்:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "745px" }}
//                 >
//                   <span className="display-data">
//                     {currentData.family_income}
//                   </span>
//                 </div>
//               </span>
//             </div>

//             {/* SIBLINGS */}
//             <div className="display-form-row">
//               <span>
//                 உடன்பிறந்தோர் விபரம்:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "820px" }}
//                 >
//                   <span className="display-data">
//                     {currentData.siblings_details}
//                   </span>
//                 </div>
//               </span>
//             </div>

//             {/* STAR / RASI / LAKNAM */}
//             <div className="display-form-row">
//               <span>
//                 நட்சத்திரம்:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "255px" }}
//                 >
//                   <span className="display-data">{currentData.star}</span>
//                 </div>
//                 இராசி:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "260px" }}
//                 >
//                   <span className="display-data">{currentData.rasi}</span>
//                 </div>
//                 லக்னம்:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "260px" }}
//                 >
//                   <span className="display-data">{currentData.lagnam}</span>
//                 </div>
//               </span>
//             </div>

//             {/* SUDDHAM / RAHU / KETU / SEVVAI */}
//             <div className="display-form-row">
//               <span>
//                 சுத்தம்:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "70px" }}
//                 >
//                   <span className="display-data">{currentData.suddham}</span>
//                 </div>
//                 ராகு:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "65px" }}
//                 >
//                   <span className="display-data">{currentData.rahu}</span>
//                 </div>
//                 கேது:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "65px" }}
//                 >
//                   <span className="display-data">{currentData.ketu}</span>
//                 </div>
//                 செவ்வாய்:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "65px" }}
//                 >
//                   <span className="display-data">{currentData.sevvai}</span>
//                 </div>
//               </span>
//             </div>

//             {/* HOROSCOPE GRIDS */}
//             <div className="display-grid">
//               {/* NAVAMSAM */}
//               <div
//                 className="display-container"
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(4, 1fr)",
//                   gridTemplateRows: "repeat(4, 1fr)",
//                   width: "400px",
//                   height: "400px",
//                   border: "2px solid #000",
//                   margin: "20px",
//                 }}
//               >
//                 {currentData.rasi_grid.map((val, i) => {
//                   const gridMap = [
//                     { row: 1, col: 1 },
//                     { row: 1, col: 2 },
//                     { row: 1, col: 3 },
//                     { row: 1, col: 4 },
//                     { row: 2, col: 4 },
//                     { row: 3, col: 4 },
//                     { row: 4, col: 4 },
//                     { row: 4, col: 3 },
//                     { row: 4, col: 2 },
//                     { row: 4, col: 1 },
//                     { row: 3, col: 1 },
//                     { row: 2, col: 1 },
//                   ];
//                   const pos = gridMap[i];

//                   return (
//                     <div
//                       key={i}
//                       style={{
//                         gridRow: pos.row,
//                         gridColumn: pos.col,
//                         border: "1px solid #000",
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         padding: "5px",
//                         textAlign: "center",
//                       }}
//                     >
//                      {safeParseChart(val).map((planet, idx) => (
// <div key={idx}>{planet}</div>
// ))}

//                     </div>
//                   );
//                 })}

//                 <div
//                   style={{
//                     gridRow: "2 / 4",
//                     gridColumn: "2 / 4",
//                     border: "1px solid #000",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   இராசி
//                 </div>
//               </div>

//               {/* RASI GRID */}
//               <div
//                 className="display-container"
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(4, 1fr)",
//                   gridTemplateRows: "repeat(4, 1fr)",
//                   width: "400px",
//                   height: "400px",
//                   border: "2px solid #000",
//                   margin: "20px",
//                 }}
//               >
//                 {currentData.navamsam.map((val, i) => {
//                   const gridMap = [
//                     { row: 1, col: 1 },
//                     { row: 1, col: 2 },
//                     { row: 1, col: 3 },
//                     { row: 1, col: 4 },
//                     { row: 2, col: 4 },
//                     { row: 3, col: 4 },
//                     { row: 4, col: 4 },
//                     { row: 4, col: 3 },
//                     { row: 4, col: 2 },
//                     { row: 4, col: 1 },
//                     { row: 3, col: 1 },
//                     { row: 2, col: 1 },
//                   ];
//                   const pos = gridMap[i];

//                   return (
//                     <div
//                       key={i}
//                       style={{
//                         gridRow: pos.row,
//                         gridColumn: pos.col,
//                         border: "1px solid #000",
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         padding: "5px",
//                         textAlign: "center",
//                       }}
//                     >
//                      {safeParseChart(val).map((planet, idx) => (
// <div key={idx}>{planet}</div>
// ))}

//                     </div>
//                   );
//                 })}

//                 <div
//                   style={{
//                     gridRow: "2 / 4",
//                     gridColumn: "2 / 4",
//                     border: "1px solid #000",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   நவாம்சம்
//                 </div>
//               </div>
//             </div>

//             {/* DASA BALANCE */}
//             <div className="display-form-row">
//               <span>
//                 திசைஇருப்பு:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "1025px" }}
//                 >
//                   <span className="display-data">
//                     {currentData.dasa_balance}
//                   </span>
//                 </div>
//               </span>
//             </div>

//             {/* OTHER NOTES */}
//             <div className="display-form-row">
//               <span>
//                 இதர குறிப்புகள்:
//                 <div
//                   className="display-placeholder"
//                   style={{ minWidth: "770px" }}
//                 >
//                   <span className="display-data">
//                     {currentData.other_notes}
//                   </span>
//                 </div>
//               </span>
//             </div>

//             {/* CONFIRMATION LINE */}
//             <div className="display-form-row">
//               <span>மேலேகண்ட விவரங்கள் அனைத்தும் உண்மை என உறுதிகூறுகிறோம்</span>
//             </div>

//             {/* FOOTER */}
//             <div className="display-footer-row">
//               <span className="display-purple-text">
//                 Mail ID: <p>{currentData.mail_id}</p>
//               </span>
//               <span className="display-red-text">
//                 Blood Group: <p>{currentData.blood_group}</p>
//               </span>
//               <span className="display-maroon-text">
//                 <b>பெற்றோர் / காப்பாளர்</b>
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import axios from "axios";
import html2canvas from "html2canvas";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import headerpic from "./Assets/header.png";
import "./BiodataDisplay.css";

function safeParseChart(value) {
  if (!value || value === "" || value === "[]" || value === null) return [];

  // Try JSON (["சூரியன்","சந்திரன்"])
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {}

  // Fallback: comma separated ("சூரியன், சந்திரன்")
  return value
    .split(",")
    .map((x) => x.trim())
    .filter((x) => x !== "");
}

export default function BiodataDisplay({ setUser: setAppUser }) {
  // eslint-disable-next-line no-unused-vars
  const [biodataList, setBiodataList] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [selectedId, setSelectedId] = useState(null);
  const [currentData, setCurrentData] = useState(null);
  const printRef = useRef();

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(false);
  const [mobileImage, setMobileImage] = useState(null);

  // Hidden clone container
  const cloneContainer = useRef(null);

  // Detect mobile
  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

 
  useEffect(() => {
    if (
      !isMobile ||
      !currentData ||
      !printRef.current ||
      !cloneContainer.current
    )
      return;

    // Reset clone container
    cloneContainer.current.innerHTML = "";

    // Clone DOM safely
    const cloned = printRef.current.cloneNode(true);
    cloneContainer.current.appendChild(cloned);

    // IMPORTANT FIX: force browser to render clone before html2canvas
    requestAnimationFrame(() => {
      setTimeout(async () => {
        try {
          const canvas = await html2canvas(cloned, {
            scale: 1,
            useCORS: true,
            backgroundColor: "#ffffff",
          });

          setMobileImage(canvas.toDataURL("image/png"));
        } catch (err) {
          console.error("Screenshot error:", err);
        }
      }, 200); // small delay, not 700ms
    });
  }, [isMobile, currentData]);

  // Fetch user
  useEffect(() => {
    const email = localStorage.getItem("loggedInEmail");
    if (!email) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/user", {
          params: { email },
        });

        if (res.data?.success) {
          const user = res.data.user;

          if (typeof setAppUser === "function") setAppUser(user);

          const mapped = {
            id: user.ID,
            type: user.Gender === "Male" ? "groom" : "bride",
            name: user.Name || "",
            date: user.Regdate?.slice(0, 10) || "",
            birth_date: user.DOB?.slice(0, 10) || "",
            birth_time: user.TOB || "",
            birth_place: user.POB || "",
            education: user.Education || "",
            occupation: user.Occupation || "",
            company_details: `${user.company_name || ""}, ${
              user.workinglocation || ""
            }`,
            monthly_income: user.Annualincome || "",
            height: user.HeightText || "",
            weight: user.Weight || "",
            complexion: user.Complexion || "",
            family_deity: `${user.Kuladeivam || ""}, ${user.City || ""}`,
            kulam: user.Caste || "",
            kootam: user.Subcaste || "",
            father_name: user.Fathername || "",
            father_phone: user.Mobile || "",
            father_occupation: user.Fathersoccupation || "",
            father_native_place: user.POB || "",
            mother_name: user.Mothersname || "",
            mother_phone: user.Mobile || "",
            mother_occupation: user.Mothersoccupation || "",
            mother_native_place: user.POB || "",
            address: user.Address || "",
            family_income: `${user.Annualincome || ""}, ${
              user.family_wealth || ""
            }`,
            siblings_details: `${user.noofbrothers || 0} Brothers, ${
              user.noofsisters || 0
            } Sisters`,
            star: user.Star || "",
            rasi: user.Moonsign || "",
            lagnam: user.Star || "",
            suddham: "",
            rahu: user.Raghu || "",
            ketu: user.Keethu || "",
            sevvai: user.Sevai || "",
            navamsam: [
              user.a1,
              user.a2,
              user.a3,
              user.a4,
              user.a5,
              user.a6,
              user.a7,
              user.a8,
              user.a9,
              user.a10,
              user.a11,
              user.a12,
            ],
            rasi_grid: [
              user.g1,
              user.g2,
              user.g3,
              user.g4,
              user.g5,
              user.g6,
              user.g7,
              user.g8,
              user.g9,
              user.g10,
              user.g11,
              user.g12,
            ],
            dasa_balance: user.ThesaiIrupu || "",
            other_notes: user.PartnerExpectations || "",
            mail_id: user.ConfirmEmail || "",
            blood_group: user.BloodGroup || "",
          };

          setBiodataList([mapped]);
          setCurrentData(mapped);
          setSelectedId(mapped.id);
        } else navigate("/login");
      } catch {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate, setAppUser]);

  if (loading) return <div>Loading...</div>;
  if (!currentData) return <div>No user found</div>;

  return (
    // <div>
    <div
      className="responsive-biodata-wrapper bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://static.vecteezy.com/system/resources/previews/021/430/833/original/abstract-colorful-dark-blue-and-purple-gradient-blurred-background-night-sky-gradient-blue-gradation-wallpaper-for-background-themes-abstract-background-in-purple-and-blue-tones-web-design-banner-vector.jpg')",
      }}
    >
      {/* MOBILE IMAGE OUTPUT */}
      {isMobile && mobileImage && (
        <div className="mobile-image-view">
          <img
            src={mobileImage}
            style={{ width: "100%" }}
            alt="biodata"
            className="mt-16"
          />
        </div>
      )}

      {/* DESKTOP VIEW */}
      <div className="desktop-view">
        <div className="responsive-biodata-wrapper">
          <div
            ref={printRef}
            className="display-biodata-container"
            style={{ marginTop: "132px" }}
          >
            {/* HEADER */}
            <div
              className="display-header"
              style={{
                backgroundColor:
                  currentData.type === "groom" ? "#b3f0ab" : "#eabdd2",
              }}
            >
              <img src={headerpic} alt="header" />
            </div>

            <div className="display-div">
              <h2>
                {currentData.type === "bride" ? "பெண்" : "ஆண்"} வரன் ஜாதகம்
              </h2>
            </div>

            {/* CONTENT */}
            <div className="display-form-content">
              {/* NAME + DATE */}
              <div className="display-form-row">
                <span>
                  பெயர்:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "720px" }}
                  >
                    <span className="display-data">{currentData.name}</span>
                  </div>
                </span>

                <span>
                  தேதி:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "280px" }}
                  >
                    <span className="display-data">{currentData.date}</span>
                  </div>
                </span>
              </div>

              {/* BIRTH SECTION */}
              <div className="display-form-row">
                <span>
                  பிறந்த தேதி:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "188px" }}
                  >
                    <span className="display-data">
                      {currentData.birth_date}
                    </span>
                  </div>
                  பிறந்த நேரம்:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "188px" }}
                  >
                    <span className="display-data">
                      {currentData.birth_time}
                    </span>
                  </div>
                  பிறந்த ஊர்:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "200px" }}
                  >
                    <span className="display-data">
                      {currentData.birth_place}
                    </span>
                  </div>
                </span>
              </div>

              {/* EDUCATION / JOB */}
              <div className="display-form-row">
                <span>
                  வரனின்படிப்பு:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "400px" }}
                  >
                    <span className="display-data">
                      {currentData.education}
                    </span>
                  </div>
                  வேலை:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "420px" }}
                  >
                    <span className="display-data">
                      {currentData.occupation}
                    </span>
                  </div>
                </span>
              </div>

              {/* COMPANY DETAILS */}
              <div className="display-form-row">
                <span>
                  நிறுவனம் பெயர் & ஊர்:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "810px" }}
                  >
                    <span className="display-data">
                      {currentData.company_details}
                    </span>
                  </div>
                </span>
              </div>

              {/* INCOME / HEIGHT / WEIGHT */}
              <div className="display-form-row">
                <span>
                  மாதவருமானம்:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "250px" }}
                  >
                    <span className="display-data">
                      {currentData.monthly_income}
                    </span>
                  </div>
                  உயரம்:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "80px" }}
                  >
                    <span className="display-data">{currentData.height}</span>
                  </div>
                  எடை:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "85px" }}
                  >
                    <span className="display-data">{currentData.weight}</span>
                  </div>
                  நிறம்:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "125px" }}
                  >
                    <span className="display-data">
                      {currentData.complexion}
                    </span>
                  </div>
                </span>
              </div>

              {/* FAMILY DEITY */}
              <div className="display-form-row">
                <span>
                  குலதெய்வம்,ஊர்:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "912px" }}
                  >
                    <span className="display-data">
                      {currentData.family_deity}
                    </span>
                  </div>
                </span>
              </div>

              {/* KULAM + KOOTAM */}
              <div className="display-form-row">
                <span>
                  குலம்:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "480px" }}
                  >
                    <span className="display-data">{currentData.kulam}</span>
                  </div>
                  , கூட்டம்:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "480px" }}
                  >
                    <span className="display-data">{currentData.kootam}</span>
                  </div>
                </span>
              </div>

              {/* FATHER */}
              <div className="display-form-row">
                <span>
                  தந்தைப்பெயர்:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "425px" }}
                  >
                    <span className="display-data">
                      {currentData.father_name}
                    </span>
                  </div>
                  அலைபேசி:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "340px" }}
                  >
                    <span className="display-data">
                      {currentData.father_phone}
                    </span>
                  </div>
                </span>
              </div>

              {/* FATHER OCCUPATION */}
              <div className="display-form-row">
                <span>
                  தந்தையின்பணி:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "425px" }}
                  >
                    <span className="display-data">
                      {currentData.father_occupation}
                    </span>
                  </div>
                  பூர்வீகம்:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "345px" }}
                  >
                    <span className="display-data">
                      {currentData.father_native_place}
                    </span>
                  </div>
                </span>
              </div>

              {/* MOTHER */}
              <div className="display-form-row">
                <span>
                  தாய்பெயர்:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "458px" }}
                  >
                    <span className="display-data">
                      {currentData.mother_name}
                    </span>
                  </div>
                  அலைபேசி:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "358px" }}
                  >
                    <span className="display-data">
                      {currentData.mother_phone}
                    </span>
                  </div>
                </span>
              </div>

              {/* MOTHER OCCUPATION */}
              <div className="display-form-row">
                <span>
                  தாயின்பணி:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "435px" }}
                  >
                    <span className="display-data">
                      {currentData.mother_occupation}
                    </span>
                  </div>
                  பூர்வீகம்:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "410px" }}
                  >
                    <span className="display-data">
                      {currentData.mother_native_place}
                    </span>
                  </div>
                </span>
              </div>

              {/* ADDRESS */}
              <div className="display-form-row">
                <span>
                  முகவரி:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "1075px" }}
                  >
                    <span className="display-data">{currentData.address}</span>
                  </div>
                </span>
              </div>

              {/* FAMILY INCOME */}
              <div className="display-form-row">
                <span>
                  குடும்பவருமானம்/வசதிகள்:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "745px" }}
                  >
                    <span className="display-data">
                      {currentData.family_income}
                    </span>
                  </div>
                </span>
              </div>

              {/* SIBLINGS */}
              <div className="display-form-row">
                <span>
                  உடன்பிறந்தோர் விபரம்:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "820px" }}
                  >
                    <span className="display-data">
                      {currentData.siblings_details}
                    </span>
                  </div>
                </span>
              </div>

              {/* STAR / RASI / LAKNAM */}
              <div className="display-form-row">
                <span>
                  நட்சத்திரம்:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "255px" }}
                  >
                    <span className="display-data">{currentData.star}</span>
                  </div>
                  இராசி:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "260px" }}
                  >
                    <span className="display-data">{currentData.rasi}</span>
                  </div>
                  லக்னம்:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "260px" }}
                  >
                    <span className="display-data">{currentData.lagnam}</span>
                  </div>
                </span>
              </div>

              {/* SUDDHAM / RAHU / KETU / SEVVAI */}
              <div className="display-form-row">
                <span>
                  சுத்தம்:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "70px" }}
                  >
                    <span className="display-data">{currentData.suddham}</span>
                  </div>
                  ராகு:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "65px" }}
                  >
                    <span className="display-data">{currentData.rahu}</span>
                  </div>
                  கேது:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "65px" }}
                  >
                    <span className="display-data">{currentData.ketu}</span>
                  </div>
                  செவ்வாய்:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "65px" }}
                  >
                    <span className="display-data">{currentData.sevvai}</span>
                  </div>
                </span>
              </div>

              {/* HOROSCOPE GRIDS */}
              <div className="display-grid">
                {/* NAVAMSAM */}
                <div
                  className="display-container"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gridTemplateRows: "repeat(4, 1fr)",
                    width: "400px",
                    height: "400px",
                    border: "2px solid #000",
                    margin: "20px",
                  }}
                >
                  {currentData.rasi_grid.map((val, i) => {
                    const gridMap = [
                      { row: 1, col: 1 },
                      { row: 1, col: 2 },
                      { row: 1, col: 3 },
                      { row: 1, col: 4 },
                      { row: 2, col: 4 },
                      { row: 3, col: 4 },
                      { row: 4, col: 4 },
                      { row: 4, col: 3 },
                      { row: 4, col: 2 },
                      { row: 4, col: 1 },
                      { row: 3, col: 1 },
                      { row: 2, col: 1 },
                    ];
                    const pos = gridMap[i];

                    return (
                      <div
                        key={i}
                        style={{
                          gridRow: pos.row,
                          gridColumn: pos.col,
                          border: "1px solid #000",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "5px",
                          textAlign: "center",
                        }}
                      >
                        {safeParseChart(val).map((planet, idx) => (
                          <div key={idx}>{planet}</div>
                        ))}
                      </div>
                    );
                  })}

                  <div
                    style={{
                      gridRow: "2 / 4",
                      gridColumn: "2 / 4",
                      border: "1px solid #000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                    }}
                  >
                    இராசி
                  </div>
                </div>

                {/* RASI GRID */}
                <div
                  className="display-container"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gridTemplateRows: "repeat(4, 1fr)",
                    width: "400px",
                    height: "400px",
                    border: "2px solid #000",
                    margin: "20px",
                  }}
                >
                  {currentData.navamsam.map((val, i) => {
                    const gridMap = [
                      { row: 1, col: 1 },
                      { row: 1, col: 2 },
                      { row: 1, col: 3 },
                      { row: 1, col: 4 },
                      { row: 2, col: 4 },
                      { row: 3, col: 4 },
                      { row: 4, col: 4 },
                      { row: 4, col: 3 },
                      { row: 4, col: 2 },
                      { row: 4, col: 1 },
                      { row: 3, col: 1 },
                      { row: 2, col: 1 },
                    ];
                    const pos = gridMap[i];

                    return (
                      <div
                        key={i}
                        style={{
                          gridRow: pos.row,
                          gridColumn: pos.col,
                          border: "1px solid #000",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "5px",
                          textAlign: "center",
                        }}
                      >
                       

                        {safeParseChart(val).map((planet, idx) => (
                          <div key={idx}>{planet}</div>
                        ))}
                      </div>
                    );
                  })}

                  <div
                    style={{
                      gridRow: "2 / 4",
                      gridColumn: "2 / 4",
                      border: "1px solid #000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                    }}
                  >
                    நவாம்சம்
                  </div>
                </div>
              </div>

              {/* DASA BALANCE */}
              <div className="display-form-row">
                <span>
                  திசைஇருப்பு:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "1025px" }}
                  >
                    <span className="display-data">
                      {currentData.dasa_balance}
                    </span>
                  </div>
                </span>
              </div>

              {/* OTHER NOTES */}
              <div className="display-form-row">
                <span>
                  இதர குறிப்புகள்:
                  <div
                    className="display-placeholder"
                    style={{ minWidth: "770px" }}
                  >
                    <span className="display-data">
                      {currentData.other_notes}
                    </span>
                  </div>
                </span>
              </div>

              {/* CONFIRMATION LINE */}
              <div className="display-form-row">
                <span>
                  மேலேகண்ட விவரங்கள் அனைத்தும் உண்மை என உறுதிகூறுகிறோம்
                </span>
              </div>

              {/* FOOTER */}
              <div className="display-footer-row">
                <span className="display-purple-text">
                  Mail ID: <p>{currentData.mail_id}</p>
                </span>
                <span className="display-red-text">
                  Blood Group: <p>{currentData.blood_group}</p>
                </span>
                <span className="display-maroon-text">
                  <b>பெற்றோர் / காப்பாளர்</b>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HIDDEN CLONE FOR html2canvas */}
      <div
        ref={cloneContainer}
        style={{
          position: "absolute",
          top: "-99999px",
          left: "-99999px",
          width: "1275px",
          visibility: "hidden",
        }}
      ></div>
    </div>
  );
}
