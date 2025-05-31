import React, { useState } from "react";

const ContactUs = () => {
  const [issue, setIssue] = useState({
    name: "",
    email: "",
    category: "General Inquiry",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIssue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your issue has been reported successfully!");
    console.log(issue);
    setIssue({
      name: "",
      email: "",
      category: "General Inquiry",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-blue-600 text-white py-6 px-4 shadow-md">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold">NIC Info Contact Us</h1>
          <p className="text-lg mt-2">We're here to help you, 24x7.</p>
        </div>
      </header>

      <main className="py-8 px-4">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              How Can We Assist You?
            </h2>
            <p className="text-gray-600">
              NIC Info is dedicated to resolving your concerns. Whether it’s
              about restaurant orders, hospital appointments, or fashion
              shopping, we're just a click away.
            </p>
          </section>

          {/* Report Issue Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Report an Issue
            </h2>
            <form
              onSubmit={handleSubmit}
              className="bg-gray-100 p-6 rounded-lg shadow-sm"
            >
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={issue.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={issue.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={issue.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>General Inquiry</option>
                  <option>Restaurant Orders</option>
                  <option>Hospital Appointments</option>
                  <option>Fashion Support</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={issue.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-blue-700"
              >
                Submit Issue
              </button>
            </form>
          </section>

          {/* FAQ Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Frequently Asked Questions (FAQ)
            </h2>
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <h3 className="font-bold mb-2">How can I track my order?</h3>
              <p className="text-gray-600">
                Log in to your NIC Info account and navigate to "My Orders" to
                track your deliveries.
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm mt-4">
              <h3 className="font-bold mb-2">
                Can I reschedule a hospital appointment?
              </h3>
              <p className="text-gray-600">
                Yes, you can. Go to "My Appointments" in your account and select
                the reschedule option.
              </p>
            </div>
          </section>

          {/* Support Hours Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Support Hours
            </h2>
            <p className="text-gray-600">
              Our support team is available 24x7 to assist you. Live chat and
              email responses are typically handled within 10-15 minutes.
            </p>
          </section>

          {/* Feedback Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Feedback
            </h2>
            <form className="bg-gray-100 p-6 rounded-lg shadow-sm">
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Rate Your Experience
                </label>
                <select
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Excellent</option>
                  <option>Good</option>
                  <option>Average</option>
                  <option>Poor</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Your Suggestions
                </label>
                <textarea
                  rows="5"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-blue-700"
              >
                Submit Feedback
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ContactUs;
