import SnakeGame from "@/components/SnakeGame";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <SnakeGame />
    </main>
  );
}
