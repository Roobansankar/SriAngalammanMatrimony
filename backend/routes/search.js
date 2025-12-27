// // routes/search.js

import express from "express";
import db from "../config/db.js";

const router = express.Router();

const GALLERY_PATH = "/gallery/";
const FALLBACK = "nophoto.jpg";

// UPDATED: Return relative path
function makePhotoUrl(photoFilename, photoApprove) {
  const valid =
    photoFilename &&
    photoFilename !== "no-photo.gif" &&
    String(photoApprove).toLowerCase() === "yes";

  if (valid) {
    return `${GALLERY_PATH}${encodeURIComponent(photoFilename)}`;
  }
  return null;
}

function makePhotoUrl1(photoFilename, photoApprove) {
  const valid =
    photoFilename &&
    photoFilename !== "no-photo.gif" &&
    String(photoApprove).toLowerCase() === "yes";

  if (valid) {
    return `${GALLERY_PATH}${encodeURIComponent(photoFilename)}`;
  }
  return null;
}

function makePhotoUrl2(photoFilename, photoApprove) {
  const valid =
    photoFilename &&
    photoFilename !== "no-photo.gif" &&
    String(photoApprove).toLowerCase() === "yes";

  if (valid) {
    return `${GALLERY_PATH}${encodeURIComponent(photoFilename)}`;
  }
  return null;
}

// ... rest of the file ...



// ============================
// MAIN SEARCH ROUTE
// ============================

router.post(["/search", "/advancesearch", "/horoscopesearch"], async (req, res) => {
  try {
    const {
      gender,
      txtSAge,
      txtEAge,
      looking,
      religion,
      caste,
      edu,
      occu,
      with_photo,
      star,
      moonsign,
      page = 1,
      viewerId
    } = req.body;

    const perPage = 10;
    const offset = (page - 1) * perPage;

    // Start with a permissive base query
    // We only exclude 'Banned' users by default. 
    // We handle visibility as well but allow NULLs (which is the default for new users)
    let whereClauses = ["(Status IS NULL OR Status <> 'Banned')", "(visibility IS NULL OR visibility <> 'hidden')"];
    let params = [];

    // Gender - Important to match exact case or use LOWER
    if (gender) {
      whereClauses.push("LOWER(Gender) = LOWER(?)");
      params.push(gender);
    }

    // Age
    if (txtSAge && txtEAge) {
      whereClauses.push("TIMESTAMPDIFF(YEAR, DOB, CURDATE()) BETWEEN ? AND ?");
      params.push(parseInt(txtSAge), parseInt(txtEAge));
    }

    // Marital Status (looking)
    if (looking && Array.isArray(looking) && !looking.includes("Any") && looking.length > 0) {
      const placeholders = looking.map(() => "LOWER(?)").join(",");
      whereClauses.push(`LOWER(Maritalstatus) IN (${placeholders})`);
      params.push(...looking.map(v => v.toLowerCase()));
    }

    // Religion
    if (religion && Array.isArray(religion) && !religion.includes("Any") && religion.length > 0) {
      const placeholders = religion.map(() => "LOWER(?)").join(",");
      whereClauses.push(`LOWER(Religion) IN (${placeholders})`);
      params.push(...religion.map(v => v.toLowerCase()));
    }

    // Caste
    if (caste && Array.isArray(caste) && !caste.includes("Any") && caste.length > 0) {
      const placeholders = caste.map(() => "LOWER(?)").join(",");
      whereClauses.push(`LOWER(Caste) IN (${placeholders})`);
      params.push(...caste.map(v => v.toLowerCase()));
    }

    // Education
    if (edu && Array.isArray(edu) && !edu.includes("Any") && edu.length > 0) {
      const placeholders = edu.map(() => "LOWER(?)").join(",");
      whereClauses.push(`LOWER(Education) IN (${placeholders})`);
      params.push(...edu.map(v => v.toLowerCase()));
    }

    // Occupation
    if (occu && Array.isArray(occu) && !occu.includes("Any") && occu.length > 0) {
      const placeholders = occu.map(() => "LOWER(?)").join(",");
      whereClauses.push(`LOWER(Occupation) IN (${placeholders})`);
      params.push(...occu.map(v => v.toLowerCase()));
    }

    // Star (Horoscope)
    if (star && Array.isArray(star) && !star.includes("Any") && star.length > 0) {
      const placeholders = star.map(() => "LOWER(?)").join(",");
      whereClauses.push(`LOWER(Star) IN (${placeholders})`);
      params.push(...star.map(v => v.toLowerCase()));
    }

    // Moon Sign (Horoscope)
    if (moonsign && Array.isArray(moonsign) && !moonsign.includes("Any") && moonsign.length > 0) {
      const placeholders = moonsign.map(() => "LOWER(?)").join(",");
      whereClauses.push(`LOWER(Moonsign) IN (${placeholders})`);
      params.push(...moonsign.map(v => v.toLowerCase()));
    }

    // With Photo
    if (with_photo) {
      whereClauses.push("Photo1 IS NOT NULL AND Photo1 <> '' AND Photo1 <> 'no-photo.gif' AND Photo1Approve = 'Yes'");
    }

    // Blocking check (if viewerId is provided)
    if (viewerId) {
      whereClauses.push(`MatriID NOT IN (SELECT blocked_matriid FROM blocked_profiles WHERE blocker_matriid = ?)`);
      whereClauses.push(`MatriID NOT IN (SELECT blocker_matriid FROM blocked_profiles WHERE blocked_matriid = ?)`);
      params.push(viewerId, viewerId);
    }

    const whereSql = whereClauses.length > 0 ? " WHERE " + whereClauses.join(" AND ") : "";

    console.log(`🔍 Search Query: ${whereSql}`);
    console.log(`📦 Params: ${JSON.stringify(params)}`);

    const conn = db.promise();

    // Get total count
    const [countResult] = await conn.query(`SELECT COUNT(*) as total FROM register ${whereSql}`, params);
    const total = countResult[0].total;

    // Get profiles
    const selectSql = `
      SELECT *, TIMESTAMPDIFF(YEAR, DOB, CURDATE()) AS Age 
      FROM register 
      ${whereSql} 
      ORDER BY Regdate DESC 
      LIMIT ? OFFSET ?
    `;
    const [rows] = await conn.query(selectSql, [...params, perPage, offset]);

    // Process results to add PhotoURL
    const processedRows = rows.map(r => {
      const { ConfirmPassword, ParentPassword, ...safe } = r;
      return {
        ...safe,
        PhotoURL: makePhotoUrl(r.Photo1, r.Photo1Approve)
      };
    });

    res.json({
      total,
      results: processedRows
    });

  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Internal Server Error" });
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
      // Fallback to default values if table is missing or error occurs
      return res.json([
        { Relation_id: 1, Relation: "Self" },
        { Relation_id: 2, Relation: "Parents" },
        { Relation_id: 3, Relation: "Sibling" },
        { Relation_id: 4, Relation: "Relative" },
        { Relation_id: 5, Relation: "Friend" }
      ]);
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
    // Add id since table doesn't have one
    const withIds = results.map((r, idx) => ({ id: idx + 1, wealth: r.wealth }));
    res.json(withIds);
  });
});

export default router;
