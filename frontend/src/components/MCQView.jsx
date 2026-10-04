import React, { useState } from 'react';
import { HelpCircle, Loader, CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';

const MCQView = ({ documentId }) => {
    const [mcqs, setMcqs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Quiz State
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);

    const generateMCQ = async () => {
        setLoading(true);
        setError('');
        setMcqs([]);
        setCurrentIndex(0);
        setSelectedOption(null);
        setShowExplanation(false);
        setScore(0);
        setQuizFinished(false);

        try {
            const response = await api.post('rag/mcq/', { document_id: documentId, count: 5 });
            if (response.data.mcqs && response.data.mcqs.length > 0) {
                setMcqs(response.data.mcqs);
            } else {
                setError('AI failed to generate questions. Please try again.');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to generate quiz.');
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (option) => {
        if (showExplanation) return; // Prevent changing answer after submission
        setSelectedOption(option);
    };

    const handleCheckAnswer = () => {
        if (!selectedOption) return;
        setShowExplanation(true);
        if (selectedOption === mcqs[currentIndex].correctAnswer) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < mcqs.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedOption(null);
            setShowExplanation(false);
        } else {
            setQuizFinished(true);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-6">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2 text-purple-500" />
                    Practice Quiz (MCQ)
                </h3>
                <button
                    onClick={generateMCQ}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                >
                    {loading ? 'Generating...' : mcqs.length > 0 ? 'Generate New Quiz' : 'Generate Quiz'}
                </button>
            </div>
            
            <div className="p-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                        <Loader className="animate-spin h-8 w-8 text-purple-500 mb-4" />
                        <p>Reading document and writing testable questions...</p>
                    </div>
                ) : error ? (
                    <div className="text-red-500 p-4 bg-red-50 rounded-md border border-red-200">{error}</div>
                ) : mcqs.length > 0 && !quizFinished ? (
                    <div className="max-w-2xl mx-auto">
                        <div className="mb-6 flex justify-between items-center text-sm text-gray-500 font-medium">
                            <span>Question {currentIndex + 1} of {mcqs.length}</span>
                            <span>Score: {score}</span>
                        </div>
                        
                        <h4 className="text-xl font-bold text-gray-900 mb-6">{mcqs[currentIndex].question}</h4>
                        
                        <div className="space-y-3 mb-6">
                            {mcqs[currentIndex].options.map((option, idx) => {
                                const isSelected = selectedOption === option;
                                const isCorrect = option === mcqs[currentIndex].correctAnswer;
                                
                                let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-colors duration-150 ";
                                
                                if (!showExplanation) {
                                    buttonClass += isSelected ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300 hover:bg-gray-50";
                                } else {
                                    if (isCorrect) {
                                        buttonClass += "border-green-500 bg-green-50";
                                    } else if (isSelected && !isCorrect) {
                                        buttonClass += "border-red-500 bg-red-50";
                                    } else {
                                        buttonClass += "border-gray-200 opacity-50";
                                    }
                                }

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleOptionSelect(option)}
                                        disabled={showExplanation}
                                        className={buttonClass}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span>{option}</span>
                                            {showExplanation && isCorrect && <CheckCircle className="h-5 w-5 text-green-500" />}
                                            {showExplanation && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-500" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                        
                        {showExplanation && (
                            <div className={`p-4 rounded-lg mb-6 ${selectedOption === mcqs[currentIndex].correctAnswer ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                <h5 className="font-bold mb-1">
                                    {selectedOption === mcqs[currentIndex].correctAnswer ? 'Correct!' : 'Incorrect!'}
                                </h5>
                                <p>{mcqs[currentIndex].explanation}</p>
                            </div>
                        )}
                        
                        <div className="flex justify-end">
                            {!showExplanation ? (
                                <button
                                    onClick={handleCheckAnswer}
                                    disabled={!selectedOption}
                                    className="px-6 py-2 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 disabled:opacity-50"
                                >
                                    Check Answer
                                </button>
                            ) : (
                                <button
                                    onClick={handleNext}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
                                >
                                    {currentIndex < mcqs.length - 1 ? 'Next Question' : 'Finish Quiz'}
                                </button>
                            )}
                        </div>
                    </div>
                ) : quizFinished ? (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
                            <CheckCircle className="h-12 w-12 text-green-500" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h3>
                        <p className="text-lg text-gray-600 mb-6">You scored {score} out of {mcqs.length}.</p>
                        <button
                            onClick={generateMCQ}
                            className="px-6 py-3 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700"
                        >
                            Generate Another Quiz
                        </button>
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        Click the button above to ask the AI to generate a 5-question practice quiz based on your document.
                    </div>
                )}
            </div>
        </div>
    );
};

export default MCQView;
