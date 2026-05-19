import Image from "next/image";
import { ArrowRight, Clock, DollarSign, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Attraction } from "@/lib/data/mockAtracoes";

export function AttractionCard({ attraction }: { attraction: Attraction }) {
  return (
    <div className="group bg-white/90 backdrop-blur-md rounded-3xl border border-white/50 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={attraction.imageUrl}
          alt={attraction.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-[#A63C3C] shadow-sm">
          {attraction.category}
        </div>
        <h3 className="absolute bottom-4 left-4 right-4 text-white font-bold text-xl leading-tight">
          {attraction.name}
        </h3>
      </div>

      <div className="p-5 flex flex-col flex-1 gap-4">
        <p className="text-sm text-gray-600 line-clamp-2">
          {attraction.description}
        </p>

        <div className="space-y-2 mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={16} className="text-[#D68585] shrink-0" />
            <span className="truncate">{attraction.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={16} className="text-[#D68585] shrink-0" />
            <span>{attraction.hours}</span>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2 text-sm font-semibold bg-green-50 px-2 py-1 rounded-md">
              <DollarSign size={16} className="text-green-600" />
              <span className="text-green-700">{attraction.price}</span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              disabled
              className="text-[#A63C3C] hover:text-[#A63C3C] hover:bg-[#FCF3F3] rounded-full group/btn disabled:opacity-40"
            >
              Adicionar{" "}
              <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
