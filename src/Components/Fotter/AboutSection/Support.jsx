import React, { useState } from "react";

export default function Support() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "General Inquiry",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    "General Inquiry",
    "Order Support",
    "Appointment Support",
    "Technical Issue",
  ];

  const supportHours = "Mon-Fri, 9 AM - 6 PM";

  const validate = () => {
    let errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    )
      errs.email = "Invalid email address";
    if (!formData.message.trim()) errs.message = "Message is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Support form submitted:", formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", category: "General Inquiry", message: "" });
      setErrors({});
    }
  };

  return (
    <div className="min-h-screen bg-black text-white max-w-lg mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-center">Support</h1>

      <div className="bg-gray-900 p-5 rounded mb-8 leading-relaxed">
        <p>
          <strong>Contact us via:</strong><br />
          Email:{" "}
          <a href="mailto:support@yourdomain.com" className="underline text-white hover:text-gray-300">
            support@yourdomain.com
          </a>
          <br />
          Phone:{" "}
          <a href="tel:+1234567890" className="underline text-white hover:text-gray-300">
            +1 234 567 890
          </a>
          <br />
          Live Chat: Available {supportHours}
        </p>
        <p className="mt-3">
          <strong>Support Hours:</strong> {supportHours}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <label className="flex flex-col font-semibold">
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
            className={`mt-2 p-2 bg-black border rounded border-white text-white focus:outline-none focus:ring-2 focus:ring-white ${
              errors.name ? "border-red-500" : ""
            }`}
          />
          {errors.name && <span className="text-red-500 mt-1 text-sm">{errors.name}</span>}
        </label>

        <label className="flex flex-col font-semibold">
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your email address"
            className={`mt-2 p-2 bg-black border rounded border-white text-white focus:outline-none focus:ring-2 focus:ring-white ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          {errors.email && <span className="text-red-500 mt-1 text-sm">{errors.email}</span>}
        </label>

        <label className="flex flex-col font-semibold">
          Category:
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-2 p-2 bg-black border rounded border-white text-white focus:outline-none focus:ring-2 focus:ring-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-black text-white">
                {cat}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col font-semibold">
          Message:
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            placeholder="Describe your issue or question"
            className={`mt-2 p-2 bg-black border rounded border-white text-white focus:outline-none focus:ring-2 focus:ring-white resize-y ${
              errors.message ? "border-red-500" : ""
            }`}
          />
          {errors.message && <span className="text-red-500 mt-1 text-sm">{errors.message}</span>}
        </label>

        <button
          type="submit"
          className="bg-white text-black font-bold py-3 rounded hover:bg-gray-200 transition"
        >
          Submit
        </button>

        {submitted && (
          <p className="text-green-500 font-semibold mt-4 text-center">
            Thank you! Your message has been sent.
          </p>
        )}
      </form>
    </div>
  );
}
