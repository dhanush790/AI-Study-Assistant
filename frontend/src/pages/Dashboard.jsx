import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
    BookOpen, MessageSquare, FileText, UploadCloud, FileEdit, Settings, 
    Search, Bell, User as UserIcon, ArrowRight, File, MoreVertical,
    Clock, Plus, FileQuestion, CheckCircle, Upload
} from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        total_materials: 0,
        total_conversations: 0,
        questions_asked: 0
    });
    const [recentDocs, setRecentDocs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsRes = await api.get('auth/stats/');
                setStats(statsRes.data);
                
                const docsRes = await api.get('documents/');
                // Get top 4 recent documents
                setRecentDocs(docsRes.data.slice(0, 4));
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            }
        };
        fetchData();
    }, []);

    const formatSize = (bytes) => {
        if (!bytes) return '0 MB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div className="flex h-screen bg-[#f3f4f6] font-sans overflow-hidden">
            
            {/* Left Sidebar */}
            <aside className="w-64 bg-[#1e293b] text-white flex flex-col justify-between hidden md:flex h-full">
                <div>
                    <div className="p-6 flex items-center space-x-3">
                        <div className="bg-blue-500 p-2 rounded-lg">
                            <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold leading-tight">AI Study<br/>Assistant</span>
                    </div>
                    
                    <nav className="mt-6 px-4 space-y-2">
                        <Link to="/dashboard" className="flex items-center space-x-3 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-sm transition-colors">
                            <BookOpen className="h-5 w-5" />
                            <span>Dashboard</span>
                        </Link>
                        <Link to="/documents" className="flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg font-medium transition-colors">
                            <MessageSquare className="h-5 w-5" />
                            <span>Chat</span>
                        </Link>
                        <Link to="/documents" className="flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg font-medium transition-colors">
                            <FileText className="h-5 w-5" />
                            <span>My Documents</span>
                        </Link>
                        <button onClick={() => navigate('/documents')} className="w-full flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg font-medium transition-colors">
                            <UploadCloud className="h-5 w-5" />
                            <span>Upload Documents</span>
                        </button>
                        <Link to="/documents" className="flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg font-medium transition-colors">
                            <FileEdit className="h-5 w-5" />
                            <span>Notes & Summary</span>
                        </Link>
                        <button className="w-full flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg font-medium transition-colors">
                            <Settings className="h-5 w-5" />
                            <span>Settings</span>
                        </button>
                    </nav>
                </div>
                
                <div className="p-4 mb-4">
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-800 rounded-xl cursor-pointer hover:bg-slate-700 transition-colors" onClick={logout}>
                        <div className="flex items-center space-x-3">
                            <div className="h-9 w-9 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white shadow-inner">
                                {(user?.first_name || user?.username || 'U')[0].toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold truncate w-24">{user?.first_name || user?.username}</span>
                                <span className="text-xs text-slate-400">Student</span>
                            </div>
                        </div>
                        <LogOutIcon className="h-4 w-4 text-slate-400 hover:text-red-400" />
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                
                {/* Top Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 border-b border-gray-100 z-10 sticky top-0">
                    <div className="relative w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input 
                            type="text" 
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all shadow-sm" 
                            placeholder="Ask anything about your documents..." 
                        />
                    </div>
                    <div className="flex items-center space-x-5">
                        <button className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors">
                            <Bell className="h-6 w-6" />
                            <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
                        </button>
                        <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white shadow-sm cursor-pointer hover:bg-slate-600 transition-colors">
                            {(user?.first_name || user?.username || 'U')[0].toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Main Scrollable Area */}
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="flex flex-col xl:flex-row gap-8 max-w-screen-2xl mx-auto">
                        
                        {/* Left Column (Main) */}
                        <div className="flex-1 space-y-8 min-w-0">
                            
                            {/* Hero Banner */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-3xl p-8 flex items-center justify-between shadow-sm border border-blue-100 relative overflow-hidden">
                                <div className="max-w-xl z-10">
                                    <h2 className="text-3xl font-bold text-slate-800 mb-3 tracking-tight">
                                        Welcome back, {user?.first_name || user?.username}! <span className="inline-block hover:animate-wiggle cursor-default">👋</span>
                                    </h2>
                                    <p className="text-slate-600 mb-6 text-lg leading-relaxed">
                                        Your AI-powered study companion. Upload documents, ask questions, get summaries and learn faster.
                                    </p>
                                    <Link to="/documents" className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 hover:shadow-md transition-all active:scale-95">
                                        Start Chatting
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </div>
                                <div className="hidden lg:block z-10 absolute right-8 bottom-0 w-64 h-64 opacity-90 transform translate-y-4">
                                   {/* Placeholder for Robot Image - Using CSS art/emoji fallback */}
                                   <div className="w-full h-full flex items-center justify-center text-[120px]">
                                      🤖
                                   </div>
                                </div>
                                {/* Decorative elements */}
                                <div className="absolute top-4 right-20 w-16 h-16 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                                <div className="absolute top-10 right-40 w-16 h-16 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                            </div>

                            {/* Stats Row */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                                <StatCard 
                                    icon={<File className="h-6 w-6 text-purple-500" />} 
                                    value={stats.total_materials} 
                                    label="Total Documents" 
                                    subtext="Manage your files"
                                    bg="bg-purple-100"
                                />
                                <StatCard 
                                    icon={<MessageSquare className="h-6 w-6 text-emerald-500" />} 
                                    value={stats.questions_asked} 
                                    label="Questions Asked" 
                                    subtext="Get instant answers"
                                    bg="bg-emerald-100"
                                />
                                <StatCard 
                                    icon={<FileText className="h-6 w-6 text-orange-500" />} 
                                    value={stats.total_materials > 0 ? Math.floor(stats.total_materials * 0.8) : 0} 
                                    label="Summaries Generated" 
                                    subtext="Save your time"
                                    bg="bg-orange-100"
                                />
                                <StatCard 
                                    icon={<Clock className="h-6 w-6 text-blue-500" />} 
                                    value={`${stats.total_materials > 0 ? (stats.total_materials * 1.5).toFixed(1) : 0} hrs`} 
                                    label="Time Saved" 
                                    subtext="Learn more efficiently"
                                    bg="bg-blue-100"
                                />
                            </div>

                            {/* Recent Documents Table */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                                    <h3 className="text-lg font-bold text-slate-800 flex items-center">
                                        <FileText className="h-5 w-5 mr-2 text-slate-400" />
                                        Recent Documents
                                    </h3>
                                    <Link to="/documents" className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center transition-colors">
                                        View All <ArrowRight className="h-4 w-4 ml-1" />
                                    </Link>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-100">
                                        <thead className="bg-gray-50/50">
                                            <tr>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Size</th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Uploaded On</th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                                <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-50">
                                            {recentDocs.length > 0 ? recentDocs.map((doc) => (
                                                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className={`flex-shrink-0 h-8 w-8 rounded flex items-center justify-center ${doc.file_type === 'pdf' ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-500'}`}>
                                                                <FileText className="h-4 w-4" />
                                                            </div>
                                                            <div className="ml-3">
                                                                <Link to={`/documents/${doc.id}`} className="text-sm font-medium text-slate-700 hover:text-blue-600 truncate max-w-[200px] block transition-colors">
                                                                    {doc.title}
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2.5 py-1 inline-flex text-xs leading-4 font-semibold rounded-md ${doc.file_type === 'pdf' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'} uppercase`}>
                                                            {doc.file_type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatSize(doc.file_size)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(doc.uploaded_at)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2.5 py-1 inline-flex text-xs leading-4 font-semibold rounded-md bg-emerald-50 text-emerald-700 flex items-center">
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                            Processed
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                        <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <MoreVertical className="h-5 w-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <UploadCloud className="h-10 w-10 text-gray-300 mb-3" />
                                                            <p>No documents uploaded yet.</p>
                                                            <Link to="/documents" className="mt-2 text-blue-600 hover:underline">Upload your first document</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>



                        </div>

                        {/* Right Column (Sidebar) */}
                        <div className="w-full xl:w-80 space-y-8 min-w-0">
                            
                            {/* Quick Actions */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center mb-4">
                                    <svg className="h-5 w-5 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    Quick Actions
                                </h3>
                                <div className="space-y-3">
                                    <button onClick={() => navigate('/documents')} className="w-full flex items-center space-x-3 px-4 py-3.5 bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 hover:shadow-md transition-all active:scale-95 font-medium">
                                        <UploadCloud className="h-5 w-5" />
                                        <span>Upload Documents</span>
                                    </button>
                                    <button onClick={() => navigate('/documents')} className="w-full flex items-center space-x-3 px-4 py-3.5 bg-slate-50 text-slate-700 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100 font-medium">
                                        <MessageSquare className="h-5 w-5 text-slate-500" />
                                        <span>Start a New Chat</span>
                                    </button>
                                    <Link to="/documents" className="w-full flex items-center space-x-3 px-4 py-3.5 bg-slate-50 text-slate-700 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100 font-medium">
                                        <FileText className="h-5 w-5 text-slate-500" />
                                        <span>View My Documents</span>
                                    </Link>
                                    <button onClick={() => navigate('/documents')} className="w-full flex items-center space-x-3 px-4 py-3.5 bg-slate-50 text-slate-700 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100 font-medium">
                                        <FileEdit className="h-5 w-5 text-slate-500" />
                                        <span>Generate Summary</span>
                                    </button>
                                </div>
                            </div>

                            {/* Supported File Types */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center mb-5">
                                    <File className="h-5 w-5 mr-2 text-slate-400" />
                                    Supported File Types
                                </h3>
                                <div className="flex justify-between items-center mb-6 px-2">
                                    <div className="flex flex-col items-center">
                                        <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500 mb-2 shadow-sm border border-red-100">
                                            <span className="font-bold text-xs">PDF</span>
                                        </div>
                                        <span className="text-xs font-semibold text-slate-500">PDF</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-2 shadow-sm border border-blue-100">
                                            <span className="font-bold text-xs">W</span>
                                        </div>
                                        <span className="text-xs font-semibold text-slate-500">DOCX</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 mb-2 shadow-sm border border-slate-200">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-500">TXT</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 mb-2 shadow-sm border border-orange-100">
                                            <span className="font-bold text-xs">P</span>
                                        </div>
                                        <span className="text-xs font-semibold text-slate-500">PPTX</span>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500 text-center">
                                    Upload lecture notes, research papers, textbooks and more.
                                </p>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center mb-6">
                                    <svg className="h-5 w-5 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                    Recent Activity
                                </h3>
                                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent pl-4">
                                    
                                    <div className="relative flex items-start space-x-3 group">
                                        <div className="absolute left-[-1.3rem] top-1 h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-white"></div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">Processed "Machine Learning Notes.pdf"</p>
                                            <span className="text-xs text-slate-400">2 hours ago</span>
                                        </div>
                                    </div>
                                    
                                    <div className="relative flex items-start space-x-3 group">
                                        <div className="absolute left-[-1.3rem] top-1 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-white"></div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">Generated summary for "DBMS.pdf"</p>
                                            <span className="text-xs text-slate-400">4 hours ago</span>
                                        </div>
                                    </div>
                                    
                                    <div className="relative flex items-start space-x-3 group">
                                        <div className="absolute left-[-1.3rem] top-1 h-3 w-3 rounded-full bg-purple-500 ring-4 ring-white"></div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">Asked a question about "Operating Systems"</p>
                                            <span className="text-xs text-slate-400">5 hours ago</span>
                                        </div>
                                    </div>
                                    
                                    <div className="relative flex items-start space-x-3 group">
                                        <div className="absolute left-[-1.3rem] top-1 h-3 w-3 rounded-full bg-red-500 ring-4 ring-white"></div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">Uploaded "Computer Networks.pdf"</p>
                                            <span className="text-xs text-slate-400">1 day ago</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

// Helper component for Stat Cards
const StatCard = ({ icon, value, label, subtext, bg }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="flex flex-col">
            <div className={`h-12 w-12 rounded-xl ${bg} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                {icon}
            </div>
            <div className="flex items-end justify-between">
                <div>
                    <h4 className="text-3xl font-extrabold text-slate-800 tracking-tight">{value}</h4>
                    <p className="text-sm font-medium text-slate-500 mt-1 flex items-center">
                        {label} 
                        <svg className="w-3 h-3 ml-1 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                    </p>
                </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-50">
                <span className="text-xs text-slate-400 font-medium">{subtext}</span>
            </div>
        </div>
    </div>
);

// Fallback icon for logout
const LogOutIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

export default Dashboard;
