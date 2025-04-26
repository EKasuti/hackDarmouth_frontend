import CheckAuth from "./components/authSection";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-3xl font-bold">Research App Login Test</h1>
      <CheckAuth/>
      
    </main>
  );
}
