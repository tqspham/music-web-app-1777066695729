'use client';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({
  message = 'Loading...',
}: LoadingSpinnerProps): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full mb-4" />
      <p className="text-gray-400">{message}</p>
    </div>
  );
}