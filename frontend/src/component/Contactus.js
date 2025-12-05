// import React, { useState } from "react";
// import { MapPin, Phone, Mail, Send } from "lucide-react";

// export default function ContactUs() {
//   const [form, setForm] = useState({
//     firstName: "",
//     lastName: "",
//     subject: "",
//     email: "",
//     message: "",
//   });

//   function handleChange(e) {
//     const { name, value } = e.target;
//     setForm((p) => ({ ...p, [name]: value }));
//   }

//   function handleSubmit(e) {
//     e.preventDefault();
//     // Replace with your form submit logic (API call / email service)
//     console.log("Contact form submitted:", form);
//     alert("Thanks! Your message has been received.");
//     setForm({
//       firstName: "",
//       lastName: "",
//       subject: "",
//       email: "",
//       message: "",
//     });
//   }

//   return (
//     <div className="min-h-screen bg-white text-gray-800 font-display">
//       {/* Top contact cards */}
//       <section className="py-16">
//         <div className="container mx-auto px-6 mt-16">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
//             {/* Card */}
//             <div className="flex flex-col items-center text-center p-6">
//               <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg flex items-center justify-center mb-6">
//                 <MapPin className="w-8 h-8 text-white" />
//               </div>
//               <h3 className="text-xl font-bold mb-2">Address</h3>
//               <p className="text-sm tracking-wider uppercase font-semibold">
//                 Sri Angalamman Matrimony,
//                 <br />
//                 108, Anna Street,
//                 <br />
//                 Sivagiri, Erode(DT),
//                 <br />
//                 Tamilnadu - 638109
//               </p>
//             </div>

//             <div className="flex flex-col items-center text-center p-6">
//               <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg flex items-center justify-center mb-6">
//                 <Phone className="w-8 h-8 text-white" />
//               </div>
//               <h3 className="text-xl font-bold mb-2">Call Us</h3>
//               <p className="text-sm">9629891299</p>
//               <p className="text-sm">(WhatsApp: 9629891299)</p>
//             </div>

//             <div className="flex flex-col items-center text-center p-6">
//               <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg flex items-center justify-center mb-6">
//                 <Mail className="w-8 h-8 text-white" />
//               </div>
//               <h3 className="text-xl font-bold mb-2">Email</h3>
//               <p className="text-sm">info@sriangalammanmatrimony.com</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Form section */}
//       <section className="pb-20">
//         <div className="container mx-auto px-6">
//           <div className="bg-white shadow-md rounded-lg p-8">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <label className="block">
//                   <span className="text-sm text-orange-500">First Name</span>
//                   <input
//                     name="firstName"
//                     value={form.firstName}
//                     onChange={handleChange}
//                     className="mt-2 block w-full border border-gray-200 rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-gray-50"
//                     placeholder="John"
//                   />
//                 </label>

//                 <label className="block">
//                   <span className="text-sm text-orange-500">Last Name</span>
//                   <input
//                     name="lastName"
//                     value={form.lastName}
//                     onChange={handleChange}
//                     className="mt-2 block w-full border border-gray-200 rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-gray-50"
//                     placeholder="Doe"
//                   />
//                 </label>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <label className="block">
//                   <span className="text-sm text-orange-500">Subject</span>
//                   <input
//                     name="subject"
//                     value={form.subject}
//                     onChange={handleChange}
//                     className="mt-2 block w-full border border-gray-200 rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-gray-50"
//                     placeholder="Enquiry about membership"
//                   />
//                 </label>

//                 <label className="block">
//                   <span className="text-sm text-orange-500">E-mail</span>
//                   <input
//                     name="email"
//                     value={form.email}
//                     onChange={handleChange}
//                     type="email"
//                     className="mt-2 block w-full border border-gray-200 rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-gray-50"
//                     placeholder="you@example.com"
//                   />
//                 </label>
//               </div>

//               <label className="block">
//                 <span className="text-sm text-orange-500">Message</span>
//                 <textarea
//                   name="message"
//                   value={form.message}
//                   onChange={handleChange}
//                   rows={8}
//                   className="mt-2 block w-full border border-gray-200 rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-gray-50 resize-none"
//                   placeholder="Write your message..."
//                 />
//               </label>

//               <div className="pt-2">
//                 <button
//                   type="submit"
//                   className="w-full md:w-1/2 block mx-auto py-3 rounded-2xl shadow-lg transform hover:-translate-y-0.5 transition-all duration-150 bg-gradient-to-r from-orange-400 via-orange-500 to-pink-600 text-white font-medium tracking-wider flex items-center justify-center gap-3"
//                 >
//                   <Send className="w-4 h-4" />
//                   <span>Submit</span>
//                 </button>
//               </div>
//             </form>
//           </div>

//           {/* Optional: small image row below form to reflect the provided screenshots */}
//         </div>
//       </section>

//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Send } from "lucide-react";

export default function ContactUs() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    subject: "",
    email: "",
    message: "",
  });

  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setFadeIn(true), 200);
    return () => clearTimeout(timeout);
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Contact form submitted:", form);
    alert("✅ Thanks! Your message has been received.");
    setForm({
      firstName: "",
      lastName: "",
      subject: "",
      email: "",
      message: "",
    });
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
                  <br /> 108, Anna Street,
                  <br /> Sivagiri, Erode(DT),
                  <br /> Tamil Nadu - 638109
                </>
              ),
            },
            {
              icon: <Phone className="w-7 h-7 text-[#b24b63]" />,
              title: "Call Us",
              text: (
                <>
                  9629891299
                  <br />
                  <span className="text-sm opacity-75">
                    WhatsApp: 9629891299
                  </span>
                </>
              ),
            },
            {
              icon: <Mail className="w-7 h-7 text-[#b24b63]" />,
              title: "Email",
              text: <>info@sriangalammanmatrimony.com</>,
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

            {/* Button */}
            <div className="pt-2 flex justify-center">
              <button
                type="submit"
                className="px-8 py-3 bg-[#d16b86] hover:bg-[#b24b63] text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
