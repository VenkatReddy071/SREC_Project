// src/data/dummyNotificationData.js

export const dummyTemplates = [
  {
    id: "temp001",
    title: "New Offer Alert",
    subject: "Exciting New Health Offer Available!",
    content: "Dear patient, check out our limited-time health package discount. Click the link to learn more!",
    ctaLink: "/offers",
    notificationType: "Email",
  },
  {
    id: "temp002",
    title: "Doctor on Leave (Dr. Smith)",
    subject: "Important: Dr. Smith's Leave Notification",
    content: "Please note that Dr. Smith will be on leave from [Start Date] to [End Date]. Please reschedule your appointment if necessary.",
    ctaLink: null,
    notificationType: "SMS",
  },
  {
    id: "temp003",
    title: "General Health Tip",
    subject: "Stay Healthy: Daily Tip!",
    content: "Remember to drink at least 8 glasses of water daily for optimal health. #HealthTip",
    ctaLink: null,
    notificationType: "In-App",
  },
];

export const dummyDoctors = [
    { id: "doc001", name: "Dr. Smith", specialization: "Cardiology" },
    { id: "doc002", name: "Dr. Jones", specialization: "Pediatrics" },
    { id: "doc003", name: "Dr. Lee", specialization: "Dermatology" },
];

export const dummyConditions = [
    "Diabetic",
    "Hypertensive",
    "Asthmatic",
    "Cardiovascular Disease",
    "Pregnant",
];

// Placeholder for a function to simulate fetching specific users
export const getSpecificUsers = (query) => {
    // In a real app, this would query a database
    console.log(`Simulating fetching specific users for query: ${query}`);
    return [
        { id: "user001", name: "Alice Johnson", email: "alice@example.com", phone: "123-456-7890" },
        { id: "user002", name: "Bob Williams", email: "bob@example.com", phone: "987-654-3210" },
    ];
};