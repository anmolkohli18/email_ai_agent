'use client';

import { useState } from 'react';
import { Contact } from '@/types/contact';
import { useRouter } from 'next/navigation';

interface ContactTableProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
  loading?: boolean;
}

type SortField = 'firstName' | 'lastName' | 'email' | 'company' | 'createdAt';
type SortOrder = 'asc' | 'desc';

export default function ContactTable({
  contacts,
  onEdit,
  onDelete,
  loading = false,
}: ContactTableProps) {
  const router = useRouter();
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedContacts = [...contacts].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    // Handle undefined values
    if (aValue === undefined) aValue = '';
    if (bValue === undefined) bValue = '';

    // Convert to lowercase for string comparison
    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
    if (typeof bValue === 'string') bValue = bValue.toLowerCase();

    // Handle date comparison
    if (sortField === 'createdAt') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    return sortOrder === 'asc' ? (
      <svg className="w-4 h-4 text-[#FFC700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-[#FFC700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-16 h-16 border-4 border-[#FFC700] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#2A2A2A]">
            <th
              className="text-left p-4 text-neutral-400 font-semibold cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('firstName')}
            >
              <div className="flex items-center gap-2">
                Name
                <SortIcon field="firstName" />
              </div>
            </th>
            <th
              className="text-left p-4 text-neutral-400 font-semibold cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('email')}
            >
              <div className="flex items-center gap-2">
                Email
                <SortIcon field="email" />
              </div>
            </th>
            <th
              className="text-left p-4 text-neutral-400 font-semibold cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('company')}
            >
              <div className="flex items-center gap-2">
                Company
                <SortIcon field="company" />
              </div>
            </th>
            <th
              className="text-left p-4 text-neutral-400 font-semibold cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('createdAt')}
            >
              <div className="flex items-center gap-2">
                Date Added
                <SortIcon field="createdAt" />
              </div>
            </th>
            <th className="text-right p-4 text-neutral-400 font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedContacts.map((contact) => (
            <tr
              key={contact.id}
              className="border-b border-[#2A2A2A] hover:bg-[#232323] transition-colors cursor-pointer"
              onClick={() => router.push(`/dashboard/contacts/${contact.id}`)}
            >
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FFC700]/10 rounded-full flex items-center justify-center">
                    <span className="text-[#FFC700] font-semibold">
                      {contact.firstName[0]}{contact.lastName[0]}
                    </span>
                  </div>
                  <span className="text-white font-medium">
                    {contact.firstName} {contact.lastName}
                  </span>
                </div>
              </td>
              <td className="p-4 text-neutral-400">{contact.email}</td>
              <td className="p-4 text-neutral-400">{contact.company || '-'}</td>
              <td className="p-4 text-neutral-400">
                {new Date(contact.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </td>
              <td className="p-4">
                <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onEdit(contact)}
                    className="p-2 text-neutral-400 hover:text-[#FFC700] hover:bg-[#FFC700]/10 rounded-lg transition-all duration-200"
                    title="Edit contact"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(contact)}
                    className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200"
                    title="Delete contact"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
