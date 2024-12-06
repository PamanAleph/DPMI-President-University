
export default function MajorNotMatch() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-700 p-6">
      <div className="max-w-md text-center bg-white shadow-xl rounded-lg p-10 space-y-6">
        <h2 className="text-3xl font-bold text-red-600">Access Denied</h2>
        <p className="text-lg">
          We&apos;re sorry, but you are not allowed to fill out this form. Your
          access has been restricted based on the form&apos;s requirements.
        </p>
        <p className="text-sm text-gray-500">
          If you believe this is a mistake or have any questions, please contact
          the administrator for assistance.
        </p>
      </div>
    </div>
  );
}
