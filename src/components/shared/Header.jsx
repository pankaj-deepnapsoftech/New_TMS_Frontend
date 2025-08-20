import React from 'react'
import {  Bell, Search, Plus } from 'lucide-react';

const Header = () => {
    return (
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200">
            <div className="max-w-full px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-xl text-sm font-medium shadow hover:bg-indigo-500">
                        <Plus className="w-4 h-4" />
                        New Task
                    </button>
                    <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-xl">
                        <Search className="w-4 h-4 text-gray-500" />
                        <input placeholder="Search tasks, projects, people…" className="bg-transparent outline-none ml-2 text-sm w-64" />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="relative p-2 rounded-lg hover:bg-gray-100">
                        <Bell className="w-5 h-5 text-gray-600" />
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img src="https://i.pravatar.cc/64?img=15" alt="avatar" />
                    </div>
                </div>
            </div>

            
        </header>
    )
}

export default Header