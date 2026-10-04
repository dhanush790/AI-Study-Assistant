import React, { useState, useEffect } from 'react';
import { FileText, Loader } from 'lucide-react';
import api from '../services/api';

const SummaryView = ({ documentId }) => {
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // If we want to fetch automatically on load, we can do it here.
        // But let's require a manual button click to save LLM tokens.
    }, [documentId]);

    const generateSummary = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.post('rag/summarize/', { document_id: documentId });
            setSummary(response.data.summary);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to generate summary.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-6">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-indigo-500" />
                    Study Guide Summary
                </h3>
                <button
                    onClick={generateSummary}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                    {loading ? 'Generating...' : summary ? 'Regenerate Summary' : 'Generate Summary'}
                </button>
            </div>
            
            <div className="p-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                        <Loader className="animate-spin h-8 w-8 text-indigo-500 mb-4" />
                        <p>Analyzing document and writing study guide...</p>
                    </div>
                ) : error ? (
                    <div className="text-red-500 p-4 bg-red-50 rounded-md border border-red-200">{error}</div>
                ) : summary ? (
                    <div className="prose max-w-none text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {summary}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        Click the button above to ask the AI to read your document and create a comprehensive study guide.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SummaryView;
