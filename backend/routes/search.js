// // routes/search.js

import express from "express";
import db from "../config/db.js";

const router = express.Router();

const BASE_URL = process.env.API_BASE_URL || "http://localhost:5000";
const GALLERY_PATH = "/gallery/";
const FALLBACK = "nophoto.jpg";

// SAME FUNCTION USED IN auth.js
// function makePhotoUrl(photoFilename, photoApprove) {
//   const hasPhoto =
//     photoFilename &&
//     photoFilename !== "no-photo.gif" &&
//     String(photoApprove).toLowerCase() === "yes";

//   const file = hasPhoto ? photoFilename : FALLBACK;
//   return `${BASE_URL}${GALLERY_PATH}${encodeURIComponent(file)}`;
// }

function makePhotoUrl(photoFilename, photoApprove) {
  const valid =
    photoFilename &&
    photoFilename !== "no-photo.gif" &&
    String(photoApprove).toLowerCase() === "yes";

  // ✔ If a valid photo exists → return it
  if (valid) {
    return `${BASE_URL}${GALLERY_PATH}${encodeURIComponent(photoFilename)}`;
  }

  // ✔ If NOT valid → return NULL instead of fallback image
  return null;
}


// Helper for IN filters
function addInCondition(where, col, vals) {
  const filtered = (vals || []).filter((v) => v !== "" && v !== "Any");
  if (filtered.length > 0) {
    const escVals = filtered.map((v) => db.escape(v));
    where.push(`${col} IN (${escVals.join(",")})`);
  }
}

// =========================
// Dynamic Search Results
// =========================



// router.post("/search", (req, res) => {
//   try {
//     let {
//       gender,
//       txtSAge,
//       txtEAge,
//       with_photo,
//       page = 1,
//       looking = [],
//       religion = [],
//       caste = [],
//       edu = [],
//       occu = [],
//     } = req.body;

//     const setLimit = 10;
//     page = parseInt(page) || 1;
//     if (page < 1) page = 1;

//     const where = ["1=1"];

//     if (gender) where.push(`Gender = ${db.escape(gender)}`);

//     // ⭐ Correct age filter based on DOB
//     const fromAge = parseInt(txtSAge);
//     const toAge = parseInt(txtEAge);

//     if (!isNaN(fromAge) && !isNaN(toAge) && toAge >= fromAge) {
//       where.push(`
//         TIMESTAMPDIFF(YEAR, DATE(DOB), CURDATE()) BETWEEN ${fromAge} AND ${toAge}
//       `);
//     }

//     addInCondition(where, "Religion", religion);
//     addInCondition(where, "Caste", caste);
//     addInCondition(where, "Education", edu);
//     addInCondition(where, "Occupation", occu);
//     addInCondition(where, "Maritalstatus", looking);

//     if (with_photo == 1 || with_photo === true || with_photo === "1") {
//       where.push("Photo1 IS NOT NULL");
//       where.push("LOWER(Photo1Approve) = 'yes'");
//     }

//     where.push(
//       "visibility NOT LIKE 'hidden' AND Status <> 'Banned' AND Status NOT LIKE 'InActive'"
//     );

//     const whereSQL = where.join(" AND ");

//     // ⭐ FIRST COUNT TOTAL ROWS
//     const countSQL = `SELECT COUNT(*) AS cnt FROM register WHERE ${whereSQL}`;

//     db.query(countSQL, (err, countRes) => {
//       if (err) return res.status(500).json({ error: "Database error" });

//       const total = countRes[0]?.cnt || 0;

//       // ⭐ Clamp page automatically
//       const totalPages = total > 0 ? Math.ceil(total / setLimit) : 1;
//       if (page > totalPages) page = totalPages;

//       const offset = (page - 1) * setLimit;

//       // ⭐ Fetch actual rows
//       const fetchSQL = `
//         SELECT 
//           MatriID,
//           Name,
//           DOB,
//           TIMESTAMPDIFF(YEAR, DATE(DOB), CURDATE()) AS Age,
//           Religion,
//           Caste,
//           Subcaste,
//           Profilecreatedby,
//           Education,
//           Occupation,
//           Annualincome,
//           workinglocation,
//           Photo1,
//           Photo1Approve
//         FROM register
//         WHERE ${whereSQL}
//         ORDER BY Regdate DESC
//         LIMIT ?, ?
//       `;

//       db.query(fetchSQL, [offset, setLimit], (err2, rows) => {
//         if (err2) return res.status(500).json({ error: "Database error" });

//         const results = rows.map((u) => {
//           const PhotoURL = makePhotoUrl(u.Photo1, u.Photo1Approve);
//           const { Photo1, Photo1Approve, ...rest } = u;
//           return { ...rest, PhotoURL };
//         });

//         res.json({
//           total,
//           page,
//           per_page: setLimit,
//           results,
//         });
//       });
//     });
//   } catch (err) {
//     console.error("Search error:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

router.post("/search", (req, res) => {
  try {
    let {
      gender,
      txtSAge,
      txtEAge,
      with_photo,
      page = 1,
      looking = [],
      religion = [],
      caste = [],
      edu = [],
      occu = [],
      viewerPlan = "basic", // ✅ received from frontend
    } = req.body;

    const setLimit = 10;
    page = parseInt(page) || 1;
    if (page < 1) page = 1;

    const where = ["1=1"];

    // ================= PLAN FILTER (FINAL LOGIC) =================
    if (viewerPlan === "basic") {
      where.push("Plan = 'basic'");
    } else if (viewerPlan === "premium") {
      where.push("Plan IN ('basic','premium')");
    }
    // ============================================================

    if (gender) where.push(`Gender = ${db.escape(gender)}`);

    const fromAge = parseInt(txtSAge);
    const toAge = parseInt(txtEAge);

    if (!isNaN(fromAge) && !isNaN(toAge) && toAge >= fromAge) {
      where.push(`
        TIMESTAMPDIFF(YEAR, DATE(DOB), CURDATE()) 
        BETWEEN ${fromAge} AND ${toAge}
      `);
    }

    addInCondition(where, "Religion", religion);
    addInCondition(where, "Caste", caste);
    addInCondition(where, "Education", edu);
    addInCondition(where, "Occupation", occu);
    addInCondition(where, "Maritalstatus", looking);

    if (with_photo == 1 || with_photo === true || with_photo === "1") {
      where.push("Photo1 IS NOT NULL");
      where.push("LOWER(Photo1Approve) = 'yes'");
    }

    where.push(
      "visibility NOT LIKE 'hidden' AND Status <> 'Banned' AND Status NOT LIKE 'InActive'"
    );

    const whereSQL = where.join(" AND ");

    // ================= COUNT =================
    const countSQL = `
      SELECT COUNT(*) AS cnt 
      FROM register 
      WHERE ${whereSQL}
    `;

    db.query(countSQL, (err, countRes) => {
      if (err) return res.status(500).json({ error: "Database error" });

      const total = countRes[0]?.cnt || 0;
      const totalPages = total > 0 ? Math.ceil(total / setLimit) : 1;
      if (page > totalPages) page = totalPages;

      const offset = (page - 1) * setLimit;

      // ================= FETCH DATA =================
      const fetchSQL = `
        SELECT 
          MatriID,
          Name,
          DOB,
          TIMESTAMPDIFF(YEAR, DATE(DOB), CURDATE()) AS Age,
          Religion,
          Caste,
          Subcaste,
          Profilecreatedby,
          Education,
          Occupation,
          Annualincome,
          workinglocation,
          Photo1,
          Photo1Approve
        FROM register
        WHERE ${whereSQL}
        ORDER BY Regdate DESC
        LIMIT ?, ?
      `;

      db.query(fetchSQL, [offset, setLimit], (err2, rows) => {
        if (err2) return res.status(500).json({ error: "Database error" });

        const results = rows.map((u) => {
          const PhotoURL = makePhotoUrl(u.Photo1, u.Photo1Approve);
          const { Photo1, Photo1Approve, ...rest } = u;
          return { ...rest, PhotoURL };
        });

        res.json({
          total,
          page,
          per_page: setLimit,
          results,
        });
      });
    });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



/////////////////////////////////////////////////////////////////////////////////////


function makePhotoUrl1(photoFilename, photoApprove) {
  const valid =
    photoFilename &&
    photoFilename !== "no-photo.gif" &&
    String(photoApprove).toLowerCase() === "yes";

  // ✔ If a valid photo exists → return it
  if (valid) {
    return `${BASE_URL}${GALLERY_PATH}${encodeURIComponent(photoFilename)}`;
  }

  // ✔ If NOT valid → return NULL instead of fallback image
  return null;
}


function addInCondition1(where, col, vals) {
  const filtered = (vals || []).filter((v) => v !== "" && v !== "Any");
  if (filtered.length > 0) {
    const escVals = filtered.map((v) => db.escape(v));
    where.push(`${col} IN (${escVals.join(",")})`);
  }
}

router.post("/advancesearch", (req, res) => {
  try {
    let {
      gender,
      txtSAge,
      txtEAge,
      with_photo,
      page = 1,
      looking = [],
      religion = [],
      caste = [],
      edu = [],
      occu = [],
      country = [],
      state = [],
      district = [],
      viewerPlan = "basic",
    } = req.body;

    const setLimit = 10;
    page = parseInt(page) || 1;
    if (page < 1) page = 1;

   const where = ["1=1"];

   // ✅ ADDED: PLAN-BASED VISIBILITY LOGIC
   if (viewerPlan === "basic") {
     where.push("Plan = 'basic'");
   } else if (viewerPlan === "premium") {
     where.push("Plan IN ('basic','premium')");
   }

    if (gender) where.push(`Gender = ${db.escape(gender)}`);

    const fromAge = parseInt(txtSAge);
    const toAge = parseInt(txtEAge);

    if (!isNaN(fromAge) && !isNaN(toAge) && toAge >= fromAge) {
      where.push(`
        TIMESTAMPDIFF(YEAR, DATE(DOB), CURDATE()) BETWEEN ${fromAge} AND ${toAge}
      `);
    }

    addInCondition1(where, "Religion", religion);
    addInCondition1(where, "Caste", caste);
    addInCondition1(where, "Education", edu);
    addInCondition1(where, "Occupation", occu);
    addInCondition1(where, "Maritalstatus", looking);

    addInCondition1(where, "Country", country);
    addInCondition1(where, "State", state);
    addInCondition1(where, "Dist", district);

    if (with_photo == 1 || with_photo === true || with_photo === "1") {
      where.push("Photo1 IS NOT NULL");
      where.push("LOWER(Photo1Approve) = 'yes'");
    }

    where.push(
      "visibility NOT LIKE 'hidden' AND Status <> 'Banned' AND Status NOT LIKE 'InActive'"
    );

    const whereSQL = where.join(" AND ");

    // 1️⃣ COUNT
    const countSQL = `SELECT COUNT(*) AS cnt FROM register WHERE ${whereSQL}`;

    db.query(countSQL, (err, countRes) => {
      if (err) {
        console.error("COUNT SQL ERROR:", err);
        console.error("BAD QUERY:", countSQL);
        return res.status(500).json({ error: err.message });
      }

      const total = countRes[0]?.cnt || 0;
      const totalPages = total > 0 ? Math.ceil(total / setLimit) : 1;
      if (page > totalPages) page = totalPages;

      const offset = (page - 1) * setLimit;

      // 2️⃣ FETCH
      const fetchSQL = `
        SELECT 
          MatriID,
          Name,
          DOB,
          TIMESTAMPDIFF(YEAR, DATE(DOB), CURDATE()) AS Age,
          Religion,
          Caste,
          Subcaste,
          Profilecreatedby,
          Education,
          Occupation,
          Annualincome,
          workinglocation,
          Country,
          State,
          Dist,
          Photo1,
          Photo1Approve
        FROM register
        WHERE ${whereSQL}
        ORDER BY Regdate DESC
        LIMIT ?, ?
      `;

      db.query(fetchSQL, [offset, setLimit], (err2, rows) => {
        if (err2) {
          console.error("FETCH SQL ERROR:", err2);
          console.error("BAD QUERY:", fetchSQL);
          return res.status(500).json({ error: err2.message });
        }

        // 3️⃣ MAP
        const results = rows.map((u) => {
          const PhotoURL = makePhotoUrl1(u.Photo1, u.Photo1Approve);
          const { Photo1, Photo1Approve, ...rest } = u;
          return { ...rest, PhotoURL };
        });

        // 4️⃣ SEND RESPONSE
        res.json({
          total,
          page,
          per_page: setLimit,
          results,
        });
      });
    });
  } catch (err) {
    console.error("SEARCH ROUTE ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});




///////////////////////////////////////////////////////////////////////////////////////////



function makePhotoUrl2(photoFilename, photoApprove) {
  const valid =
    photoFilename &&
    photoFilename !== "no-photo.gif" &&
    String(photoApprove).toLowerCase() === "yes";

  // ✔ If a valid photo exists → return it
  if (valid) {
    return `${BASE_URL}${GALLERY_PATH}${encodeURIComponent(photoFilename)}`;
  }

  // ✔ If NOT valid → return NULL instead of fallback image
  return null;
}

function addInCondition2(where, col, vals) {
  const filtered = (vals || []).filter((v) => v !== "" && v !== "Any");
  if (filtered.length > 0) {
    const escVals = filtered.map((v) => db.escape(v));
    where.push(`${col} IN (${escVals.join(",")})`);
  }
}


router.post("/horoscopesearch", (req, res) => {
  try {
    let {
      gender,
      txtSAge,
      txtEAge,
      with_photo,
      page = 1,
      looking = [],
      religion = [],
      caste = [],
      edu = [],
      occu = [],
      star = [],        // ⭐ ADD THIS
      Sevai = "Any",    // ⭐ ADD THIS
      Raghu = "Any",    // ⭐ ADD THIS
      Keethu = "Any"  ,  // ⭐ ADD THIS
      viewerPlan = "basic",
    } = req.body;

    const setLimit = 10;
    page = parseInt(page) || 1;
    if (page < 1) page = 1;

   const where = ["1=1"];

   // ✅ ADDED: PLAN-BASED VISIBILITY LOGIC
   if (viewerPlan === "basic") {
     where.push("Plan = 'basic'");
   } else if (viewerPlan === "premium") {
     where.push("Plan IN ('basic','premium')");
   }


    if (gender) where.push(`Gender = ${db.escape(gender)}`);

    // AGE FILTER
    const fromAge = parseInt(txtSAge);
    const toAge = parseInt(txtEAge);

    if (!isNaN(fromAge) && !isNaN(toAge) && toAge >= fromAge) {
      where.push(`
        TIMESTAMPDIFF(YEAR, DATE(DOB), CURDATE()) BETWEEN ${fromAge} AND ${toAge}
      `);
    }

    // ========== MULTI SELECT ==========
    addInCondition2(where, "Religion", religion);
    addInCondition2(where, "Caste", caste);
    addInCondition2(where, "Education", edu);
    addInCondition2(where, "Occupation", occu);
    addInCondition2(where, "Maritalstatus", looking);
    // ⭐⭐ MULTI-SELECT STAR
    addInCondition2(where, "Star", star);

    // ========== SINGLE SELECT ==========
    // ⭐⭐ SEVAI
    if (Sevai && Sevai !== "" && Sevai !== "Any") {
      where.push(`Sevai = ${db.escape(Sevai)}`);
    }

    // ⭐⭐ RAGHU
    if (Raghu && Raghu !== "" && Raghu !== "Any") {
      where.push(`Raghu = ${db.escape(Raghu)}`);
    }

    // ⭐⭐ KEETHU
    if (Keethu && Keethu !== "" && Keethu !== "Any") {
      where.push(`Keethu = ${db.escape(Keethu)}`);
    }

    // PHOTO FILTER
    if (with_photo == 1 || with_photo === true || with_photo === "1") {
      where.push("Photo1 IS NOT NULL");
      where.push("LOWER(Photo1Approve) = 'yes'");
    }

    // VISIBILITY & STATUS
    where.push(
      "visibility NOT LIKE 'hidden' AND Status <> 'Banned' AND Status NOT LIKE 'InActive'"
    );

    const whereSQL = where.join(" AND ");

    // COUNT SQL
    const countSQL = `SELECT COUNT(*) AS cnt FROM register WHERE ${whereSQL}`;

    db.query(countSQL, (err, countRes) => {
      if (err) return res.status(500).json({ error: "Database error" });

      const total = countRes[0]?.cnt || 0;

      const totalPages = total > 0 ? Math.ceil(total / setLimit) : 1;
      if (page > totalPages) page = totalPages;

      const offset = (page - 1) * setLimit;

      // MAIN RESULT
      const fetchSQL = `
        SELECT 
          MatriID,
          Name,
          DOB,
          TIMESTAMPDIFF(YEAR, DATE(DOB), CURDATE()) AS Age,
          Religion,
          Caste,
          Subcaste,
          Profilecreatedby,
          Education,
          Occupation,
          Annualincome,
          workinglocation,
          Photo1,
          Photo1Approve,
          Star, Sevai, Raghu, Keethu   -- ⭐ optional but useful
        FROM register
        WHERE ${whereSQL}
        ORDER BY Regdate DESC
        LIMIT ?, ?
      `;

      db.query(fetchSQL, [offset, setLimit], (err2, rows) => {
        if (err2) return res.status(500).json({ error: "Database error" });

        const results = rows.map((u) => {
          const PhotoURL = makePhotoUrl2(u.Photo1, u.Photo1Approve);
          const { Photo1, Photo1Approve, ...rest } = u;
          return { ...rest, PhotoURL };
        });

        res.json({
          total,
          page,
          per_page: setLimit,
          results,
        });
      });
    });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



// =========================
// Dynamic Options
// =========================

// GET /api/religions
router.get("/religions", (req, res) => {
  db.query(
    "SELECT ID, Religion FROM religion ORDER BY Religion",
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// GET /api/castes?religion=Hindu

router.get("/castes", (req, res) => {
  let { religion } = req.query;

  // Ensure religion is always treated as an array
  if (!religion) religion = [];
  if (!Array.isArray(religion)) religion = [religion];

  const filtered = religion.filter((r) => r && r !== "Any");

  let sql = "SELECT ID, Religion, Caste FROM caste";
  const params = [];

  if (filtered.length > 0) {
    const placeholders = filtered.map(() => "?").join(",");
    sql += ` WHERE Religion IN (${placeholders})`;
    params.push(...filtered);
  }

  sql += " ORDER BY Caste";

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ Educations
router.get("/educations", (req, res) => {
  db.query("SELECT id, edu , status FROM education", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET /api/occupations
router.get("/occupations", (req, res) => {
  db.query("SELECT id, occu FROM occupation ORDER BY occu", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET /api/maritalstatus
router.get("/maritalstatus", (req, res) => {
  db.query(
    "SELECT id, status FROM maritial_status ORDER BY id",
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      // Returns [{id:1, status:'Unmarried'}, ...]
      res.json(results);
    }
  );
});

// GET /api/profileby
router.get("/profileby", (req, res) => {
  const sql = "SELECT Relation_id, Relation FROM profile ORDER BY Relation";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching profile relations:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET /api/star
router.get("/star", (req, res) => {
  const sql = `
    SELECT DISTINCT TRIM(Star) AS status
    FROM register
    WHERE Star IS NOT NULL AND TRIM(Star) <> ''
    ORDER BY status
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching stars:", err);
      return res.status(500).json({ error: err.message });
    }
    // results will be [{ status: 'Ashwini' }, { status: 'Bharani' }, ...]
    res.json(results);
  });
});

// GET /api/subcastes?caste=Gounder OR ?caste=365
router.get("/subcastes", (req, res) => {
  let { caste } = req.query;
  if (!caste) return res.json([]);

  // Trim & detect numeric id
  caste = String(caste).trim();
  const isId = /^\d+$/.test(caste);

  let sql;
  let params = [];

  if (isId) {
    // Use CasteID directly
    sql =
      "SELECT ID, Subcaste FROM subcaste WHERE CasteID = ? ORDER BY Subcaste";
    params = [caste];
  } else {
    // Join with caste table to find matching subcastes by caste name
    sql = `
    SELECT s.ID, s.Subcaste
FROM subcaste s
JOIN caste c ON s.CasteID = c.ID
WHERE c.Caste = ?
ORDER BY s.Subcaste
`;
    params = [caste];
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("subcastes query error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});



// /////////////////////////////////////////////////////////////////////

// =========================
// Horoscope Dynamic Options
// =========================

// GET /api/moon-sign
router.get("/moon-sign", (req, res) => {
  const sql = "SELECT ID, Moon_Sign FROM moon_sign ORDER BY Moon_Sign";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET /api/nakshatra
router.get("/nakshatra", (req, res) => {
  const sql = "SELECT id, Nakshatra FROM nakshatra ORDER BY Nakshatra";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET /api/gothra
router.get("/gothra", (req, res) => {
  const sql = "SELECT ID, Gothra FROM gothra ORDER BY Gothra";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET /api/manglik
router.get("/manglik", (req, res) => {
  const sql = "SELECT id, type FROM manglik ORDER BY id";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET /api/shani
router.get("/shani", (req, res) => {
  const sql = "SELECT id, type FROM shani ORDER BY id";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET /api/horoscope-match
router.get("/horoscope-match", (req, res) => {
  const sql = "SELECT id, type FROM horoscope_match ORDER BY id";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ============================
// CONTACT DROPDOWNS API
// ============================

// GET /api/countries
router.get("/countries", (req, res) => {
  const sql = "SELECT id, country FROM e_country ORDER BY country";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results); // [{id, country}]
  });
});

// GET /api/states?country=Afghanistan
router.get("/states", (req, res) => {
  const { country } = req.query;
  if (!country) return res.json([]);

  const sql = `
    SELECT id, state 
    FROM e_state 
    WHERE TRIM(LOWER(cid)) = TRIM(LOWER(?))
    ORDER BY state
  `;
  db.query(sql, [country], (err, results) => {
    if (err) {
      console.error("Error fetching states:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET /api/districts?state=Gujarat
router.get("/districts", (req, res) => {
  const { state } = req.query;
  if (!state) return res.json([]);

  // Use the actual table/column names from your DB (e_dist / dist / sid2)
  const sql = `
    SELECT id, dist
    FROM e_dist
    WHERE TRIM(LOWER(sid2)) = TRIM(LOWER(?)) AND status = 1
    ORDER BY dist
  `;

  db.query(sql, [state], (err, results) => {
    if (err) {
      console.error("Error fetching districts:", err); // server log only
      // return a clean JSON array so frontend never breaks on map()
      return res.status(500).json([]);
    }

    // Ensure results is an array (defensive)
    res.json(Array.isArray(results) ? results : []);
  });
});

// GET /api/residency-status
router.get("/residency-status", (req, res) => {
  db.query(
    "SELECT id, residency_status FROM residency_status ORDER BY id",
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// GET /api/calling-time
router.get("/calling-time", (req, res) => {
  db.query(
    "SELECT DISTINCT call_time FROM calling_time ORDER BY call_time",
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// ============================
// Education, Occupation & Work APIs
// ============================

// GET /api/employed-in
router.get("/employed-in", (req, res) => {
  const sql = "SELECT id, employed FROM employed_in ORDER BY employed";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching employed_in:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results); // [{id: 1, employed: "Private"}, ...]
  });
});

// GET /api/working-hours
router.get("/working-hours", (req, res) => {
  const sql = "SELECT hours FROM working_hours ORDER BY hours";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching working_hours:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results); // [{hours: "Full Time"}, ...]
  });
});

// ============================
// Physical Details & Hobbies APIs
// ============================

// GET /api/blood-groups
router.get("/blood-groups", (req, res) => {
  const sql = "SELECT id, type FROM blood_group ORDER BY type";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching blood groups:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET /api/complexions
router.get("/complexions", (req, res) => {
  const sql = "SELECT ID, complexion FROM complexion ORDER BY complexion";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching complexions:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET /api/body-types
router.get("/body-types", (req, res) => {
  const sql = "SELECT id, body_type FROM body_type ORDER BY body_type";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching body types:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET /api/diets
router.get("/diets", (req, res) => {
  const sql = "SELECT id, diet_type FROM diet ORDER BY diet_type";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching diets:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET /api/smoke
router.get("/smoke", (req, res) => {
  const sql = "SELECT id, smoke_type FROM smoke ORDER BY smoke_type";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching smoke types:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET /api/drink
router.get("/drink", (req, res) => {
  const sql = "SELECT id, Drink_type FROM drink ORDER BY Drink_type";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching drink types:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET /api/special-cases
router.get("/special-cases", (req, res) => {
  const sql = "SELECT id, case_type FROM special_case ORDER BY case_type";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching special cases:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET /api/hobbies
router.get("/hobbies", (req, res) => {
  const sql = "SELECT id, hobbies FROM hobbies ORDER BY hobbies";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching hobbies:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET /api/interests
router.get("/interests", (req, res) => {
  const sql = "SELECT id, interest FROM interest ORDER BY interest";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching interests:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// ============================
// Family Details APIs
// ============================

// GET /api/family-values
router.get("/family-values", (req, res) => {
  const sql = "SELECT id, family_values FROM family_values ORDER BY id";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching family values:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET /api/family-types
router.get("/family-types", (req, res) => {
  const sql = "SELECT id, family_typ FROM family_type ORDER BY id";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching family types:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET /api/family-status
router.get("/family-status", (req, res) => {
  const sql = "SELECT id, family_status FROM family_status ORDER BY id";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching family status:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET /api/mother-tongues
router.get("/mother-tongues", (req, res) => {
  const sql =
    "SELECT id, mother_tounge FROM mother_tounge ORDER BY mother_tounge";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching mother tongues:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET /api/no-of-brothers
router.get("/no-of-brothers", (req, res) => {
  const sql = "SELECT id, number FROM no_of_brother ORDER BY id";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching brothers:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET /api/no-of-brothers-married
router.get("/no-of-brothers-married", (req, res) => {
  const sql = "SELECT id, number_married FROM no_of_bro_married ORDER BY id";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching brothers married:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET /api/no-of-sisters
router.get("/no-of-sisters", (req, res) => {
  const sql = "SELECT id, number FROM no_of_sister ORDER BY id";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching sisters:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET /api/no-of-sisters-married
router.get("/no-of-sisters-married", (req, res) => {
  const sql = "SELECT id, number_married FROM no_of_sis_married ORDER BY id";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching sisters married:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// ============================
// Family Wealth API
// ============================

// GET /api/family-wealth
router.get("/family-wealth", (req, res) => {
  const sql = "SELECT wealth FROM family_wealth ORDER BY wealth";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching family wealth:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results); // [{wealth: "Own House"}, {wealth: "Multiple Properties"}]
  });
});

export default router;
