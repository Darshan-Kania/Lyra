// Top Contacts Component
import React from 'react';

const ContactCard = ({ contact }) => (
  <div className="p-4 border border-gray-100 rounded-lg">
    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
      <span className="text-indigo-700 font-semibold">
        {contact.name ? contact.name[0].toUpperCase() : '?'}
      </span>
    </div>
    <div className="text-center">
      <p className="font-medium text-sm truncate" title={contact.name}>
        {contact.name || 'Unknown'}
      </p>
      <p className="text-xs text-gray-500 mb-1 truncate" title={contact.email}>
        {contact.email}
      </p>
      <p className="text-xs text-gray-500">
        {contact.count} email{contact.count !== 1 ? 's' : ''}
      </p>
    </div>
  </div>
);

const TopContacts = ({ contacts, isLoading }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Top Contacts</h2>
        <button className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors">
          View all
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading contacts...</div>
        </div>
      ) : contacts.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">No contacts found</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {contacts.map((contact, index) => (
            <ContactCard key={contact.email || index} contact={contact} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TopContacts;
