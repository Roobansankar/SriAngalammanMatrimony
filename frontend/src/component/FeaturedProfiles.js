import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../config/api";

export const FeaturedProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    axios
      .get(`${API}/admin/featured-profiles`)
      .then((res) => setProfiles(res.data.profiles || []))
      .catch(console.error);
  }, []);

  // duplicate once (IMPORTANT)
  const displayProfiles = [...profiles.slice(0, 6), ...profiles.slice(0, 6)];

  return (
    <section className="featured-section">
      <div className="container">
        <h2 className="title">Featured Profiles</h2>

        {/* OUTER WRAPPER */}
        <div className="slider-wrapper">
          {/* ROW */}
          <div
            className={`scroll-row ${paused ? "paused" : ""}`}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
            onTouchEnd={() => setPaused(true)} // stay paused
          >
            {/* TRACK (ANIMATED) */}
            <div className="scroll-track">
              {displayProfiles.map((p, index) => (
                <div className="profile-card" key={`${p.MatriID}-${index}`}>
                  <img src={p.PhotoURL} alt={p.Name} className="profile-img" />

                  <p className="profile-id">ID: {p.MatriID}</p>

                  <h3 className="profile-name">
                    {p.Name}, {p.Age}
                  </h3>

                  <p className="profile-job">{p.Occupation}</p>

                  <Link to="/login" className="profile-btn">
                    View Profile
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= CSS (SAME FILE) ================= */}
      <style>{`
        /* ===== SECTION ===== */
        .featured-section {
          padding: 4rem 0;
          background: #ffffff;
          overflow: hidden;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .title {
          text-align: center;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 3rem;
          color: #111827;
        }

        /* ===== SLIDER STRUCTURE ===== */
        .slider-wrapper {
          width: 100%;
          overflow: hidden;
        }

        .scroll-row {
          width: 100%;
          overflow: hidden;

          /* disable mobile drag */
          touch-action: none;
          user-select: none;
        }

        .scroll-track {
          display: flex;
          gap: 1.5rem;
          width: max-content;

          animation: scroll-left 10s linear infinite;
          will-change: transform;
        }

        .scroll-row.paused .scroll-track {
          animation-play-state: paused;
        }

        /* ===== CARD ===== */
        .profile-card {
          flex-shrink: 0;
          width: 260px;
          background: linear-gradient(135deg, #fff1f2, #ffe4e6);
          border-radius: 24px;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .profile-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        /* ===== IMAGE ===== */
        .profile-img {
          width: 160px;
          height: 160px;
          border-radius: 50%;
          object-fit: cover;
          margin: 0 auto 1rem;
          border: 4px solid #ffffff;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }

        /* ===== TEXT ===== */
        .profile-id {
          font-size: 0.75rem;
          font-weight: 600;
          color: #e11d48;
          margin-bottom: 0.5rem;
        }

        .profile-name {
          font-size: 1rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.25rem;
        }

        .profile-job {
          font-size: 0.75rem;
          color: #4b5563;
          margin-bottom: 1rem;
        }

        /* ===== BUTTON ===== */
        .profile-btn {
          display: inline-block;
          padding: 0.5rem 1.5rem;
          background: #f43f5e;
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 500;
          border-radius: 9999px;
          text-decoration: none;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .profile-btn:hover {
          background: #e11d48;
          transform: scale(1.05);
        }

        /* ===== PERFECT GAP-FREE ANIMATION ===== */
        @keyframes scroll-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
};
