'use client';

import React from 'react'
import { Users, UserPlus, User, Settings } from 'lucide-react'

function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div className="w-16 bg-gray-800 h-full flex flex-col items-center py-4">
      <div className="mb-8">
        <img src="/logo.png" alt="Logo" className="w-10 h-10" />
      </div>
      <button 
        className={`text-white mb-4 p-2 rounded-full hover:bg-gray-700 ${activeTab === 'users' ? 'bg-gray-700' : ''}`}
        onClick={() => setActiveTab('users')}
      >
        <Users size={24} />
      </button>
      <button 
        className={`text-white mb-4 p-2 rounded-full hover:bg-gray-700 ${activeTab === 'groups' ? 'bg-gray-700' : ''}`}
        onClick={() => setActiveTab('groups')}
      >
        <UserPlus size={24} />
      </button>
      <button 
        className={`text-white p-2 rounded-full hover:bg-gray-700 ${activeTab === 'profile' ? 'bg-gray-700' : ''}`}
        onClick={() => setActiveTab('profile')}
      >
        <User size={24} />
      </button>
    </div>
  )
}

export default Sidebar
