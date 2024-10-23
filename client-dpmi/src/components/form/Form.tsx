import { fetchEvaluationById } from '@/service/api/evaluation';
import React, { useEffect, useState } from 'react'

export default function Form(evaluationId : number) {

    const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getEvaluation = async () => {
      setLoading(true);
      const data = await fetchEvaluationById(evaluationId);
      if (data) {
        setFormData(data);
      } else {
        setError('Failed to fetch data');
      }
      setLoading(false);
    };

    getEvaluation();
  }, [evaluationId]);

  const renderInput = (question) => {
    switch (question.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <input
            key={question.id}
            type={question.type}
            placeholder={question.question}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      case 'select':
        return (
          <select
            key={question.id}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {question.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div key={question.id} className="flex flex-col">
            {question.options.map((option) => (
              <label key={option.value} className="flex items-center mb-2">
                <input type="radio" name={question.id} value={option.value} className="mr-2" />
                {option.label}
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div key={question.id} className="flex items-center mb-4">
            <input type="checkbox" id={question.id} className="mr-2" />
            <label htmlFor={question.id} className="text-gray-700">{question.question}</label>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <form className="max-w-lg mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">{formData.setup.name}</h2>
      {formData.setup.sections.map(section => (
        <div key={section.id} className="mb-6">
          <h3 className="text-xl font-medium mb-2">{section.name}</h3>
          {section.questions.map(question => (
            <div key={question.id} className="mb-4">
              <label className="block text-gray-700 mb-1">{question.question}</label>
              {renderInput(question)}
            </div>
          ))}
        </div>
      ))}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-200"
      >
        Submit
      </button>
    </form>
  )
}
