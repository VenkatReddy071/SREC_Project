// src/data/dummyHospital.js

// This dummy data represents a single hospital object as per your provided schema
export const dummyHospital = {
  id: "hosp001",
  name: "Central City Hospital",
  image: "https://placehold.co/600x400/007bff/ffffff?text=Hospital",
  gallery: [
    "https://placehold.co/400x300/007bff/ffffff?text=Lobby",
    "https://placehold.co/400x300/007bff/ffffff?text=Waiting+Area",
  ],
  phoneNumber: "+1-800-555-0199",
  patientSatisfaction: 95,
  successRate: 98,
  ProceduresAnnually: 18000,
  glimpseInside: [
    "https://placehold.co/400x300/007bff/ffffff?text=Operating+Room",
    "https://placehold.co/400x300/007bff/ffffff?text=Patient+Room",
  ],
  locationName: "Downtown Campus",
  address: "123 Main Street, Anytown, USA",
  rating: 4.8,
  ownerEmail: "admin@centralcityhospital.com",
  // THIS IS THE SERVICES ARRAY ACCORDING TO YOUR SCHEMA
  services: [
    "General Consultation",
    "Emergency Services",
    "Cardiology",
    "Orthopedics",
    "Pediatrics",
    "Maternity & Childcare",
    "Dermatology",
    "Oncology",
    "Neurology",
    "Physiotherapy",
    "Radiology",
    "Pathology Lab",
  ],
  ambulance: true,
  info: "Central City Hospital is a state-of-the-art medical facility committed to providing exceptional healthcare services.",
  specialization: ["Cardiology", "Orthopedics", "Emergency Medicine"],
  foundation: new Date("1975-03-20"),
  nearByLocation: "City Center",
  status: "accept",
};