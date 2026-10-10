import { QuantumKeypad } from "@/components/QuantumKeypad";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[#020617] keypad-grid flex flex-col items-center justify-center p-4 sm:p-8">
      <QuantumKeypad />
    </main>
  );
}
