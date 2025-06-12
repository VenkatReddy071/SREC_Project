// src/components/OfferTable.jsx
import React from 'react';

const OfferTable = ({ offers, onEdit, onToggleStatus, onDelete }) => {

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      case 'Draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (offer) => {
    if (offer.discountedPrice) {
      return `$${offer.discountedPrice.toFixed(2)} ${offer.originalPrice ? `(Orig: $${offer.originalPrice.toFixed(2)})` : ''}`;
    }
    if (offer.percentageDiscount) {
      return `${offer.percentageDiscount}% Off`;
    }
    return 'N/A';
  };

  return (
    // RE-ADDED: overflow-x-auto class here! This is the primary fix.
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className=" divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Offer Name/Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Discount/Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Validity Period
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Target Audience
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {offers.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                No offers found.
              </td>
            </tr>
          ) : (
            offers.map((offer) => (
              <tr key={offer._id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {/* Added a div to control title overflow with ellipsis */}
                  <div className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {offer.title}
                  </div>
                </td>
                {/* Description: Remains with break-words and max-w-xs */}
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs break-words">
                  {offer.shortDescription || offer.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatPrice(offer)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(offer.validityStartDate).toLocaleDateString()} -{' '}
                  {new Date(offer.validityEndDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(offer.status)}`}>
                    {offer.status}
                  </span>
                </td>
                {/* Target Audience: Remains with break-words and max-w-xs */}
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs break-words">
                  {offer.targetAudience.join(', ') || 'All'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex flex-col space-y-2"> {/* Use flex-col for vertical stacking */}
                    <button
                      onClick={() => onEdit(offer)}
                      className="text-indigo-600 hover:text-indigo-900 text-left"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onToggleStatus(offer._id)}
                      className={`${offer.status === 'Active' ? 'text-red-600' : 'text-green-600'} hover:text-red-900 hover:text-green-900 text-left`}
                    >
                      {offer.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => onDelete(offer._id)}
                      className="text-gray-600 hover:text-gray-900 text-left"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OfferTable;