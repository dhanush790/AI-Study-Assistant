import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader, User, Bot, Info } from 'lucide-react';
import api from '../services/api';

const Chat = ({ documentId }) => {
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchConversations();
    }, [documentId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const url = documentId ? `chat/conversations/?document=${documentId}` : `chat/conversations/`;
            const response = await api.get(url);
            setConversations(response.data);
            if (response.data.length > 0) {
                loadConversation(response.data[0].id);
            } else {
                startNewConversation();
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    const loadConversation = async (id) => {
        try {
            const response = await api.get(`chat/conversations/${id}/`);
            setActiveConversation(response.data);
            setMessages(response.data.messages);
        } catch (error) {
            console.error('Error loading conversation:', error);
        }
    };

    const startNewConversation = async () => {
        try {
            const payload = documentId ? { document: documentId } : {};
            const response = await api.post(`chat/conversations/`, payload);
            setConversations([response.data, ...conversations]);
            setActiveConversation(response.data);
            setMessages([]);
        } catch (error) {
            console.error('Error starting new conversation:', error);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || !activeConversation) return;

        const userMessage = { role: 'user', content: input };
        setMessages([...messages, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await api.post(`chat/conversations/${activeConversation.id}/messages/`, {
                content: userMessage.content
            });
            setMessages([...messages, userMessage, response.data]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMsg = error.response?.data?.error || 'Sorry, I encountered an error. Please try again.';
            setMessages([...messages, userMessage, { role: 'assistant', content: `Error: ${errorMsg}` }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-[600px] border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm mt-6">
            {/* Sidebar */}
            <div className="w-64 border-r border-gray-200 bg-gray-50 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <button 
                        onClick={startNewConversation}
                        className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                    >
                        + New Chat
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.map(conv => (
                        <button
                            key={conv.id}
                            onClick={() => loadConversation(conv.id)}
                            className={`w-full text-left px-4 py-3 text-sm border-b border-gray-100 hover:bg-gray-100 ${activeConversation?.id === conv.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                        >
                            <div className="truncate font-medium text-gray-800">{conv.title}</div>
                            <div className="text-xs text-gray-500 mt-1">{new Date(conv.updated_at).toLocaleDateString()}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <Bot className="h-12 w-12 text-gray-300 mb-4" />
                            <p>Send a message to start chatting with your study materials!</p>
                        </div>
                    ) : (
                        messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-blue-500 ml-3' : 'bg-green-500 mr-3'}`}>
                                        {msg.role === 'user' ? <User className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-white" />}
                                    </div>
                                    <div className={`px-4 py-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                                        <div className="whitespace-pre-wrap">{msg.content}</div>
                                        {msg.sources && msg.sources.length > 0 && (
                                            <div className="mt-3 pt-3 border-t border-gray-200">
                                                <div className="text-xs font-semibold flex items-center text-gray-500 mb-2">
                                                    <Info className="h-3 w-3 mr-1" /> Sources
                                                </div>
                                                <div className="space-y-2">
                                                    {msg.sources.map((src, i) => (
                                                        <div key={i} className="bg-white p-2 rounded text-xs text-gray-600 border border-gray-200 line-clamp-3">
                                                            <span className="font-bold block mb-1">Page {src.page}</span>
                                                            "{src.content}"
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="flex max-w-[80%] flex-row">
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-500 mr-3 flex items-center justify-center">
                                    <Bot className="h-5 w-5 text-white" />
                                </div>
                                <div className="px-4 py-3 rounded-lg bg-gray-100 text-gray-800 flex items-center">
                                    <Loader className="animate-spin h-5 w-5 text-gray-500 mr-2" />
                                    <span>Thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                <div className="p-4 border-t border-gray-200 bg-white">
                    <form onSubmit={handleSend} className="flex space-x-4">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question about your study materials..."
                            className="flex-1 block w-full rounded-md border-gray-300 border shadow-sm py-2 px-3 focus:border-blue-500 focus:ring-blue-500"
                            disabled={loading || !activeConversation}
                        />
                        <button
                            type="submit"
                            disabled={loading || !activeConversation || !input.trim()}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                        >
                            <Send className="h-4 w-4 mr-2" />
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chat;
