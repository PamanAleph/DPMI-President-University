import React from "react";

export default function FormSection({
  question,
  numberPrefix,
  formValues,
  handleInputChange,
}: any) {
  const renderInput = () => {
    switch (question.answer_type) {
      case "text":
      case "email":
        return (
          <input
            type={question.answer_type}
            value={formValues[question.id] || ""}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        );
      case "number":
        return (
          <input
            type="number"
            value={formValues[question.id] || ""}
            onChange={(e) =>
              handleInputChange(question.id, Number(e.target.value))
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        );
      case "radio":
        return (
          <div className="flex flex-col space-y-2">
            {Object.entries(question.answer_var).map(([key, value]) => (
              <label key={key} className="inline-flex items-center">
                <input
                  type="radio"
                  value={key}
                  checked={formValues[question.id] === key}
                  onChange={(e) =>
                    handleInputChange(question.id, e.target.value)
                  }
                  className="form-radio text-blue-600"
                />
                <span className="ml-2 text-gray-700">
                  {value as React.ReactNode}
                </span>
              </label>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <div className="flex flex-col space-y-2">
            {Object.entries(question.answer_var).map(([key, value]) => (
              <label key={key} className="inline-flex items-center">
                <input
                  type="checkbox"
                  value={key}
                  onChange={(e) =>
                    handleInputChange(question.id, e.target.value)
                  }
                  className="form-checkbox text-blue-600"
                />
                <span className="ml-2 text-gray-700">
                  {value as React.ReactNode}
                </span>
              </label>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-md font-medium text-gray-700 mb-2 text-justify">
        {numberPrefix}. {question.question}
      </label>
      {renderInput()}
    </div>
  );
}
