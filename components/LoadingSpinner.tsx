// components/LoadingSpinner.tsx
export default function LoadingSpinner() {
  return (
    <div className="absolute z-10  flex justify-center items-center h-screen w-full bg-black/10">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
    </div>
  );
}
