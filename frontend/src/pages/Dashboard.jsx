import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, FileText, Search, MessageSquare, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center space-x-8">
                            <h1 className="text-xl font-bold text-blue-600">AI Study Assistant</h1>
                            <div className="hidden sm:flex space-x-4">
                                <Link to="/dashboard" className="text-blue-600 bg-blue-50 px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                                <Link to="/documents" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Documents</Link>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700 text-sm hidden sm:inline-block">
                                {user?.first_name || user?.username}
                            </span>
                            <button onClick={logout} className="text-gray-500 hover:text-red-600">
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user?.first_name || 'Student'}!</h2>
                    <p className="mt-1 text-sm text-gray-500">Here's an overview of your study materials and activities.</p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
                        <div className="p-5 flex items-center">
                            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Materials</dt>
                                    <dd className="text-lg font-semibold text-gray-900">0</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
                        <div className="p-5 flex items-center">
                            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                <MessageSquare className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Conversations</dt>
                                    <dd className="text-lg font-semibold text-gray-900">0</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
                        <div className="p-5 flex items-center">
                            <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                                <Search className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Questions Asked</dt>
                                    <dd className="text-lg font-semibold text-gray-900">0</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg mb-8">
                    <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
                    </div>
                    <div className="px-4 py-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <Link to="/documents" className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-6 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <Plus className="mx-auto h-8 w-8 text-gray-400" />
                            <span className="mt-2 block text-sm font-medium text-gray-900">Upload Notes</span>
                        </Link>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default Dashboard;
