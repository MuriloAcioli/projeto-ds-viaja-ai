import Image from "next/image";
import { ArrowRight, Clock, DollarSign, MapPin, X, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Attraction } from "@/lib/types/explorar";

interface AttractionModalProps {
  attraction: Attraction;
  isOpen: boolean;
  onClose: () => void;
}

export function AttractionModal({
  attraction,
  isOpen,
  onClose,
}: AttractionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Left Side: Image & Fast Info */}
        <div className="relative w-full md:w-2/5 h-64 md:h-auto shrink-0">
          <Image
            src={attraction.imageUrl}
            alt={attraction.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-colors md:hidden"
          >
            <X size={20} />
          </button>

          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold w-fit mb-3">
              {attraction.category}
            </div>
            <h2 className="text-3xl font-bold leading-tight mb-2">
              {attraction.name}
            </h2>
            <div className="flex items-center gap-2 text-sm text-white/90">
              <MapPin size={16} />
              <span>{attraction.location}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 flex flex-col overflow-y-auto max-h-[90vh]">
          {/* Close button for desktop */}
          <div className="hidden md:flex justify-end p-4 sticky top-0 bg-white/80 backdrop-blur-sm z-10">
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="px-6 pb-6 md:px-8 md:pb-8 md:pt-4 flex flex-col gap-6">
            
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 pt-4 md:pt-0">
              <div className="flex-1 min-w-[140px] bg-gray-50 p-4 rounded-2xl flex flex-col gap-1 border border-gray-100">
                <div className="flex items-center gap-2 text-[#D68585] text-sm font-semibold">
                  <Clock size={18} />
                  Horários
                </div>
                <span className="text-gray-800 font-medium">{attraction.hours}</span>
              </div>
              <div className="flex-1 min-w-[140px] bg-green-50 p-4 rounded-2xl flex flex-col gap-1 border border-green-100">
                <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                  <DollarSign size={18} />
                  Preço
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-green-600/80 leading-none mb-1 font-bold">A partir de / Aprox.</span>
                  <span className="text-gray-800 font-medium leading-none">{attraction.price}</span>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-[#0F2942]">Sobre</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                {attraction.longDescription || attraction.description}
              </p>
              {attraction.tripAdvisorUrl && (
                <div className="pt-2">
                  <a 
                    href={attraction.tripAdvisorUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#fcf5f5] text-[#A63C3C] hover:bg-[#f8ebeb] border border-[#f3dede] rounded-xl font-semibold text-sm transition-all duration-300 shadow-sm"
                  >
                    Mais informações no TripAdvisor
                    <ExternalLink size={16} />
                  </a>
                </div>
              )}
            </div>

            {/* Reviews */}
            {attraction.reviews && attraction.reviews.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="text-lg font-bold text-[#0F2942] flex items-center gap-2">
                  <Star className="text-yellow-400 fill-yellow-400" size={20} />
                  Avaliações
                </h3>
                <div className="flex flex-col gap-4">
                  {attraction.reviews.map((review, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-[#0F2942] text-sm">{review.author}</span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              size={14} 
                              className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm italic">&ldquo;{review.text}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-auto sticky bottom-0 p-6 bg-gradient-to-t from-white via-white to-transparent">
            <Button
              onClick={() => {
                window.location.href = `/chat?destino=${encodeURIComponent(attraction.city)}`;
              }}
              className="w-full bg-[#0F2942] hover:bg-[#0F2942]/90 text-white rounded-full py-6 font-semibold shadow-lg group"
            >
              Planejar viagem para {attraction.city}
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
