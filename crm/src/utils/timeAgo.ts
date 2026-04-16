export function timeAgo(date: string | Date) {
  const now = new Date();
  const past = new Date(date);

  if (isNaN(past.getTime())) return "";

  const diffMs = now.getTime() - past.getTime();

  if (diffMs < 0) return "Justo ahora";

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);

  if (minutes < 1) return "Hace unos segundos";
  if (minutes < 60) return `Hace ${minutes} minutos`;

  if (hours === 1) return "Hace 1 hora";
  if (hours < 24) return `Hace ${hours} horas`;

  if (days === 1) return "Hace 1 día";
  if (days < 30) return `Hace ${days} días`;

  if (months === 1) return "Hace 1 mes";
  return `Hace ${months} meses`;
}