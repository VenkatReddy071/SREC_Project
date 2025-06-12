
import React, { useState, useEffect } from 'react';
import OfferTable from '../Dashboard/Hospital/Offers/OfferTable';
import OfferFormModal from '../Dashboard/Hospital/Offers/OfferFormModal'
import { dummyOffers } from '../data/dummyOffers';
import { dummyDoctors, dummyDepartments, dummyServices } from '../data/dummyEntity';

const OffersPage = () => {
  const [offers, setOffers] = useState(dummyOffers);
  const [filteredOffers, setFilteredOffers] = useState(dummyOffers);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null); // For editing
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let currentOffers = [...offers];

    if (searchTerm) {
      currentOffers = currentOffers.filter(offer =>
        offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredOffers(currentOffers);
  }, [offers, searchTerm]);

  const handleCreateNewOffer = () => {
    setSelectedOffer(null); // Clear selected offer for new creation
    setIsFormModalOpen(true);
  };

  const handleEditOffer = (offer) => {
    setSelectedOffer(offer);
    setIsFormModalOpen(true);
  };

  const handleSaveOffer = (offerData, saveAsDraft = false) => {
    if (selectedOffer) {
      // Edit existing offer
      setOffers(prevOffers =>
        prevOffers.map(offer =>
          offer._id === selectedOffer._id
            ? { ...offerData, status: saveAsDraft ? "Draft" : "Active" } // Update status based on button
            : offer
        )
      );
    } else {
      // Create new offer
      const newOffer = {
        ...offerData,
        _id: `off${Date.now()}`, // Simple unique ID
        status: saveAsDraft ? "Draft" : "Active", // Set status based on button
        imageUrl: offerData.imageUrl || `https://via.placeholder.com/400x200?text=${offerData.title.split(' ')[0]}`, // Placeholder if no image
      };
      setOffers(prevOffers => [...prevOffers, newOffer]);
    }
    setIsFormModalOpen(false);
    setSelectedOffer(null);
  };

  const handleToggleStatus = (offerId) => {
    setOffers(prevOffers =>
      prevOffers.map(offer =>
        offer._id === offerId
          ? { ...offer, status: offer.status === "Active" ? "Inactive" : "Active" }
          : offer
      )
    );
  };

  const handleDeleteOffer = (offerId) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      setOffers(prevOffers => prevOffers.filter(offer => offer._id !== offerId));
    }
  };

  return (
    <div className=" bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Promotional Offers</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search offers by title, description, or category..."
            className="p-2 border border-gray-300 rounded-md w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleCreateNewOffer}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            + Create New Offer
          </button>
        </div>
      </div>

      <OfferTable
        offers={filteredOffers}
        onEdit={handleEditOffer}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDeleteOffer}
      />

      {isFormModalOpen && (
        <OfferFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={handleSaveOffer}
          initialData={selectedOffer}
          doctors={dummyDoctors}
          departments={dummyDepartments}
          services={dummyServices}
        />
      )}
    </div>
  );
};

export default OffersPage;