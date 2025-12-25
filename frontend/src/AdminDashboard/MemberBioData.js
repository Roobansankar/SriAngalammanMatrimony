import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
    ChevronLeft,
    ChevronRight,
    Download,
    Edit3,
    FileImage,
    FileText,
    Save,
    Search,
    UserCircle,
    X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import headerpic from "../profile/Assets/header.png";
import "./AdminBioDisplay.css";

const API = process.env.REACT_APP_API_BASE || "";

function safeParseChart(value) {
  if (!value || value === "" || value === "[]" || value === null) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {}
  return value
    .split(",")
    .map((x) => x.trim())
    .filter((x) => x !== "");
}

// Helper to get header color based on MatriID prefix and gender
function getHeaderColor(matriId, gender) {
  if (!matriId) return gender === "Male" ? "#b3f0ab" : "#eabdd2";
  
  const prefix = matriId.substring(0, 4).toUpperCase();
  
  if (prefix === "SAMD") {
    // Doctor - Red shade
    return "#C1272D"; // Slightly lighter, clean red (BEST)
    // Light red/coral
  } else if (prefix === "SAMR") {
    // Remarriage - Blue shade
    return "#a4c4f4"; // Light blue
  } else if (prefix === "SAMM" || gender === "Male") {
    // Male - Green
    return "#b3f0ab";
  } else if (prefix === "SAMF" || gender === "Female") {
    // Female - Pink
    return "#eabdd2";
  }
  
  return "#eabdd2"; // Default pink
}

function getHeaderLabel(matriId, gender) {
  if (!matriId) return gender === "Male" ? "ஆண் வரன் ஜாதகம்" : "பெண் வரன் ஜாதகம்";
  
  const prefix = matriId.substring(0, 4).toUpperCase();
  
  if (prefix === "SAMD") {
    return gender === "Male" ? "ஆண் வரன் ஜாதகம் (மருத்துவர்)" : "பெண் வரன் ஜாதகம் (மருத்துவர்)";
  } else if (prefix === "SAMR") {
    return gender === "Male" ? "ஆண் வரன் ஜாதகம் (மறுமணம்)" : "பெண் வரன் ஜாதகம் (மறுமணம்)";
  }
  
  return gender === "Male" ? "ஆண் வரன் ஜாதகம்" : "பெண் வரன் ஜாதகம்";
}

export default function MemberBioData() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [biodataLoading, setBiodataLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [saving, setSaving] = useState(false);

  const printRef = useRef();
  const hiddenPrintRef = useRef();
  const perPage = 10;
  const totalPages = Math.ceil(total / perPage);

  const fetchMembers = () => {
    setLoading(true);
    axios
      .get(`${API}/api/admin/all-members?page=${page}&search=${search}`)
      .then((res) => {
        if (res.data.success) {
          setMembers(res.data.results);
          setTotal(res.data.total);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchMembers();
  };

  const viewBiodata = async (matriId) => {
    setBiodataLoading(true);
    setIsEditing(false);
    try {
      const res = await axios.get(`${API}/api/admin/profile/${matriId}`);
      if (res.data.success) {
        const user = res.data.user;
        const mapped = {
          id: user.ID,
          matriId: user.MatriID,
          gender: user.Gender,
          type: user.Gender === "Male" ? "groom" : "bride",
          name: user.Name || "",
          photo: user.PhotoURL || "",
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
          // siblings_details: `${user.noofbrothers || 0} Brothers, ${
          //   user.noofsisters || 0
          // } Sisters`,

          siblings_details: [
            user.noofbrothers > 0
              ? `${user.noofbrothers} Brothers (${user.nbm || 0} Married)`
              : null,
            user.noofsisters > 0
              ? `${user.noofsisters} Sisters (${user.nsm || 0} Married)`
              : null,
          ]
            .filter(Boolean)
            .join(", "),

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
        setSelectedMember(mapped);
        setEditData(mapped);
      }
    } catch (err) {
      console.error("Error fetching biodata:", err);
    } finally {
      setBiodataLoading(false);
    }
  };

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (!editData || !editData.matriId) return;
    setSaving(true);
    try {
      // Map frontend fields to backend database fields
      const payload = {
        Name: editData.name,
        DOB: editData.birth_date,
        TOB: editData.birth_time,
        POB: editData.birth_place,
        Education: editData.education,
        Occupation: editData.occupation,
        company_name: editData.company_details,
        Annualincome: editData.monthly_income,
        Height: editData.height,
        Weight: editData.weight,
        Complexion: editData.complexion,
        Caste: editData.kulam,
        Subcaste: editData.kootam,
        Fathername: editData.father_name,
        Fathersoccupation: editData.father_occupation,
        Mothersname: editData.mother_name,
        Mothersoccupation: editData.mother_occupation,
        Address: editData.address,
        Mobile: editData.father_phone,
        ConfirmEmail: editData.mail_id,
        Star: editData.star,
        Moonsign: editData.rasi,
        Lagnam: editData.lagnam,
        Raghu: editData.rahu,
        Keethu: editData.ketu,
        Sevai: editData.sevvai,
        BloodGroup: editData.blood_group,
        PartnerExpectations: editData.other_notes,
        // Horoscope grids
        g1: editData.rasi_grid?.[0],
        g2: editData.rasi_grid?.[1],
        g3: editData.rasi_grid?.[2],
        g4: editData.rasi_grid?.[3],
        g5: editData.rasi_grid?.[4],
        g6: editData.rasi_grid?.[5],
        g7: editData.rasi_grid?.[6],
        g8: editData.rasi_grid?.[7],
        g9: editData.rasi_grid?.[8],
        g10: editData.rasi_grid?.[9],
        g11: editData.rasi_grid?.[10],
        g12: editData.rasi_grid?.[11],
        a1: editData.navamsam?.[0],
        a2: editData.navamsam?.[1],
        a3: editData.navamsam?.[2],
        a4: editData.navamsam?.[3],
        a5: editData.navamsam?.[4],
        a6: editData.navamsam?.[5],
        a7: editData.navamsam?.[6],
        a8: editData.navamsam?.[7],
        a9: editData.navamsam?.[8],
        a10: editData.navamsam?.[9],
        a11: editData.navamsam?.[10],
        a12: editData.navamsam?.[11],
      };

      // Remove undefined values
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined) delete payload[key];
      });

      const res = await axios.put(`${API}/api/admin/biodata/${editData.matriId}`, payload);
      
      if (res.data.success) {
        setSelectedMember(editData);
        setIsEditing(false);
        alert("Biodata updated successfully!");
        // Refresh the member list
        fetchMembers();
      } else {
        alert(res.data.message || "Error saving changes");
      }
    } catch (err) {
      console.error("Error saving:", err);
      alert("Error saving changes: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const downloadAsPDF = async () => {
    if (!hiddenPrintRef.current) return;
    setDownloading(true);

    try {
      const element = hiddenPrintRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // A4 dimensions
      const pdfWidth = 210;
      const pdfHeight = (imgHeight * pdfWidth) / imgWidth;
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [pdfWidth, pdfHeight],
      });

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`biodata_${currentData.matriId || currentData.name}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
    } finally {
      setDownloading(false);
    }
  };

  const downloadAsImage = async () => {
    if (!hiddenPrintRef.current) return;
    setDownloading(true);

    try {
      const element = hiddenPrintRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.download = `biodata_${currentData.matriId || currentData.name}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Error generating image:", err);
    } finally {
      setDownloading(false);
    }
  };

  const getPageNumbers = () => {
    const maxButtons = 5;
    let start = Math.max(1, page - 2);
    let end = start + maxButtons - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxButtons + 1);
    }
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  // Render grid for horoscope - Fixed responsive version
  // eslint-disable-next-line no-unused-vars
  const renderGrid = (gridData, title) => {
    const cells = gridData || Array(12).fill("-");
    
    // Helper to truncate long text
    const formatCell = (index) => {
      const content = safeParseChart(cells[index]);
      if (content.length === 0) return "-";
      // Show first item only if multiple, with ellipsis
      if (content.length > 1) {
        return content[0].substring(0, 4) + "...";
      }
      return content[0].substring(0, 6) || "-";
    };

    return (
      <div className="flex flex-col items-center">
        <p className="text-xs text-center mb-1 font-medium">{title}</p>
        <div className="grid grid-cols-4 border border-gray-400" style={{ width: "160px" }}>
          {/* Row 1 */}
          {[0, 1, 2, 3].map((i) => (
            <div key={`r1-${i}`} className="border border-gray-300 p-0.5 text-[10px] text-center h-8 flex items-center justify-center overflow-hidden">
              <span className="truncate">{formatCell(i)}</span>
            </div>
          ))}
          {/* Row 2 */}
          <div className="border border-gray-300 p-0.5 text-[10px] text-center h-8 flex items-center justify-center overflow-hidden">
            <span className="truncate">{formatCell(11)}</span>
          </div>
          <div className="col-span-2 row-span-2 border border-gray-300 flex items-center justify-center text-xs font-bold bg-gray-50">
            {title === "ராசி" ? "ராசி" : "நவாம்"}
          </div>
          <div className="border border-gray-300 p-0.5 text-[10px] text-center h-8 flex items-center justify-center overflow-hidden">
            <span className="truncate">{formatCell(4)}</span>
          </div>
          {/* Row 3 */}
          <div className="border border-gray-300 p-0.5 text-[10px] text-center h-8 flex items-center justify-center overflow-hidden">
            <span className="truncate">{formatCell(10)}</span>
          </div>
          <div className="border border-gray-300 p-0.5 text-[10px] text-center h-8 flex items-center justify-center overflow-hidden">
            <span className="truncate">{formatCell(5)}</span>
          </div>
          {/* Row 4 */}
          {[9, 8, 7, 6].map((i) => (
            <div key={`r4-${i}`} className="border border-gray-300 p-0.5 text-[10px] text-center h-8 flex items-center justify-center overflow-hidden">
              <span className="truncate">{formatCell(i)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const currentData = isEditing ? editData : selectedMember;
  const headerColor = currentData ? getHeaderColor(currentData.matriId, currentData.gender) : "#eabdd2";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Member BioData</h1>
          <p className="text-gray-500 text-sm mt-1">
            View, edit and download member biodata as PDF or Image
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by name, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent w-64"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
          >
            Search
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Member List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <h2 className="font-semibold text-gray-800">Select Member</h2>
              <p className="text-xs text-gray-500">{total} members found</p>
            </div>

            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : (
              <>
                <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                  {members.map((m) => (
                    <div
                      key={m.MatriID}
                      onClick={() => viewBiodata(m.MatriID)}
                      className={`flex items-center gap-3 p-3 cursor-pointer transition hover:bg-gray-50 ${
                        selectedMember?.matriId === m.MatriID
                          ? "bg-rose-50 border-l-4 border-rose-500"
                          : ""
                      }`}
                    >
                      {m.PhotoURL && !m.PhotoURL.includes("nophoto") ? (
                        <img
                          src={m.PhotoURL}
                          alt={m.Name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            m.Gender === "Male" ? "bg-blue-100" : "bg-pink-100"
                          }`}
                        >
                          <UserCircle
                            size={20}
                            className={
                              m.Gender === "Male"
                                ? "text-blue-500"
                                : "text-pink-500"
                            }
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">
                          {m.Name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {m.MatriID} • {m.Gender}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="px-3 py-2 border-t border-gray-100 flex items-center justify-center gap-1">
                  <button
                    className="p-1.5 rounded border border-gray-200 disabled:opacity-50"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    <ChevronLeft size={14} />
                  </button>
                  {getPageNumbers().map((num) => (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={`w-7 h-7 rounded text-xs font-medium ${
                        page === num
                          ? "bg-rose-500 text-white"
                          : "border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    className="p-1.5 rounded border border-gray-200 disabled:opacity-50"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Biodata Preview */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-800">BioData Preview</h2>
                <p className="text-xs text-gray-500">
                  {currentData
                    ? `${currentData.name} (${currentData.matriId})`
                    : "Select a member to view"}
                </p>
              </div>

              {currentData && (
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSaveChanges}
                        disabled={saving}
                        className="flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm disabled:opacity-50"
                      >
                        <Save size={16} />
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditData(selectedMember);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm"
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition text-sm"
                      >
                        <Edit3 size={16} />
                        Edit
                      </button>
                      <button
                        onClick={downloadAsPDF}
                        disabled={downloading}
                        className="flex items-center gap-2 px-3 py-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition text-sm disabled:opacity-50"
                      >
                        <FileText size={16} />
                        PDF
                      </button>
                      <button
                        onClick={downloadAsImage}
                        disabled={downloading}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm disabled:opacity-50"
                      >
                        <FileImage size={16} />
                        Image
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {biodataLoading ? (
              <div className="text-center py-16 text-gray-500">
                <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                Loading biodata...
              </div>
            ) : currentData ? (
              <div className="p-4 overflow-auto" style={{ maxHeight: "80vh" }}>
                {/* Biodata Preview - Scaled down for viewing */}
                <div
                  style={{
                    transform: "scale(0.55)",
                    transformOrigin: "top left",
                    width: "1275px",
                    marginBottom: "-800px", // Compensate for scale
                  }}
                >
                  <div
                    ref={printRef}
                    className="display-biodata-container"
                    style={{
                      margin: "0",
                      background: "#ffffff",
                    }}
                  >
                    {/* HEADER */}
                    {/* <div
                      className="display-header"
                      style={{ backgroundColor: headerColor, width: "100%" }}
                    >
                      <img
                        src={headerpic}
                        alt="header"
                        style={{ width: "1275px", height: "340px" }}
                      />
                    </div> */}

                     <div className="relative" style={{ backgroundColor: headerColor }}>
                      <img src={headerpic} alt="header" className="w-full" />
                    
                      <div className="absolute top-2 right-4 bg-black/60 text-white px-3 py-1 rounded-md text-l font-semibold">
                        MATRIID: {currentData.matriId}
                      </div>
                    </div>

                    <div className="display-div">
                      <h2>
                        {getHeaderLabel(
                          currentData.matriId,
                          currentData.gender
                        )}
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
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.name || ""}
                                onChange={(e) =>
                                  handleEditChange("name", e.target.value)
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.name}
                              </span>
                            )}
                          </div>
                        </span>
                        <span>
                          தேதி:
                          <div
                            className="display-placeholder"
                            style={{ minWidth: "280px" }}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.date || ""}
                                onChange={(e) =>
                                  handleEditChange("date", e.target.value)
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.date}
                              </span>
                            )}
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
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.birth_date || ""}
                                onChange={(e) =>
                                  handleEditChange("birth_date", e.target.value)
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.birth_date}
                              </span>
                            )}
                          </div>
                          பிறந்த நேரம்:
                          <div
                            className="display-placeholder"
                            style={{ minWidth: "188px" }}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.birth_time || ""}
                                onChange={(e) =>
                                  handleEditChange("birth_time", e.target.value)
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.birth_time}
                              </span>
                            )}
                          </div>
                          பிறந்த ஊர்:
                          <div
                            className="display-placeholder"
                            style={{ minWidth: "200px" }}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.birth_place || ""}
                                onChange={(e) =>
                                  handleEditChange(
                                    "birth_place",
                                    e.target.value
                                  )
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.birth_place}
                              </span>
                            )}
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
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.education || ""}
                                onChange={(e) =>
                                  handleEditChange("education", e.target.value)
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.education}
                              </span>
                            )}
                          </div>
                          வேலை:
                          <div
                            className="display-placeholder"
                            style={{ minWidth: "420px" }}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.occupation || ""}
                                onChange={(e) =>
                                  handleEditChange("occupation", e.target.value)
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.occupation}
                              </span>
                            )}
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
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.company_details || ""}
                                onChange={(e) =>
                                  handleEditChange(
                                    "company_details",
                                    e.target.value
                                  )
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.company_details}
                              </span>
                            )}
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
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.monthly_income || ""}
                                onChange={(e) =>
                                  handleEditChange(
                                    "monthly_income",
                                    e.target.value
                                  )
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.monthly_income}
                              </span>
                            )}
                          </div>
                          உயரம்:
                          <div
                            className="display-placeholder"
                            style={{ minWidth: "80px" }}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.height || ""}
                                onChange={(e) =>
                                  handleEditChange("height", e.target.value)
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.height}
                              </span>
                            )}
                          </div>
                          எடை:
                          <div
                            className="display-placeholder"
                            style={{ minWidth: "85px" }}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.weight || ""}
                                onChange={(e) =>
                                  handleEditChange("weight", e.target.value)
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.weight}
                              </span>
                            )}
                          </div>
                          நிறம்:
                          <div
                            className="display-placeholder"
                            style={{ minWidth: "125px" }}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.complexion || ""}
                                onChange={(e) =>
                                  handleEditChange("complexion", e.target.value)
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.complexion}
                              </span>
                            )}
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
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.family_deity || ""}
                                onChange={(e) =>
                                  handleEditChange(
                                    "family_deity",
                                    e.target.value
                                  )
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.family_deity}
                              </span>
                            )}
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
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.kulam || ""}
                                onChange={(e) =>
                                  handleEditChange("kulam", e.target.value)
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.kulam}
                              </span>
                            )}
                          </div>
                          , கூட்டம்:
                          <div
                            className="display-placeholder"
                            style={{ minWidth: "480px" }}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.kootam || ""}
                                onChange={(e) =>
                                  handleEditChange("kootam", e.target.value)
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.kootam}
                              </span>
                            )}
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
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.father_name || ""}
                                onChange={(e) =>
                                  handleEditChange(
                                    "father_name",
                                    e.target.value
                                  )
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.father_name}
                              </span>
                            )}
                          </div>
                          அலைபேசி:
                          <div
                            className="display-placeholder"
                            style={{ minWidth: "340px" }}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.father_phone || ""}
                                onChange={(e) =>
                                  handleEditChange(
                                    "father_phone",
                                    e.target.value
                                  )
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.father_phone}
                              </span>
                            )}
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
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.father_occupation || ""}
                                onChange={(e) =>
                                  handleEditChange(
                                    "father_occupation",
                                    e.target.value
                                  )
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.father_occupation}
                              </span>
                            )}
                          </div>
                          பூர்வீகம்:
                          <div
                            className="display-placeholder"
                            style={{ minWidth: "345px" }}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.father_native_place || ""}
                                onChange={(e) =>
                                  handleEditChange(
                                    "father_native_place",
                                    e.target.value
                                  )
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.father_native_place}
                              </span>
                            )}
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
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.mother_name || ""}
                                onChange={(e) =>
                                  handleEditChange(
                                    "mother_name",
                                    e.target.value
                                  )
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.mother_name}
                              </span>
                            )}
                          </div>
                          அலைபேசி:
                          <div
                            className="display-placeholder"
                            style={{ minWidth: "358px" }}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.mother_phone || ""}
                                onChange={(e) =>
                                  handleEditChange(
                                    "mother_phone",
                                    e.target.value
                                  )
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.mother_phone}
                              </span>
                            )}
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
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.mother_occupation || ""}
                                onChange={(e) =>
                                  handleEditChange(
                                    "mother_occupation",
                                    e.target.value
                                  )
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.mother_occupation}
                              </span>
                            )}
                          </div>
                          பூர்வீகம்:
                          <div
                            className="display-placeholder"
                            style={{ minWidth: "410px" }}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.mother_native_place || ""}
                                onChange={(e) =>
                                  handleEditChange(
                                    "mother_native_place",
                                    e.target.value
                                  )
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.mother_native_place}
                              </span>
                            )}
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
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.address || ""}
                                onChange={(e) =>
                                  handleEditChange("address", e.target.value)
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.address}
                              </span>
                            )}
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
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.family_income || ""}
                                onChange={(e) =>
                                  handleEditChange(
                                    "family_income",
                                    e.target.value
                                  )
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.family_income}
                              </span>
                            )}
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
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.siblings_details || ""}
                                onChange={(e) =>
                                  handleEditChange(
                                    "siblings_details",
                                    e.target.value
                                  )
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.siblings_details}
                              </span>
                            )}
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
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.star || ""}
                                onChange={(e) =>
                                  handleEditChange("star", e.target.value)
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.star}
                              </span>
                            )}
                          </div>
                          இராசி:
                          <div
                            className="display-placeholder"
                            style={{ minWidth: "260px" }}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.rasi || ""}
                                onChange={(e) =>
                                  handleEditChange("rasi", e.target.value)
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.rasi}
                              </span>
                            )}
                          </div>
                          லக்னம்:
                          <div
                            className="display-placeholder"
                            style={{ minWidth: "260px" }}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.lagnam || ""}
                                onChange={(e) =>
                                  handleEditChange("lagnam", e.target.value)
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.lagnam}
                              </span>
                            )}
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
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.suddham || ""}
                                onChange={(e) =>
                                  handleEditChange("suddham", e.target.value)
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.suddham}
                              </span>
                            )}
                          </div>
                          ராகு:
                          <div
                            className="display-placeholder"
                            style={{ minWidth: "65px" }}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.rahu || ""}
                                onChange={(e) =>
                                  handleEditChange("rahu", e.target.value)
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.rahu}
                              </span>
                            )}
                          </div>
                          கேது:
                          <div
                            className="display-placeholder"
                            style={{ minWidth: "65px" }}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.ketu || ""}
                                onChange={(e) =>
                                  handleEditChange("ketu", e.target.value)
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.ketu}
                              </span>
                            )}
                          </div>
                          செவ்வாய்:
                          <div
                            className="display-placeholder"
                            style={{ minWidth: "65px" }}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.sevvai || ""}
                                onChange={(e) =>
                                  handleEditChange("sevvai", e.target.value)
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.sevvai}
                              </span>
                            )}
                          </div>
                        </span>
                      </div>

                      {/* HOROSCOPE GRIDS */}
                      <div className="display-grid">
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
                          {(currentData.rasi_grid || Array(12).fill("-")).map(
                            (val, i) => {
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
                            }
                          )}

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

                        {/* NAVAMSAM GRID */}
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
                          {(currentData.navamsam || Array(12).fill("-")).map(
                            (val, i) => {
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
                            }
                          )}

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
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.dasa_balance || ""}
                                onChange={(e) =>
                                  handleEditChange(
                                    "dasa_balance",
                                    e.target.value
                                  )
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.dasa_balance}
                              </span>
                            )}
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
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.other_notes || ""}
                                onChange={(e) =>
                                  handleEditChange(
                                    "other_notes",
                                    e.target.value
                                  )
                                }
                                className="display-data"
                                style={{
                                  border: "2px solid #3b82f6",
                                  background: "#eff6ff",
                                  padding: "2px 8px",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <span className="display-data">
                                {currentData.other_notes}
                              </span>
                            )}
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
            ) : (
              <div className="text-center py-16 text-gray-400">
                <Download size={48} className="mx-auto mb-3 opacity-50" />
                <p>Select a member from the list to view their biodata</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Color Legend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 className="font-semibold text-gray-800 mb-3">
          Header Color Legend
        </h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded"
              style={{ backgroundColor: "#b3f0ab" }}
            ></div>
            <span className="text-sm text-gray-600">Male (Green)</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded"
              style={{ backgroundColor: "#eabdd2" }}
            ></div>
            <span className="text-sm text-gray-600">Female (Pink)</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded"
              style={{ backgroundColor: "#C1272D" }}
            ></div>
            <span className="text-sm text-gray-600">Doctor (Red)</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded"
              style={{ backgroundColor: "#a4c4f4" }}
            ></div>
            <span className="text-sm text-gray-600">Remarriage (Blue)</span>
          </div>
        </div>
      </div>

      {/* Hidden full-size biodata for PDF/Image generation */}
      {currentData && (
        <div
          style={{
            position: "absolute",
            left: "-9999px",
            top: "0",
            width: "1275px",
            zIndex: -1,
          }}
        >
          <div
            ref={hiddenPrintRef}
            className="display-biodata-container"
            style={{
              margin: "0",
              background: "#ffffff",
              width: "1275px",
            }}
          >
            {/* HEADER */}
            {/* <div
              className="display-header"
              style={{ backgroundColor: headerColor, width: "100%" }}
            >
              <img
                src={headerpic}
                alt="header"
                style={{ width: "1275px", height: "340px" }}
              />
            </div> */}

                                
                    
<div className="relative" style={{ backgroundColor: headerColor }}>
  <img src={headerpic} alt="header" className="w-full" />

  <div className="absolute top-2 right-4 bg-black/60 text-white px-3 py-1 rounded-md text-l font-semibold">
    ID: {currentData.matriId}
  </div>
</div>


            <div className="display-div">
              <h2>{getHeaderLabel(currentData.matriId, currentData.gender)}</h2>
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
                  {(currentData.rasi_grid || Array(12).fill("-")).map(
                    (val, i) => {
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
                    }
                  )}
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

                {/* NAVAMSAM GRID */}
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
                  {(currentData.navamsam || Array(12).fill("-")).map(
                    (val, i) => {
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
                    }
                  )}
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
      )}
    </div>
  );
}
