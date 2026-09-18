import UpcomingMatches from "@/components/upcomingMatches";

export default function Home() {
  return (
  <div>
    <header className="text-center bg-blue-600 m-2 border rounded">
      <h1 className="text-6xl m-4 p-4 text-white">TimeLy S13A ECG</h1>
      <h2 className="text-2xl m-4 p-4 text-white">TimeLy para el staff del s13a del ecg</h2>
    </header>
    <br />
    <main>
      <UpcomingMatches />
    </main>
  </div>
  );
}
