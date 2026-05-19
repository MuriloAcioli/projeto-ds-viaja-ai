export function getStatusStyle(status: string): string {
  switch (status) {
    case "Planejada":
      return "bg-blue-50 text-blue-600 border-blue-200";
    case "Concluída":
      return "bg-green-50 text-green-600 border-green-200";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
}
