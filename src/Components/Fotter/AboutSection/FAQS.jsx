import React, { useState } from "react";

const faqData = {
  "Restaurant Tiffins": [
    {
      question: "How to order a tiffin?",
      answer: "You can order a tiffin via our website or app by selecting your meal and delivery slot.",
    },
    {
      question: "What are the delivery areas and timings?",
      answer: "We deliver from 8 AM to 8 PM within select city areas.",
    },
    {
      question: "Can I customize my meal?",
      answer: "Yes, customization options are available on the order page.",
    },
  ],
  "Fashion & Hospital Appointments": [
    {
      question: "How to book an appointment?",
      answer: "Use the booking form on the appointments page to select date, time, and service.",
    },
    {
      question: "What is the cancellation policy?",
      answer: "Cancellations are allowed up to 24 hours before the appointment.",
    },
    {
      question: "How do I get appointment reminders?",
      answer: "We send SMS and email reminders 24 hours and 1 hour before your appointment.",
    },
  ],
};

export default function FAQS() {
  const [activeCategory, setActiveCategory] = useState("Restaurant Tiffins");
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (cat, idx) => {
    setExpanded((prev) => ({
      ...prev,
      [cat]: prev[cat] === idx ? null : idx,
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h1>

      <div className="flex justify-center space-x-4 mb-8">
        {Object.keys(faqData).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 font-semibold rounded border transition-colors ${
              activeCategory === cat
                ? "bg-white text-black border-white"
                : "bg-transparent border-white hover:bg-white hover:text-black"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="border-t border-gray-700 divide-y divide-gray-700">
        {faqData[activeCategory].map((item, idx) => (
          <div key={idx} className="py-4">
            <div
              onClick={() => toggleExpand(activeCategory, idx)}
              className="flex justify-between cursor-pointer font-bold select-none"
            >
              <span>{item.question}</span>
              <span className="text-2xl">{expanded[activeCategory] === idx ? "−" : "+"}</span>
            </div>
            {expanded[activeCategory] === idx && (
              <div className="mt-2 text-gray-300">{item.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
