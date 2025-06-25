const PatientStorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    storyContent: {
        type: String,
        required: true,
        trim: true
    },
    patientName: {
        type: String,
        required: true,
        trim: true
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital",
        required: true,
    },
    image_url: {
        type: String,
        trim: true,
        default: 'https://placehold.co/600x400/D3D3D3/000?text=Patient+Story' // Default image for stories
    },
    publishedDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const PatientStory = mongoose.model("PatientStory", PatientStorySchema);

module.exports=PatientStory;