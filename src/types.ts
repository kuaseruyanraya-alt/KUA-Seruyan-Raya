export interface LayananItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  syarat: string; // HTML or structured content
  syarat_khusus?: string; // Optional HTML or structured content
  prosedur: string; // HTML or structured content
  biaya: string;
  faq?: Array<{ q: string; a: string }>;
}

export interface BeritaItem {
  id: string;
  title: string;
  date: string;
  category: string;
  image: string;
  summary: string;
  content: string;
}

export interface AppConfig {
  googleFormUrl: string;
  simkahUrl: string;
  whatsappNumber: string;
  alamatKua: string;
}
