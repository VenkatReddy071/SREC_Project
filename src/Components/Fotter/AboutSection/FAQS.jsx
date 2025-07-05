import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa"; // Using specific icons for clarity

const faqData = {
  "Restaurant & Tiffins": [
    {
      question: "How to order a tiffin?",
      answer: "You can order a tiffin via our website or app by selecting your meal and delivery slot.",
    },
    {
      question: "What are the delivery areas and timings?",
      answer: "We deliver from 8 AM to 8 PM within select city areas. Specific timings can be found on the restaurant's page.",
    },
    {
      question: "Can I customize my meal?",
      answer: "Yes, customization options are available on the order page for supported restaurants.",
    },
    {
      question: "How do I track my food order?",
      answer: "Once your order is placed, you will receive real-time updates via SMS and within the app, including estimated delivery time and driver's location.",
    },
    {
      question: "What payment methods are accepted for food orders?",
      answer: "We accept various payment methods including credit/debit cards, net banking, and popular digital wallets.",
    },
  ],
  "Fashion & Hospital Appointments": [
    {
      question: "How to book an appointment?",
      answer: "Use the booking form on the appointments page to select date, time, and service. You'll receive a confirmation once booked.",
    },
    {
      question: "What is the cancellation policy for appointments?",
      answer: "Cancellations are allowed up to 24 hours before the appointment for a full refund. Please refer to our Terms of Service for detailed policy.",
    },
    {
      question: "How do I get appointment reminders?",
      answer: "We send SMS and email reminders 24 hours and 1 hour before your appointment to ensure you don't miss it.",
    },
    {
      question: "How can I shop for fashion items?",
      answer: "Browse our extensive fashion categories, select your desired items, choose size/color, and proceed to our secure checkout. We offer personalized recommendations too!",
    },
    {
      question: "What is the return policy for fashion purchases?",
      answer: "Our return policy allows returns within 7 days of delivery for eligible items. Please check the specific product's return eligibility on its detail page.",
    },
  ],
  "Schools & Colleges": [
    {
      question: "How can I find information about schools?",
      answer: "Navigate to our Education section, where you can browse schools and colleges by location, course, and other filters. Detailed profiles are available for each institution.",
    },
    {
      question: "Can I apply to colleges directly through NANDYAL INFO?",
      answer: "Yes, for many partner institutions, you can directly fill out and submit application forms online through our platform.",
    },
    {
      question: "Are there reviews available for educational institutions?",
      answer: "Yes, you can explore reviews and ratings from alumni and current students to gain insights into campus life, faculty, and academics.",
    },
  ],
};

export default function FAQS() {
  const [activeCategory, setActiveCategory] = useState("Restaurant & Tiffins");
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (cat, idx) => {
    setExpanded((prev) => ({
      ...prev,
      [cat]: prev[cat] === idx ? null : idx,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-6 md:p-10">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-blue-400">Frequently Asked Questions</h1>

      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {Object.keys(faqData).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-3 font-semibold rounded-full border-2 transition-all duration-300 text-lg
              ${activeCategory === cat
                ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                : "bg-transparent border-blue-400 text-blue-400 hover:bg-blue-500 hover:border-blue-500 hover:text-white"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="max-w-4xl mx-auto border border-gray-700 rounded-xl overflow-hidden shadow-2xl">
        {faqData[activeCategory].map((item, idx) => (
          <div key={idx} className="border-b border-gray-800 last:border-b-0">
            <div
              onClick={() => toggleExpand(activeCategory, idx)}
              className="flex justify-between items-center p-5 cursor-pointer font-bold select-none bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
            >
              <span className="text-lg md:text-xl text-blue-200">{item.question}</span>
              <span className="text-xl text-blue-200">
                {expanded[activeCategory] === idx ? <FaMinus /> : <FaPlus />}
              </span>
            </div>
            {expanded[activeCategory] === idx && (
              <div className="mt-0 p-5 text-gray-300 bg-gray-850 animate-fade-in">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
