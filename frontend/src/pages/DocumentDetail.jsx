import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Trash2 } from 'lucide-react';
import api from '../services/api';
import Chat from '../components/Chat';

const DocumentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await api.get(`documents/${id}/`);
                setDocument(response.data);
            } catch (err) {
                setError('Failed to load document details.');
            } finally {
                setLoading(false);
            }
        };
        fetchDocument();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this document?')) {
            try {
                await api.delete(`documents/${id}/`);
                navigate('/documents');
            } catch (error) {
                alert('Failed to delete document.');
            }
        }
    };

    if (loading) return <div className="min-h-screen p-8 text-center">Loading document details...</div>;
    if (error) return <div className="min-h-screen p-8 text-center text-red-500">{error}</div>;
    if (!document) return <div className="min-h-screen p-8 text-center">Document not found.</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <nav className="bg-white shadow-sm border-b mb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center">
                        <Link to="/documents" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Documents
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <div className="flex items-center">
                            <FileText className="h-8 w-8 text-blue-500 mr-3" />
                            <h3 className="text-lg leading-6 font-medium text-gray-900">{document.title}</h3>
                        </div>
                        <div className="flex space-x-3">
                            <a 
                                href={document.file} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                View / Download File
                            </a>
                            <button 
                                onClick={handleDelete}
                                className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </button>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-4">
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">File Type</dt>
                                <dd className="mt-1 text-sm text-gray-900 uppercase">{document.file_type}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">File Size</dt>
                                <dd className="mt-1 text-sm text-gray-900">{(document.file_size / (1024 * 1024)).toFixed(2)} MB</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Status</dt>
                                <dd className="mt-1 text-sm text-gray-900 capitalize">{document.processing_status}</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* AI Chat Interface */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Chat with this Document</h2>
                    <p className="text-sm text-gray-500">Ask questions, request summaries, or clarify concepts from {document.title}.</p>
                    <Chat documentId={document.id} />
                </div>
            </main>
        </div>
    );
};

export default DocumentDetail;
