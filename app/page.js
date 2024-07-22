import dynamic from "next/dynamic";

// Client Componentを動的にインポート
const RhythmGameWrapper = dynamic(
  () => import("./components/RhythmGameWrapper"),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">Rhythm Master</h1>
      <RhythmGameWrapper />
    </main>
  );
}
