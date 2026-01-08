

import axios from "axios";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useEffect, useState } from "react";

const API_BASE = process.env.REACT_APP_API_BASE || "";

export default function ContactUs() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    subject: "",
    email: "",
    message: "",
  });

  const [fadeIn, setFadeIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => setFadeIn(true), 200);
    return () => clearTimeout(timeout);
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (error) setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const res = await axios.post(`${API_BASE}/api/admin/contact-message`, form);
      
      if (res.data.success) {
        setSuccess(true);
        setForm({
          firstName: "",
          lastName: "",
          subject: "",
          email: "",
          message: "",
        });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(res.data.message || "Failed to send message");
      }
    } catch (err) {
      console.error("Contact form error:", err);
      setError(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7e3e6] text-gray-800 font-display overflow-hidden">
      <section className="relative flex flex-col justify-center items-center text-center min-h-[60vh] overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 transform rotate-2 scale-110"
          style={{
            backgroundImage:
              "url('https://i.pinimg.com/1200x/dc/01/79/dc017905511f6d9ccff8a5a695ad6b29.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(3px) brightness(0.75)",
          }}
        ></div>

        {/* Overlay for tone balance */}
        <div className="absolute inset-0 bg-[#d16b86]/55 mix-blend-multiply"></div>

        {/* Text */}
        <div className="relative z-10 px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-md">
            Get in Touch
          </h1>
          <p className="text-base md:text-lg text-white opacity-95 max-w-2xl mx-auto leading-relaxed">
            We’d love to hear from you. Reach out for any enquiries or support.
          </p>
        </div>
      </section>

      {/* 📍 Contact Info Cards */}
    {/* 📍 Contact Info Cards */}
<section
  className={`py-16 transition-all duration-1000 ${
    fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
  }`}
>
  <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
    {[
      {
        icon: <MapPin className="w-7 h-7 text-[#b24b63]" />,
        title: "Address",
        text: (
          <>
            Sri Angalamman Matrimony,
            <br />
            108, Anna Street,
            <br />
            Near SPS Documentation Office,
            <br />
            Sivagiri, Erode (DT),
            <br />
            Tamil Nadu – 638109
          </>
        ),
      },
      {
        icon: <Phone className="w-7 h-7 text-[#b24b63]" />,
        title: "Call Us",
        text: (
          <>
            94439 46541
            <br />
            70104 59106
            <br />
            <span className="text-sm opacity-75">
              WhatsApp Available
            </span>
          </>
        ),
      },
      {
        icon: <Mail className="w-7 h-7 text-[#b24b63]" />,
        title: "Email",
        text: <>sriangalammanspsk2020@gmail.com</>,
      },
    ].map((item, i) => (
      <div
        key={i}
        className="p-6 rounded-2xl bg-white border border-[#f2c7d0] shadow-sm hover:shadow-lg transition-all duration-300 ease-out hover:-translate-y-1"
      >
        <div className="w-14 h-14 mx-auto rounded-full bg-[#fbe0e6] flex items-center justify-center mb-4 shadow-sm">
          {item.icon}
        </div>
        <h3 className="text-lg font-semibold mb-1 text-[#912e45] text-center">
          {item.title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed text-center">
          {item.text}
        </p>
      </div>
    ))}
  </div>
</section>


      {/* 💌 Contact Form */}
      <section
        className={`pb-20 px-4 transition-all duration-1000 delay-200 ${
          fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-3xl p-8 sm:p-10 border border-[#f2c7d0]">
          <h2 className="text-2xl font-semibold text-center mb-8 text-[#912e45]">
            Send Us a Message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-600 font-medium">
                  First Name
                </label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-[#f2c7d0] bg-[#fff9fa] focus:outline-none focus:ring-2 focus:ring-[#e58da1] transition-all"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 font-medium">
                  Last Name
                </label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-[#f2c7d0] bg-[#fff9fa] focus:outline-none focus:ring-2 focus:ring-[#e58da1] transition-all"
                />
              </div>
            </div>

            {/* Subject + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-600 font-medium">
                  Subject
                </label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Enquiry about membership"
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-[#f2c7d0] bg-[#fff9fa] focus:outline-none focus:ring-2 focus:ring-[#e58da1] transition-all"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 font-medium">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-[#f2c7d0] bg-[#fff9fa] focus:outline-none focus:ring-2 focus:ring-[#e58da1] transition-all"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="text-sm text-gray-600 font-medium">
                Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                placeholder="Write your message..."
                className="w-full mt-2 px-4 py-3 rounded-xl border border-[#f2c7d0] bg-[#fff9fa] focus:outline-none focus:ring-2 focus:ring-[#e58da1] transition-all resize-none"
              />
            </div>

            {/* Success Message */}
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-center">
                ✅ Thanks! Your message has been sent successfully. We'll get back to you soon.
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center">
                ❌ {error}
              </div>
            )}

            {/* Button */}
            <div className="pt-2 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 bg-[#d16b86] hover:bg-[#b24b63] text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
