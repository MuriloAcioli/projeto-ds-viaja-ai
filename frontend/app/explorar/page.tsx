"use client";

import { useState } from "react";
import { AttractionCard } from "@/components/c_explorar/attraction_card";
import { EmptyState } from "@/components/c_explorar/empty_state";
import { ExplorarHeader } from "@/components/c_explorar/explorar_header";
import { Sidebar } from "@/components/ui/sidebar";
import {
  ATRACOES,
  CITIES,
  CATEGORIES,
  type City,
  type Category,
} from "@/lib/data/mockAtracoes";

export default function ExplorarPage() {
  const [selectedCity, setSelectedCity] = useState<City>("Rio de Janeiro");
  const [selectedCategory, setSelectedCategory] = useState<Category>("Todas");

  const filteredAttractions = ATRACOES.filter((a) => {
    const matchCity = a.city === selectedCity;
    const matchCategory =
      selectedCategory === "Todas" || a.category === selectedCategory;
    return matchCity && matchCategory;
  });

  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-y-auto z-10">
        <ExplorarHeader />

        <main className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-8 flex flex-col gap-8 pb-20">
          <section className="flex flex-col gap-6">
            <div>
              <h3 className="text-xs font-bold text-[#0F2942] mb-3 uppercase tracking-wider bg-white/50 inline-block px-3 py-1 rounded-md">
                Destinos mais procurados
              </h3>
              <div className="flex flex-wrap gap-3">
                {CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all shadow-sm ${
                      selectedCity === city
                        ? "bg-[#0F2942] text-white"
                        : "bg-white/70 backdrop-blur-sm border border-white/40 text-gray-700 hover:bg-white"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-[#0F2942] mb-3 uppercase tracking-wider bg-white/50 inline-block px-3 py-1 rounded-md">
                Quais são seus interesses?
              </h3>
              <div className="flex flex-wrap gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm ${
                      selectedCategory === cat
                        ? "bg-[#FCF3F3] text-[#A63C3C] border-2 border-[#F2D6D6]"
                        : "bg-white/70 backdrop-blur-sm border border-white/40 text-gray-600 hover:bg-white/90"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section>
            {filteredAttractions.length === 0 ? (
              <EmptyState city={selectedCity} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAttractions.map((attraction) => (
                  <AttractionCard key={attraction.id} attraction={attraction} />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
