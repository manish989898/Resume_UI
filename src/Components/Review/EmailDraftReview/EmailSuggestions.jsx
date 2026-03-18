// In EmailSuggestions component
export default function EmailSuggestions({
  suggestions,
  handleSuggestionClick,
  emailInput,
  receiverEmails,
  formik
}) {
  // Filter suggestions
  const filteredSuggestions = suggestions.filter(suggestion => 
    suggestion.toLowerCase().includes(emailInput.toLowerCase()) && 
    !receiverEmails.includes(suggestion)
  );

  return (
    <>
      {emailInput && filteredSuggestions.length > 0 && (
        <div className="mt-1 bg-white border rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
          {filteredSuggestions.map((suggestion) => (
            <div
              key={suggestion}
              className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                handleSuggestionClick(suggestion);
                formik.setFieldError('receiverEmails', undefined);
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </>
  );
}