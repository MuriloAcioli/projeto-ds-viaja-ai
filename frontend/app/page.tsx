import { HeroCard } from "@/components/c_home/hero_card";
import { HeroText } from "@/components/c_home/hero_text";
import { HomeBackgroundVideo } from "@/components/c_home/home_background_video";
import { HomeHeader } from "@/components/c_home/home_header";

export default function Home() {
  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <HomeHeader />
      <HomeBackgroundVideo />

      <main className="flex-1 min-h-0">
        <section className="mx-auto h-full px-4 py-8">
          <div className="grid grid-cols-2 gap-12 items-start h-full">
            <HeroCard />
            <HeroText />
          </div>
        </section>
      </main>
    </div>
  );
}
