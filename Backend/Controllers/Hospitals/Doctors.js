const Doctor = require("../../models/Hospital/Doctoer"); // Ensure this is correct

const fetchDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("1. Received ID from URL params:", id); // Check what ID is being passed
    console.log("2. Type of ID:", typeof id); // Should be 'string'

    // This is the correct dynamic query:
    const doctors = await Doctor.find({ Hospital: "683c246f9d2fcdecc5705ebc" }).select(
      `name experience specialization image operationSuccessRate isAvaliable degree`
    );

    console.log("3. Mongoose query executed successfully.");
    console.log("4. Number of doctors found:", doctors ? doctors.length : 0);
    console.log("5. Found doctors data (first 2 if many):", doctors ? doctors.slice(0,2) : "No doctors found"); // Log partial data for brevity

    if (!doctors || doctors.length === 0) {
      console.log("6. No doctors found, sending 404 response.");
      return res.status(404).json({ message: `No doctors found for hospital ID: ${id}` });
    }

    console.log("7. Doctors found, sending 200 response.");
    return res.status(200).json(doctors);
  } catch (error) {
    console.error("8. Error caught in fetchDoctor:", error);
    // Ensure error.name and error.kind are logged for Mongoose errors
    if (error.name === 'CastError') {
        console.error("9. CastError caught: Invalid ObjectId provided for Hospital field.");
        return res.status(400).json({ message: "Invalid Hospital ID format.", error: error.message });
    }
    return res.status(500).json({ message: "An error occurred while fetching doctors.", error: error.message });
  }
};

module.exports = { fetchDoctor };