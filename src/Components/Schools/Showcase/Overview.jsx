import {Map} from "../../../Pages/Map"
export const EducationalInstituteOverview = ({ institute, activityIconMap }) => {
    if (!institute) {
        return <div className="text-center text-gray-600 p-8">No institute data available.</div>;
    }
    
    const {
        name,
        institutionType,
        image,
        gallery,
        location,
        rating,
        info,
        foundationYear,
        mobileNumber,
        hostel,
        awards,
        schoolDetails,
        collegeDetails,
        coordinates
    } = institute;

    const activities = institutionType === 'School'
        ? schoolDetails?.extraCurricularActivities
        : collegeDetails?.extraCurricularActivities;

    return (
        <div className="bg-white rounded-xl  overflow-hidden border border-gray-200 px-20">
            <div className="relative h-64 sm:h-80 w-full overflow-hidden">
                <img
                    src={image}
                    alt={`${name} main image`}
                    className="object-cover w-full h-full"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x400/CCCCCC/666666?text=Image+Not+Found"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                        {name}
                    </h2>
                </div>
                <span className="absolute top-4 right-4 bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md">
                    {institutionType}
                </span>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-gray-700">
                    <p className="flex items-center">
                        <svg className="w-5 h-5 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">Location:</span> {location}
                    </p>
                    <p className="flex items-center">
                        <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.929 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-semibold">Rating:</span> {rating} / 5
                    </p>
                    <p className="flex items-center">
                        <svg className="w-5 h-5 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">Established:</span> {foundationYear}
                    </p>
                    <p className="flex items-center">
                        <svg className="w-5 h-5 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">Contact:</span> {mobileNumber}
                    </p>
                    <p className="flex items-center">
                        <svg className="w-5 h-5 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 012 2v4a2 2 0 002 2v-4a2 2 0 00-2-2H6V6a2 2 0 00-2-2z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">Hostel:</span> {hostel ? 'Available' : 'Not Available'}
                    </p>
                </div>

                {info && (
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 border-b pb-2">About Us</h3>
                        <p className="text-gray-700 leading-relaxed">{info}</p>
                    </div>
                )}

                {awards && awards.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 border-b pb-2">Awards & Recognition</h3>
                        <ul className="list-none text-gray-700 space-y-2">
                            {awards.map((award, index) => (
                                <li key={index} className="flex items-center">
                                    {award.awardImage && (
                                        <img
                                            src={award.awardImage}
                                            alt={`${award.name} icon`}
                                            className="w-8 h-8 rounded-full mr-3 object-cover shadow-sm"
                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/32x32/9CA3AF/FFFFFF?text=🏆"; }}
                                        />
                                    )}
                                    <span className="font-semibold">{award.name}</span> ({award.year})
                                    {award.description && <span className="ml-2 text-gray-600 text-sm"> - {award.description}</span>}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {(institutionType === "School" && schoolDetails) || (institutionType === "College" && collegeDetails) ? (
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 border-b pb-2">
                            {institutionType === "School" ? "School Specifics" : "College Specifics"}
                        </h3>
                        <div className="text-gray-700 space-y-2">
                            {institutionType === "School" && schoolDetails && (
                                <>
                                    <p><span className="font-semibold">Board:</span> {schoolDetails.board}</p>
                                    {schoolDetails.specialTraining && <p><span className="font-semibold">Special Training:</span> {schoolDetails.specialTraining}</p>}
                                    {schoolDetails.transportation && <p><span className="font-semibold">Transportation:</span> {schoolDetails.transportation}</p>}
                                </>
                            )}
                            {institutionType === "College" && collegeDetails && (
                                <>
                                    {collegeDetails.specializations && collegeDetails.specializations.length > 0 && (
                                        <p>
                                            <span className="font-semibold">Specializations:</span> {collegeDetails.specializations.join(", ")}
                                        </p>
                                    )}
                                    <p><span className="font-semibold">Affiliation Type:</span> {collegeDetails.affiliationType}</p>
                                    {collegeDetails.courseTypes && collegeDetails.courseTypes.length > 0 && (
                                        <p>
                                            <span className="font-semibold">Course Types:</span> {collegeDetails.courseTypes.join(", ")}
                                        </p>
                                    )}
                                    {collegeDetails.transportation && <p><span className="font-semibold">Transportation:</span> {collegeDetails.transportation}</p>}
                                </>
                            )}
                        </div>
                    </div>
                ) : null}


                {activities && activities.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 border-b pb-2">Extra-Curricular Activities</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {activities.map((activity, index) => (
                                <div key={index} className="flex flex-col items-center p-3 bg-blue-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <img
                                        src={activityIconMap[activity] || activityIconMap["default"]}
                                        alt={`${activity} icon`}
                                        className="w-12 h-12 rounded-full object-cover mb-2"
                                        onError={(e) => { e.target.onerror = null; e.target.src = activityIconMap["default"]; }}
                                    />
                                    <span className="text-sm font-medium text-center text-gray-800">{activity}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                {gallery && gallery.length > 0 && (
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Gallery</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {gallery.map((imgSrc, index) => (
                                <div key={index} className="rounded-lg overflow-hidden shadow-md aspect-w-4 aspect-h-3">
                                    <img
                                        src={imgSrc}
                                        alt={`Gallery image ${index + 1}`}
                                        className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/CCCCCC/666666?text=Image+Not+Found"; }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <Map lat={coordinates?.latitude||15.478569} long={coordinates?.longitude||15.478569} address={location}/>
            </div>
        </div>
    );
};