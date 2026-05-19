import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const formatarDataExtenso = (dataStr: string): string => {
  if (!dataStr) return "";

  // Se houver um intervalo, ela chama "formatarDataExtenso" para cada parte
  if (dataStr.includes(" até ")) {
    const [d1, d2] = dataStr.split(" até ");
    // O erro estava aqui: você provavelmente usou formatarData em vez de formatarDataExtenso
    return `${formatarDataExtenso(d1)} - ${formatarDataExtenso(d2)}`;
  }
  
  let date;
  if (dataStr.includes("/")) {
    const [d, m, y] = dataStr.split("/");
    date = new Date(`${y}-${m}-${d}T12:00:00`);
  } else {
    date = new Date(`${dataStr}T12:00:00`);
  }
  
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'long'
  }).format(date).replace(/^\w/, (c) => c.toUpperCase());
};

export const formatarDuracao = (minutos: number): string => {
  if (!minutos) return "";
  if (minutos < 60) return `${minutos}min`;
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
};
