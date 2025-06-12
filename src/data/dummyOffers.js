// src/data/dummyOffers.js
import { dummyDoctors, dummyDepartments, dummyServices } from './dummyEntity';

export const dummyOffers = [
  {
    _id: "off001",
    title: "Summer Health Checkup Package",
    shortDescription: "Comprehensive checkup for a healthy summer.",
    description: "Get a complete full body checkup including blood tests, vital checks, and a general physician consultation. Valid for all new patients.",
    category: "Health Checkup",
    originalPrice: 2500,
    discountedPrice: 1999,
    percentageDiscount: null,
    validityStartDate: new Date("2025-06-01T00:00:00Z"),
    validityEndDate: new Date("2025-08-31T23:59:59Z"),
    status: "Active",
    targetAudience: ["New Patients", "General Public"],
    termsAndConditions: "Offer cannot be combined with other discounts. Prior appointment required.",
    applicableDoctors: [dummyDoctors[0]._id, dummyDoctors[1]._id], // Dr. Smith, Dr. Jones
    applicableDepartments: [dummyDepartments[4]._id], // General Medicine
    applicableServices: [dummyServices[0]._id], // Full Body Checkup
    imageUrl: "https://via.placeholder.com/400x200?text=Health+Checkup+Offer",
  },
  {
    _id: "off002",
    title: "Senior Citizen Consultation Discount",
    shortDescription: "20% off all consultations for senior citizens.",
    description: "Special discount for patients aged 60 and above on all medical consultations across departments.",
    category: "Consultation Discount",
    originalPrice: null,
    discountedPrice: null,
    percentageDiscount: 20,
    validityStartDate: new Date("2025-05-15T00:00:00Z"),
    validityEndDate: new Date("2025-12-31T23:59:59Z"),
    status: "Active",
    targetAudience: ["Senior Citizens"],
    termsAndConditions: "ID proof required for age verification. Applicable on doctor consultation fees only.",
    applicableDoctors: [], // Applicable to all doctors (or specific ones if IDs are listed)
    applicableDepartments: [], // Applicable to all departments (or specific ones)
    applicableServices: [],
    imageUrl: "https://via.placeholder.com/400x200?text=Senior+Discount",
  },
  {
    _id: "off003",
    title: "Diabetic Patient Wellness Program",
    shortDescription: "Special package for managing diabetes.",
    description: "Includes regular checkups, dietician consultation, and discounted blood sugar tests.",
    category: "Wellness Program",
    originalPrice: 4000,
    discountedPrice: 3000,
    percentageDiscount: null,
    validityStartDate: new Date("2025-07-01T00:00:00Z"),
    validityEndDate: new Date("2025-09-30T23:59:59Z"),
    status: "Draft", // Example of a draft offer
    targetAudience: ["Diabetic Patients"],
    termsAndConditions: "Enrollment required. Program duration 3 months.",
    applicableDoctors: [dummyDoctors[0]._id], // Dr. Smith
    applicableDepartments: [dummyDepartments[0]._id, dummyDepartments[4]._id], // Cardiology, General Medicine
    applicableServices: [dummyServices[4]._id], // Dietician Consultation
    imageUrl: "https://via.placeholder.com/400x200?text=Diabetes+Care",
  },
  {
    _id: "off004",
    title: "Dental Care Family Package",
    shortDescription: "Discounted dental care for families.",
    description: "Includes cleaning and checkups for up to 4 family members.",
    category: "Dental Package",
    originalPrice: 3500,
    discountedPrice: 2800,
    percentageDiscount: null,
    validityStartDate: new Date("2025-04-01T00:00:00Z"),
    validityEndDate: new Date("2025-05-31T23:59:59Z"), // This offer is expired
    status: "Inactive",
    targetAudience: ["Families"],
    termsAndConditions: "Must be immediate family members. One visit per member.",
    applicableDoctors: [], // Assume dental dept
    applicableDepartments: [],
    applicableServices: [dummyServices[1]._id], // Dental Cleaning
    imageUrl: "https://via.placeholder.com/400x200?text=Dental+Offer",
  },
];