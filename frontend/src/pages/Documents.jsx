import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, FileText, Upload as UploadIcon, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import UploadModal from '../components/UploadModal';
import api from '../services/api';

const Documents = () => {
    const { user, logout } = useContext(AuthContext);
    const [documents, setDocuments] = useState([]);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchDocuments = async () => {
        try {
            const response = await api.get('documents/');
            setDocuments(response.data);
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this document?')) {
            try {
                await api.delete(`documents/${id}/`);
                fetchDocuments();
            } catch (error) {
                console.error('Error deleting document:', error);
                alert('Failed to delete document.');
            }
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'processing': return 'bg-yellow-100 text-yellow-800';
            case 'failed': return 'bg-red-100 text-red-800';
            default: return 'bg-blue-100 text-blue-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center space-x-8">
                            <h1 className="text-xl font-bold text-blue-600">AI Study Assistant</h1>
                            <div className="hidden sm:flex space-x-4">
                                <Link to="/dashboard" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                                <Link to="/documents" className="text-blue-600 bg-blue-50 px-3 py-2 rounded-md text-sm font-medium">Documents</Link>
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
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">My Study Materials</h2>
                    <button 
                        onClick={() => setIsUploadModalOpen(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        <UploadIcon className="h-4 w-4 mr-2" />
                        Upload
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12">Loading documents...</div>
                ) : documents.length === 0 ? (
                    <div className="bg-white shadow rounded-lg p-12 text-center">
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by uploading a new study material.</p>
                        <div className="mt-6">
                            <button onClick={() => setIsUploadModalOpen(true)} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                                <UploadIcon className="h-4 w-4 mr-2" />
                                Upload Material
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {documents.map((doc) => (
                            <div key={doc.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 flex flex-col">
                                <div className="p-5 flex-grow">
                                    <div className="flex items-center mb-4">
                                        <FileText className="h-8 w-8 text-blue-500 mr-3" />
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 truncate" title={doc.title}>
                                            {doc.title}
                                        </h3>
                                    </div>
                                    <div className="mt-4 flex flex-col space-y-2 text-sm text-gray-500">
                                        <div className="flex justify-between">
                                            <span>Type:</span>
                                            <span className="font-medium uppercase">{doc.file_type}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Size:</span>
                                            <span className="font-medium">{(doc.file_size / (1024 * 1024)).toFixed(2)} MB</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span>Status:</span>
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusColor(doc.processing_status)}`}>
                                                {doc.processing_status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Uploaded:</span>
                                            <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex justify-end space-x-3">
                                    <Link to={`/documents/${doc.id}`} className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                                        <Eye className="h-4 w-4 mr-1 text-gray-500" />
                                        View
                                    </Link>
                                    <button onClick={() => handleDelete(doc.id)} className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50">
                                        <Trash2 className="h-4 w-4 mr-1 text-red-500" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <UploadModal 
                isOpen={isUploadModalOpen} 
                onClose={() => setIsUploadModalOpen(false)} 
                onUploadSuccess={fetchDocuments} 
            />
        </div>
    );
};

export default Documents;
