// src/components/QnASection.tsx

import React, { useState } from 'react';
import { supabase } from '../integrations/supabase/client';

const QnASection = ({ serviceId, questions, setQuestions, user }) => {
    const [newQuestion, setNewQuestion] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleQuestionSubmit = async (e) => {
        e.preventDefault();
        if (!newQuestion.trim()) return;
        setIsLoading(true);

        const { data, error } = await supabase
            .from('qna')
            .insert({ service_id: serviceId, user_id: user.id, question: newQuestion })
            .select('*, user:profiles(full_name)')
            .single();

        if (data) {
            setQuestions([data, ...questions]);
            setNewQuestion('');
        }
        setIsLoading(false);
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Questions & Answers</h2>

            {/* Form for asking a new question */}
            {user && (
                <form onSubmit={handleQuestionSubmit} className="mb-8">
          <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Ask a question about this service..."
              className="w-full p-2 border rounded mb-2"
              rows={3}
          />
                    <button type="submit" disabled={isLoading} className="bg-gray-700 text-white font-bold py-2 px-4 rounded hover:bg-black disabled:bg-gray-400">
                        {isLoading ? 'Submitting...' : 'Ask Question'}
                    </button>
                </form>
            )}

            {/* List of existing questions */}
            <div className="space-y-6">
                {questions && questions.length > 0 ? (
                    questions.map((q) => (
                        <div key={q.id}>
                            <p className="font-bold text-lg">Q: {q.question}</p>
                            <p className="text-sm text-gray-500 mb-2">Asked by {q.user?.full_name || 'a user'} on {new Date(q.created_at).toLocaleDateString()}</p>

                            {q.answer ? (
                                <p className="text-gray-800 pl-4 border-l-4 border-blue-500">
                                    <span className="font-bold">A:</span> {q.answer}
                                </p>
                            ) : (
                                <p className="text-gray-500 pl-4">Awaiting answer...</p>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No questions have been asked yet.</p>
                )}
            </div>
        </div>
    );
};

export default QnASection;