interface EmptyContactsStateProps {
  onAddContact: () => void;
}

export default function EmptyContactsState({ onAddContact }: EmptyContactsStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <div className="w-24 h-24 bg-[#FFC700]/10 rounded-3xl flex items-center justify-center mb-6">
        <svg
          className="w-12 h-12 text-[#FFC700]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>
      
      <h2 className="text-3xl font-bold text-white mb-3 text-center">
        No Contacts Yet
      </h2>
      
      <p className="text-neutral-400 text-center max-w-md mb-8">
        Start building your contact list to create personalized email campaigns. Add contacts
        individually or import them in bulk later.
      </p>
      
      <button
        onClick={onAddContact}
        className="px-8 py-4 bg-[#FFC700] hover:bg-[#FFD700] text-black font-bold rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-[#FFC700]/20"
      >
        Add Your First Contact
      </button>
    </div>
  );
}
