
const s3Url = process.env.NEXT_PUBLIC_S3_URL;
export function getProductImageUrl(codart: string): string {
  
  if (!s3Url) {
    // Si no está configurado S3, retornar fallback directamente
    return '/images/luma.jpg';
  }
  
  // Construir URL: {S3_URL}/luma/{codart}.jpg
  return `${s3Url}/luma/${codart}.jpg`;
}

