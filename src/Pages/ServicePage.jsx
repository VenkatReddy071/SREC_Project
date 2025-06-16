// src/pages/ServicesPage.jsx
import axios from "axios";
import { useEffect, useState } from 'react';
import ConfirmationModal from '../Dashboard/Hospital/Services/ConfirmationModal'; // Reusing your existing modal, adjust path if needed
import ServiceForm from '../Dashboard/Hospital/Services/ServiceForm'; // Adjust path if needed
import ServiceList from '../Dashboard/Hospital/Services/serviceList'; // Adjust path if needed
const ServicesPage = () => {

  const [hospitalData, setHospitalData] = useState([]);

  const [editingServiceName, setEditingServiceName] = useState(null);
  const [editingServiceIndex, setEditingServiceIndex] = useState(null);

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalAction, setModalAction] = useState(null);
  const handleSaveService = (newServiceName, originalIndex) => {
    setHospitalData(prevHospitalData => {
      const updatedServices = [...prevHospitalData.services];
      if (originalIndex !== null && originalIndex !== undefined) {
        const original=updatedServices[originalIndex];
        updatedServices[originalIndex] = newServiceName;
          const token=localStorage.getItem("dashboard");
        const url=`${import.meta.env.VITE_SERVER_URL}/api/hospitals/services/:serviceName`
        axios.put(url,{serviceName:newServiceName,original},{headers:{'Authorization':`Bearer ${token}`},withCredentials:true})
        .then((response)=>{
            setModalMessage(`Service "${newServiceName}" updated successfully!`);
        })
        
        .catch((error)=>{
          setModalMessage(`Service "${newServiceName}" added Failed!`);
        })
      } else {
        updatedServices.push(newServiceName);
        const token=localStorage.getItem("dashboard");
        const url=`${import.meta.env.VITE_SERVER_URL}/api/hospitals/:hospitalId/services`
        axios.post(url,{serviceName:newServiceName},{headers:{'Authorization':`Bearer ${token}`},withCredentials:true})
        .then((response)=>{
          setModalMessage(`Service "${newServiceName}" added successfully!`);
        })
        .catch((error)=>{
          setModalMessage(`Service "${newServiceName}" added Failed!`);
        })
      }
      return { ...prevHospitalData, services: updatedServices };
    });

    setEditingServiceName(null);
    setEditingServiceIndex(null);
    setModalAction(null);
    setIsConfirmationModalOpen(true);
  };
  const handleEditService = (serviceName, index) => {
    setEditingServiceName(serviceName);
    setEditingServiceIndex(index);
  };
  useEffect(()=>{
    const fetchData=()=>{
      const url=`${import.meta.env.VITE_SERVER_URL}/api/hospitals/services/list`;
      const token=localStorage.getItem("dashboard");
      axios.get(url,{headers:{'Authorization':`Bearer ${token}`},withCredentials:true})
      .then((response)=>{
        setHospitalData(response.data);
      })
      .catch((error)=>{
        console.log(error);
      })
    }
    fetchData();
  },[])
  const handleDeleteService = (indexToDelete) => {
    const nameToDelete = hospitalData?.services[indexToDelete];
    setModalMessage(`Are you sure you want to delete the service "${nameToDelete}"? This action cannot be undone.`);
    setModalAction(() => () => {
      setHospitalData(prevHospitalData => {
        const updatedServices = prevHospitalData?.services?.filter((_, i) => i !== indexToDelete);
        return { ...prevHospitalData,services: updatedServices };
      });
      const token=localStorage.getItem("dashboard");
        const url=`${import.meta.env.VITE_SERVER_URL}/api/hospitals/services/:serviceName`
        axios.put(url,{serviceName:nameToDelete},{headers:{'Authorization':`Bearer ${token}`},withCredentials:true})
        .then((response)=>{
        setModalMessage("Service deleted successfully!");     
          setModalAction(null);
      setIsConfirmationModalOpen(true);  
        })
        
        .catch((error)=>{
          setModalMessage(`Service "${nameToDelete}" added Failed!`);
        })
    });
    setIsConfirmationModalOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingServiceName(null);
    setEditingServiceIndex(null);
  };

  const handleCloseConfirmationModal = () => {
      setIsConfirmationModalOpen(false);
      setModalAction(null); // Ensure action is cleared
  };

useEffect(() => {
          window.scrollTo(0, 0);
}, []);
  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen font-inter">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Hospital Services Management</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/3 max-h-[85vh] overflow-y-auto bg-white p-6 rounded-lg shadow-md"> {/* Added bg and padding for form */}
          <ServiceForm
            initialService={editingServiceName}
            initialIndex={editingServiceIndex}
            onSave={handleSaveService}
            onCancel={handleCancelEdit}
          />
        </div>

        {/* Right Panel: Services List */}
        <div className="lg:w-2/3 bg-white p-6 rounded-lg shadow-md max-h-[85vh] overflow-y-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Current Services</h2>
          <ServiceList
            services={hospitalData?.services}
            onEdit={handleEditService}
            onDelete={handleDeleteService}
          />
        </div>
      </div>

      {/* Confirmation/Notification Modal */}
      {isConfirmationModalOpen && (
        <ConfirmationModal
          message={modalMessage}
          onConfirm={() => {
            if (modalAction) {
              modalAction(); // Execute the stored action
            } else {
                // If there's no action, it's just an info message. Close on confirm.
                handleCloseConfirmationModal();
            }
          }}
          onCancel={handleCloseConfirmationModal} // Allow canceling info messages too
          showCancelButton={!!modalAction} // Show cancel button only if there's an action to confirm
        />
      )}
    </div>
  );
};

export default ServicesPage;