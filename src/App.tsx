import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  ShieldCheck, 
  UserCheck, 
  Copy, 
  FileCheck2, 
  Scale, 
  HeartHandshake, 
  FileDown, 
  Search, 
  ArrowLeft, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  ExternalLink, 
  ChevronRight, 
  Info, 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  Building2, 
  Menu, 
  X, 
  AlertCircle,
  Sparkles,
  HeartPulse,
  FileSignature,
  FileText,
  ClipboardList,
  Newspaper,
  Lock,
  Unlock,
  Edit3,
  Trash2,
  Plus,
  Upload,
  Image as ImageIcon,
  Tag,
  Eye,
  LogOut,
  KeyRound,
  User,
  Cloud,
  Share2,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DATA_LAYANAN, getBeritaList, saveBeritaList } from './data';
import { BeritaItem } from './types';
import { subscribeBeritaList, saveBeritaCloud, deleteBeritaCloud } from './services/firebaseService';

const IconMap: { [key: string]: React.ComponentType<any> } = {
  Heart: Heart,
  ShieldCheck: ShieldCheck,
  UserCheck: UserCheck,
  Copy: Copy,
  FileCheck2: FileCheck2,
  Scale: Scale,
  HeartHandshake: HeartHandshake,
  FileDown: FileDown,
  HeartPulse: HeartPulse,
  FileShield: ShieldCheck,
  FileCirclePlus: FileCheck2,
  FileSignature: FileSignature,
  ScaleBalanced: Scale,
  HandHoldingHeart: HeartHandshake,
  FileText: FileText,
  ClipboardList: ClipboardList
};

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  isExternal?: boolean;
  details?: {
    syarat: string;
    syarat_khusus?: string;
    prosedur: string;
    biaya: string;
    faq?: Array<{ question: string; answer: string }>;
  };
}

// Official Google Forms List
export const FORMULIR_LINKS = [
  {
    id: 'pemberkasan-nikah',
    title: 'Pengajuan Pemberkasan Kehendak Nikah',
    description: 'Formulir pendaftaran dan pengajuan berkas kehendak nikah secara online ke KUA Seruyan Raya.',
    icon: FileText,
    badge: 'Google Form Resmi',
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSfRGCx63iJ-Jy_An64wYI6Ebru4zN7Cb4Kv8XqF0WpuX7Kt4A/viewform?usp=sharing&ouid=107291441874551925405'
  },
  {
    id: 'pemeriksaan-catin-puskesmas',
    title: 'Pengajuan Surat Pemeriksaan Catin ke PUSKESMAS',
    description: 'Formulir pengajuan surat pengantar pemeriksaan kesehatan calon pengantin (Catin) ke Puskesmas.',
    icon: HeartPulse,
    badge: 'Surat Catin Puskesmas',
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSeNusMnrPkI3b_ZwtvxMdBOM5v9r0_jmeqG_SUG60Oi5yWL2Q/viewform?usp=sharing&ouid=107291441874551925405'
  },
  {
    id: 'pemeriksaan-catin-puskesmas-nf',
    title: 'Pengajuan Surat Pemeriksaan Catin ke PUSKESMAS dengan NF',
    description: 'Formulir pengajuan surat pemeriksaan Catin ke Puskesmas khusus dengan lampiran NF.',
    icon: FileCheck2,
    badge: 'Surat Catin (dengan NF)',
    url: 'https://docs.google.com/forms/d/e/1FAIpQLScYjxci3TBNg3mEIEyP_g2B0JPU360iz9hYgRG3C4W6ONqboQ/viewform?usp=sharing&ouid=107291441874551925405'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'beranda' | 'formulir' | 'informasi' | 'kontak'>('beranda');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [isFormulirModalOpen, setIsFormulirModalOpen] = useState(false);
  
  // FAQ Expanded index state
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Berita & Admin State
  const [beritaList, setBeritaList] = useState<BeritaItem[]>(() => getBeritaList());
  const [selectedBerita, setSelectedBerita] = useState<BeritaItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Subscribe to Firebase Firestore Cloud Database in real-time
  useEffect(() => {
    const unsubscribe = subscribeBeritaList((cloudList) => {
      setBeritaList(cloudList);
    });
    return () => unsubscribe();
  }, []);

  // Sync news selection with URL search param `?berita=ID` for deep-linking & direct page access
  useEffect(() => {
    const syncUrlWithBerita = () => {
      const params = new URLSearchParams(window.location.search);
      const beritaId = params.get('berita') || params.get('id');
      if (beritaId && beritaList.length > 0) {
        const found = beritaList.find(b => b.id === beritaId);
        if (found) {
          setSelectedBerita(found);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };

    syncUrlWithBerita();
    window.addEventListener('popstate', syncUrlWithBerita);
    return () => window.removeEventListener('popstate', syncUrlWithBerita);
  }, [beritaList]);

  const handleSelectBerita = (berita: BeritaItem) => {
    setSelectedBerita(berita);
    setSelectedServiceId(null);
    const url = new URL(window.location.href);
    url.searchParams.set('berita', berita.id);
    window.history.pushState({}, '', url.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseBerita = () => {
    setSelectedBerita(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('berita');
    url.searchParams.delete('id');
    window.history.pushState({}, '', url.toString());
  };

  const getBeritaShareUrl = (beritaId: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('berita', beritaId);
    return url.toString();
  };

  const handleCopyBeritaLink = (beritaId: string) => {
    const shareUrl = getBeritaShareUrl(beritaId);
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      triggerNotification("Link berita berhasil disalin!");
      setTimeout(() => setCopiedLink(false), 2500);
    }).catch(() => {
      triggerNotification("Gagal menyalin link berita.");
    });
  };

  const handleNativeShare = async (berita: BeritaItem) => {
    const shareUrl = getBeritaShareUrl(berita.id);
    if (navigator.share) {
      try {
        await navigator.share({
          title: berita.title,
          text: berita.summary,
          url: shareUrl,
        });
      } catch (err) {
        // user cancelled
      }
    } else {
      handleCopyBeritaLink(berita.id);
    }
  };
  
  // Admin Login & Manage Berita State
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Modal Kelola Berita (Add/Edit)
  const [isBeritaFormOpen, setIsBeritaFormOpen] = useState(false);
  const [editingBerita, setEditingBerita] = useState<BeritaItem | null>(null);
  const [formBeritaTitle, setFormBeritaTitle] = useState('');
  const [formBeritaDate, setFormBeritaDate] = useState('');
  const [formBeritaCategory, setFormBeritaCategory] = useState('Kegiatan KUA');
  const [formBeritaImage, setFormBeritaImage] = useState('');
  const [formBeritaSummary, setFormBeritaSummary] = useState('');
  const [formBeritaContent, setFormBeritaContent] = useState('');

  const handleLogoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAdmin) {
      setAdminUsername('');
      setAdminPassword('');
      setLoginError('');
      setIsAdminLoginModalOpen(true);
    } else {
      triggerNotification("Mode Admin KUA sedang aktif. Anda dapat menambah atau mengubah berita di sebelah kanan Beranda.");
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUsername.trim().toLowerCase() === 'admin' && 
        ['admin123', 'admin', 'kuaseruyanraya'].includes(adminPassword.trim())) {
      setIsAdmin(true);
      setIsAdminLoginModalOpen(false);
      triggerNotification("Berhasil masuk sebagai Admin KUA Seruyan Raya!");
    } else {
      setLoginError("Username atau kode admin tidak valid. Gunakan admin / admin123");
    }
  };

  const handleOpenAddBerita = () => {
    setEditingBerita(null);
    setFormBeritaTitle('');
    setFormBeritaDate(new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }));
    setFormBeritaCategory('Kegiatan KUA');
    setFormBeritaImage('');
    setFormBeritaSummary('');
    setFormBeritaContent('');
    setIsBeritaFormOpen(true);
  };

  const handleOpenEditBerita = (item: BeritaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingBerita(item);
    setFormBeritaTitle(item.title);
    setFormBeritaDate(item.date);
    setFormBeritaCategory(item.category);
    setFormBeritaImage(item.image);
    setFormBeritaSummary(item.summary);
    setFormBeritaContent(item.content);
    setIsBeritaFormOpen(true);
  };

  const handleDeleteBerita = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Apakah Anda yakin ingin menghapus berita ini dari Cloud Database?")) {
      try {
        await deleteBeritaCloud(id);
        triggerNotification("Berita berhasil dihapus dari Cloud Database!");
      } catch (err) {
        console.error("Gagal menghapus berita dari cloud:", err);
        const updated = beritaList.filter(b => b.id !== id);
        setBeritaList(updated);
        saveBeritaList(updated);
        triggerNotification("Berita dihapus.");
      }
    }
  };

  const handleSaveBerita = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBeritaTitle.trim() || !formBeritaSummary.trim()) {
      alert("Judul dan ringkasan berita harus diisi.");
      return;
    }
    
    let targetItem: BeritaItem;
    if (editingBerita) {
      targetItem = {
        ...editingBerita,
        title: formBeritaTitle,
        date: formBeritaDate || editingBerita.date,
        category: formBeritaCategory,
        image: formBeritaImage || "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=800&q=80",
        summary: formBeritaSummary,
        content: formBeritaContent || formBeritaSummary
      };
      triggerNotification("Menyimpan perubahan ke Cloud Database...");
    } else {
      targetItem = {
        id: 'berita-' + Date.now(),
        title: formBeritaTitle,
        date: formBeritaDate || new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
        category: formBeritaCategory,
        image: formBeritaImage || "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=800&q=80",
        summary: formBeritaSummary,
        content: formBeritaContent || formBeritaSummary
      };
      triggerNotification("Menerbitkan berita ke Cloud Database...");
    }

    try {
      await saveBeritaCloud(targetItem);
      triggerNotification(editingBerita ? "Berita diperbarui & langsung terupdate di semua website client!" : "Berita baru terbit di Cloud Database & langsung muncul di semua client!");
    } catch (err) {
      console.error("Gagal menyimpan ke cloud:", err);
      const updatedList = editingBerita 
        ? beritaList.map(b => b.id === editingBerita.id ? targetItem : b)
        : [targetItem, ...beritaList];
      setBeritaList(updatedList);
      saveBeritaList(updatedList);
      triggerNotification("Berita tersimpan secara lokal.");
    }

    setIsBeritaFormOpen(false);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormBeritaImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Map DATA_LAYANAN to standard ServiceItem structure
  const servicesData: ServiceItem[] = [
    ...DATA_LAYANAN.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      icon: item.icon,
      details: {
        syarat: item.syarat,
        syarat_khusus: item.syarat_khusus,
        prosedur: item.prosedur,
        biaya: item.biaya,
        faq: item.faq?.map((f) => ({
          question: f.q,
          answer: f.a,
        })),
      },
    })),
    // Add the Formulir item dynamically
    {
      id: 'formulir',
      title: 'Pilih & Isi Formulir Nikah / Catin',
      description: 'Pilihan formulir online pengajuan kehendak nikah dan surat pengantar pemeriksaan Catin ke Puskesmas.',
      icon: 'FileText',
      isExternal: true,
    },
  ];

  const triggerNotification = (message: string) => {
    setShowNotification(message);
    setTimeout(() => {
      setShowNotification(null);
    }, 4000);
  };

  // Filter services
  const filteredServices = servicesData.filter(service => {
    const query = searchQuery.toLowerCase();
    return (
      service.title.toLowerCase().includes(query) ||
      service.description.toLowerCase().includes(query)
    );
  });

  const selectedService = servicesData.find(s => s.id === selectedServiceId);

  // Trigger click on service
  const handleServiceClick = (service: ServiceItem) => {
    if (service.isExternal || service.id === 'formulir') {
      setIsFormulirModalOpen(true);
    } else {
      setSelectedServiceId(service.id);
      setExpandedFaqIndex(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenFormUrl = (url: string, title: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    triggerNotification(`Membuka ${title}...`);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-slate-800 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-900 text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 border border-emerald-500/30 font-medium text-sm md:text-base whitespace-nowrap"
          >
            <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
            <span>{showNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Header */}
      <nav id="header-nav" className="sticky top-0 z-40 bg-primary/95 backdrop-blur-md text-white border-b-4 border-secondary shadow-lg">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3.5 flex justify-between items-center">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setActiveTab('beranda'); setSelectedServiceId(null); }}>
            <div 
              onClick={handleLogoClick}
              title="Akses Portal Admin KUA (Klik untuk Masuk Mode Admin)"
              className="bg-white p-1.5 rounded-xl border border-secondary/30 shadow-md group-hover:scale-105 transition-transform duration-200 cursor-pointer"
            >
              <img 
                src="https://bimaskatolik.kemenag.go.id/sample/logo.png" 
                className="w-8 h-8 object-contain filter drop-shadow-sm" 
                alt="Logo Kemenag"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="font-display font-black tracking-tight text-sm md:text-base leading-none text-secondary">
                KUA SERUYAN RAYA
              </div>
              <div className="text-[9px] text-emerald-100 font-mono tracking-widest uppercase mt-1">
                Kementerian Agama RI
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5">
            <button 
              id="nav-beranda"
              onClick={() => { setActiveTab('beranda'); setSelectedServiceId(null); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'beranda' && !selectedServiceId
                  ? 'bg-secondary text-primary shadow-md shadow-secondary/20 scale-105'
                  : 'hover:bg-white/10 text-emerald-100 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Beranda</span>
            </button>
            <button 
              id="nav-formulir"
              onClick={() => { setIsFormulirModalOpen(true); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                isFormulirModalOpen
                  ? 'bg-secondary text-primary shadow-md shadow-secondary/20 scale-105'
                  : 'hover:bg-white/10 text-emerald-100 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>Pilih Formulir</span>
            </button>
            <button 
              id="nav-informasi"
              onClick={() => { setActiveTab('informasi'); setSelectedServiceId(null); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'informasi'
                  ? 'bg-secondary text-primary shadow-md shadow-secondary/20 scale-105'
                  : 'hover:bg-white/10 text-emerald-100 hover:text-white'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>Informasi KUA</span>
            </button>
            <button 
              id="nav-kontak"
              onClick={() => { setActiveTab('kontak'); setSelectedServiceId(null); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'kontak'
                  ? 'bg-secondary text-primary shadow-md shadow-secondary/20 scale-105'
                  : 'hover:bg-white/10 text-emerald-100 hover:text-white'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>Kontak Kami</span>
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden flex items-center gap-2">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl hover:bg-white/10 text-emerald-100 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-primary border-t border-emerald-800/40 px-4 py-3 space-y-2 overflow-hidden"
            >
              <button 
                onClick={() => { setActiveTab('beranda'); setSelectedServiceId(null); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-3 ${
                  activeTab === 'beranda' && !selectedServiceId ? 'bg-secondary text-primary shadow-md' : 'text-emerald-100 hover:bg-white/10'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Beranda</span>
              </button>
              <button 
                onClick={() => { setIsFormulirModalOpen(true); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-3 text-amber-300 hover:bg-white/10`}
              >
                <FileText className="w-4 h-4 text-amber-300" />
                <span>Pilih Formulir</span>
              </button>
              <button 
                onClick={() => { setActiveTab('informasi'); setSelectedServiceId(null); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-3 ${
                  activeTab === 'informasi' ? 'bg-secondary text-primary shadow-md' : 'text-emerald-100 hover:bg-white/10'
                }`}
              >
                <Info className="w-4 h-4" />
                <span>Informasi KUA</span>
              </button>
              <button 
                onClick={() => { setActiveTab('kontak'); setSelectedServiceId(null); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-3 ${
                  activeTab === 'kontak' ? 'bg-secondary text-primary shadow-md' : 'text-emerald-100 hover:bg-white/10'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>Kontak Kami</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content Stage */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 md:px-8 py-6">
        
        {/* Breadcrumbs for internal page routing */}
        {selectedServiceId && (
          <div className="mb-6 flex items-center gap-2 text-xs md:text-sm text-slate-500 font-medium">
            <span className="hover:text-emerald-600 cursor-pointer" onClick={() => setSelectedServiceId(null)}>Beranda</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-800 font-semibold">{selectedService?.title}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {selectedBerita ? (
            /* LAMAN KHUSUS BERITA DETAIL (Dedicated Full Page View) */
            <motion.div
              key="berita-detail-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-8"
            >
              {/* Top Navigation & Breadcrumb */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <button 
                  onClick={handleCloseBerita}
                  className="inline-flex items-center gap-2 text-primary hover:text-[#004f00] font-black text-sm transition-all duration-200 bg-primary/10 hover:bg-primary/15 px-4 py-2.5 rounded-xl border border-primary/20 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali ke Portal KUA</span>
                </button>

                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium overflow-hidden">
                  <span className="hover:text-emerald-600 cursor-pointer shrink-0" onClick={handleCloseBerita}>Beranda</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-emerald-700 font-bold shrink-0">Berita KUA</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-800 font-semibold truncate max-w-[180px] md:max-w-xs">{selectedBerita.title}</span>
                </div>
              </div>

              {/* Article Header */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-primary/95 text-secondary font-black text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm border border-secondary/30">
                    {selectedBerita.category}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    {selectedBerita.date}
                  </span>
                  <span className="text-xs text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    Humas KUA Seruyan Raya
                  </span>
                </div>

                <h1 className="font-display font-black text-2xl md:text-3xl lg:text-4xl text-slate-900 leading-snug tracking-tight">
                  {selectedBerita.title}
                </h1>
              </div>

              {/* Main Photo Banner */}
              <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg bg-slate-100 border border-slate-200">
                <img 
                  src={selectedBerita.image} 
                  alt={selectedBerita.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Summary Highlight Box */}
              {selectedBerita.summary && (
                <div className="bg-emerald-50/70 border-l-4 border-primary p-5 rounded-r-2xl shadow-sm text-slate-700 text-sm md:text-base italic leading-relaxed">
                  <strong className="not-italic text-primary font-bold block mb-1">Ringkasan Berita:</strong>
                  &ldquo;{selectedBerita.summary}&rdquo;
                </div>
              )}

              {/* Full Text Content */}
              <div className="prose prose-sm md:prose-base max-w-none text-slate-800 leading-relaxed space-y-5 font-sans text-sm md:text-base border-b border-slate-100 pb-8">
                {selectedBerita.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="leading-relaxed text-slate-700">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* BAGIKAN BERITA / SHARE SECTION */}
              <div className="bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-50 border border-emerald-200/80 rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-100">
                  <div>
                    <h3 className="font-display font-black text-lg text-slate-800 flex items-center gap-2">
                      <Share2 className="w-5 h-5 text-primary" />
                      <span>Bagikan Link Berita Ini</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Bagikan informasi resmi KUA ini kepada masyarakat atau keluarga:
                    </p>
                  </div>
                  
                  {/* Native Share Button */}
                  <button
                    onClick={() => handleNativeShare(selectedBerita)}
                    className="bg-primary hover:bg-[#004f00] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2 self-start sm:self-auto cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Bagikan Cepat</span>
                  </button>
                </div>

                {/* Direct Link Copy Bar */}
                <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                  <div className="relative flex-grow">
                    <input 
                      type="text" 
                      readOnly 
                      value={getBeritaShareUrl(selectedBerita.id)} 
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-600 focus:outline-none select-all"
                    />
                  </div>
                  <button 
                    onClick={() => handleCopyBeritaLink(selectedBerita.id)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shrink-0 ${
                      copiedLink 
                        ? 'bg-emerald-600 text-white shadow' 
                        : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                    }`}
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Link Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Salin Link Berita</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Social Media Shortcuts */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold text-slate-500">Bagikan langsung ke:</span>
                  
                  <a 
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(selectedBerita.title + '\n' + getBeritaShareUrl(selectedBerita.id))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] hover:bg-[#1ebd59] text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-sm transition"
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" className="w-4 h-4 filter invert" />
                    <span>WhatsApp</span>
                  </a>

                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getBeritaShareUrl(selectedBerita.id))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#1877F2] hover:bg-[#0f64d2] text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-sm transition"
                  >
                    <span>Facebook</span>
                  </a>

                  <a 
                    href={`https://t.me/share/url?url=${encodeURIComponent(getBeritaShareUrl(selectedBerita.id))}&text=${encodeURIComponent(selectedBerita.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#229ED9] hover:bg-[#1d88bc] text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-sm transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Telegram</span>
                  </a>
                </div>
              </div>

              {/* Admin Actions Bar (If logged in) */}
              {isAdmin && (
                <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-amber-900 font-bold">
                    <Lock className="w-4 h-4 text-amber-700" />
                    <span>Aksi Kelola Admin (Berita Ini)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        const b = selectedBerita;
                        handleOpenEditBerita(b, e);
                      }}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Berita Ini</span>
                    </button>
                    <button
                      onClick={(e) => {
                        const bId = selectedBerita.id;
                        handleCloseBerita();
                        handleDeleteBerita(bId, e);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Berita Ini</span>
                    </button>
                  </div>
                </div>
              )}

              {/* BERITA KUA LAINNYA */}
              {beritaList.filter(b => b.id !== selectedBerita.id).length > 0 && (
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <h3 className="font-display font-black text-lg text-slate-800 flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-primary" />
                    <span>Berita KUA Lainnya</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {beritaList.filter(b => b.id !== selectedBerita.id).slice(0, 4).map((other) => (
                      <div
                        key={other.id}
                        onClick={() => handleSelectBerita(other)}
                        className="group border border-slate-200 hover:border-primary/50 rounded-2xl p-4 transition-all duration-200 hover:shadow-md bg-stone-50/60 hover:bg-white cursor-pointer flex gap-4 items-center"
                      >
                        <img 
                          src={other.image} 
                          alt={other.title} 
                          className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200 group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] font-extrabold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-md inline-block mb-1">
                            {other.category}
                          </span>
                          <h4 className="font-display font-bold text-xs md:text-sm text-slate-800 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                            {other.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-1 font-medium">{other.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          ) : !selectedServiceId ? (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {/* TAB 1: BERANDA (Layanan Grid) */}
              {activeTab === 'beranda' && (
                <div>
                  {/* Hero Jumbotron Section */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-primary via-[#044a04] to-[#012801] rounded-3xl p-6 md:p-10 text-white mb-8 border-2 border-secondary/20 shadow-xl shadow-primary/20">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-secondary/15 to-transparent rounded-full blur-3xl -mr-20 -mt-20 animate-pulse" style={{ animationDuration: '8s' }}></div>
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-2xl -ml-20 -mb-20"></div>
                    
                    <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-8">
                      <div className="bg-white p-4 rounded-2xl border-2 border-secondary shadow-xl shrink-0 self-center hover:scale-105 transition-transform duration-300">
                        <img 
                          src="https://bimaskatolik.kemenag.go.id/sample/logo.png" 
                          className="w-16 h-16 md:w-20 md:h-20 object-contain filter drop-shadow-md" 
                          alt="Logo Kemenag"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="text-center md:text-left flex-grow">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-secondary font-mono text-[10px] uppercase tracking-wider border border-secondary/30 mb-3 font-semibold">
                          <Sparkles className="w-3 h-3 text-secondary" /> Portal Pelayanan Publik Resmi
                        </span>
                        <h1 className="font-display font-extrabold text-2xl md:text-3xl lg:text-4xl tracking-tight leading-tight mb-2 text-white">
                          Kantor Urusan Agama Kecamatan Seruyan Raya
                        </h1>
                        <p className="text-secondary text-xs md:text-sm font-semibold mb-2">
                          Kabupaten Seruyan, Provinsi Kalimantan Tengah
                        </p>
                        <p className="text-emerald-100/80 text-xs font-light font-sans max-w-2xl leading-relaxed">
                          Komitmen kami melayani pendaftaran nikah, rujuk, konsultasi keluarga sakinah, dan legalitas dokumen keagamaan secara profesional, transparan, dan akuntabel.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 2-Column Responsive Grid: Kiri Layanan KUA (8 Col) & Kanan Portal Berita (4 Col) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* KOLOM KIRI (8 Col): Menu Layanan Publik KUA */}
                    <div className="lg:col-span-8">
                      {/* Filter & Search Bar */}
                  <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-slate-100 pb-5">
                    <div className="border-l-4 border-primary pl-4">
                      <h2 className="font-display font-black text-xl md:text-2xl text-slate-800 tracking-tight">
                        Pilih Menu Layanan Publik
                      </h2>
                      <p className="text-xs md:text-sm text-slate-500 font-medium">
                        Ketuk salah satu layanan di bawah untuk melihat detail berkas & syarat resmi
                      </p>
                    </div>
                    
                    <div className="relative w-full md:w-80 max-w-md">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary w-4 h-4" />
                      <input 
                        type="text"
                        placeholder="Cari layanan KUA..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-sm font-medium text-slate-700"
                      />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 px-1 py-0.5"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Services Bento Grid */}
                  {filteredServices.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-sm">
                      <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                      <h3 className="font-display font-bold text-lg text-slate-800">Layanan tidak ditemukan</h3>
                      <p className="text-slate-500 text-sm mt-1 mb-4">
                        Maaf, kata kunci &quot;{searchQuery}&quot; tidak cocok dengan daftar layanan kami. Silakan gunakan kata kunci lain.
                      </p>
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition"
                      >
                        Tampilkan Semua Layanan
                      </button>
                    </div>
                  ) : (
                    <motion.div 
                      layout
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                    >
                      {filteredServices.map((service, index) => {
                        const IconComponent = IconMap[service.icon] || Info;
                        const isFormulir = service.id === 'formulir';
                        
                        return (
                          <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ y: -6, scale: 1.01 }}
                            onClick={() => handleServiceClick(service)}
                            className={`group cursor-pointer rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between border relative ${
                              isFormulir 
                                ? 'bg-gradient-to-br from-primary/5 via-white to-amber-50 hover:from-primary/10 hover:to-white border-amber-300/80 hover:border-amber-400 shadow-md shadow-amber-500/5 hover:shadow-xl' 
                                : 'bg-white border-slate-200 hover:border-primary shadow-sm hover:shadow-xl shadow-slate-100 hover:shadow-primary/5'
                            }`}
                          >
                            {/* Accent highlight bar for regular cards */}
                            {!isFormulir ? (
                              <div className="absolute top-0 left-6 right-6 h-[3px] bg-primary rounded-b-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                            ) : (
                              <span className="absolute -top-3 right-4 bg-secondary text-primary font-black text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md border border-secondary animate-pulse" style={{ animationDuration: '3s' }}>
                                Google Form Online
                              </span>
                            )}

                            <div>
                              {/* Icon Badge */}
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 ${
                                isFormulir
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-emerald-50 text-primary border border-emerald-100'
                              }`}>
                                <IconComponent className="w-6 h-6 shrink-0" />
                              </div>

                              {/* Title */}
                              <h3 className={`font-display font-black text-base md:text-lg mb-2 leading-snug group-hover:text-primary transition-colors ${
                                isFormulir ? 'text-slate-900' : 'text-slate-800'
                              }`}>
                                {service.title}
                              </h3>

                              {/* Description */}
                              <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-sans mb-6">
                                {service.description}
                              </p>
                            </div>

                            {/* Action Button Label */}
                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                              <span className={`text-xs font-bold uppercase tracking-wider ${
                                isFormulir ? 'text-amber-800 group-hover:text-primary' : 'text-slate-500 group-hover:text-primary'
                              }`}>
                                {isFormulir ? 'Pilih Formulir Nikah / Catin' : 'Lihat Syarat & Prosedur'}
                              </span>
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                                isFormulir
                                  ? 'bg-amber-200/60 text-amber-900 group-hover:bg-primary group-hover:text-white'
                                  : 'bg-slate-100 text-slate-500 group-hover:bg-primary group-hover:text-white'
                              }`}>
                                {isFormulir ? <ExternalLink className="w-3.5 h-3.5" /> : <ChevronRight className="w-4 h-4" />}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}

                  {/* Cost Disclaimer banner */}
                  <div className="mt-10 bg-emerald-50/60 border border-emerald-100 rounded-2xl p-5 flex flex-col md:flex-row items-center gap-4 justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/15 p-2.5 rounded-xl text-primary shrink-0">
                        <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                      </div>
                      <div>
                        <h4 className="font-display font-black text-slate-800 text-sm md:text-base">Seluruh Layanan Resmi KUA Rp 0,- (Gratis)</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                          Pernikahan di dalam Kantor KUA pada Hari & Jam Kerja adalah tanpa dipungut biaya. Biaya PNBP nikah di luar kantor/jam kerja adalah Rp 600.000 disetor langsung ke kas negara melalui bank.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* KOLOM KANAN (4 Col): Portal Berita & Kegiatan KUA */}
                <div className="lg:col-span-4 space-y-6">
                      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2.5 rounded-2xl text-primary">
                              <Newspaper className="w-6 h-6" />
                            </div>
                            <div>
                              <h2 className="font-display font-black text-lg md:text-xl text-slate-800 tracking-tight">
                                Berita &amp; Kegiatan
                              </h2>
                              <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5 mt-0.5">
                                <Cloud className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                                <span>Cloud Database Aktif</span>
                              </p>
                            </div>
                          </div>

                          {isAdmin && (
                            <button
                              onClick={handleOpenAddBerita}
                              className="bg-primary hover:bg-[#004f00] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all scale-100 hover:scale-105"
                              title="Tambah Berita Baru"
                            >
                              <Plus className="w-4 h-4 text-amber-300" />
                              <span>Tambah</span>
                            </button>
                          )}
                        </div>

                        {/* Admin mode active badge */}
                        {isAdmin && (
                          <div className="mb-5 bg-emerald-50 border border-emerald-300 rounded-2xl p-3.5 flex items-center justify-between text-xs shadow-sm">
                            <div className="flex items-center gap-2.5 text-emerald-900 font-bold">
                              <div className="bg-emerald-700 text-white p-1 rounded-lg">
                                <Lock className="w-3.5 h-3.5" />
                              </div>
                              <span>Mode Admin KUA Aktif</span>
                            </div>
                            <button
                              onClick={() => {
                                setIsAdmin(false);
                                triggerNotification("Anda telah keluar dari Mode Admin");
                              }}
                              className="text-red-600 hover:text-red-700 font-bold underline text-xs flex items-center gap-1"
                            >
                              <LogOut className="w-3.5 h-3.5" />
                              <span>Keluar</span>
                            </button>
                          </div>
                        )}

                        {/* Berita List */}
                        {beritaList.length === 0 ? (
                          <div className="text-center py-8 text-slate-400 text-sm">
                            Belum ada berita diterbitkan.
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {beritaList.map((berita) => (
                              <div
                                key={berita.id}
                                onClick={() => handleSelectBerita(berita)}
                                className="group border border-slate-200 hover:border-primary/50 rounded-2xl p-4 transition-all duration-200 hover:shadow-lg bg-stone-50/60 hover:bg-white cursor-pointer relative"
                              >
                                {/* Thumbnail + Category tag */}
                                <div className="relative h-44 w-full rounded-xl overflow-hidden mb-3.5 bg-slate-100 shadow-inner">
                                  <img
                                    src={berita.image}
                                    alt={berita.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute top-2.5 left-2.5 bg-primary/95 backdrop-blur-sm text-secondary text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md border border-secondary/30">
                                    {berita.category}
                                  </div>

                                  {/* Admin Action Buttons */}
                                  {isAdmin && (
                                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
                                      <button
                                        onClick={(e) => handleOpenEditBerita(berita, e)}
                                        className="bg-white hover:bg-emerald-50 text-emerald-900 p-2 rounded-xl shadow-lg border border-emerald-200 transition scale-100 hover:scale-110"
                                        title="Edit Berita"
                                      >
                                        <Edit3 className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={(e) => handleDeleteBerita(berita.id, e)}
                                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl shadow-lg border border-red-400 transition scale-100 hover:scale-110"
                                        title="Hapus Berita"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5 font-semibold">
                                  <Calendar className="w-3.5 h-3.5 text-primary" />
                                  <span>{berita.date}</span>
                                </div>

                                <h3 className="font-display font-black text-sm md:text-base text-slate-800 group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-2">
                                  {berita.title}
                                </h3>

                                <p className="text-xs text-slate-600 line-clamp-2 font-normal leading-relaxed mb-3">
                                  {berita.summary}
                                </p>

                                <div className="pt-2.5 border-t border-slate-100/80 flex items-center justify-between text-xs font-bold text-primary group-hover:text-emerald-800">
                                  <span>Baca Selengkapnya</span>
                                  <div className="bg-primary/10 group-hover:bg-primary group-hover:text-white p-1 rounded-lg transition">
                                    <ChevronRight className="w-4 h-4" />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: INFORMASI KUA (Bento Profile) */}
              {activeTab === 'informasi' && (
                <div className="space-y-6">
                  {/* Banner */}
                  <div className="bg-gradient-to-r from-primary via-[#044a04] to-primary text-white p-6 md:p-8 rounded-3xl border border-emerald-800/20 shadow-lg">
                    <h2 className="font-display font-extrabold text-2xl tracking-tight mb-2 flex items-center gap-2 text-secondary">
                      <Building2 className="w-6 h-6 text-secondary" /> Profil & Informasi KUA
                    </h2>
                    <p className="text-xs md:text-sm text-emerald-100/90 max-w-2xl font-light">
                      Mengenal lebih dekat Kantor Urusan Agama Kecamatan Seruyan Raya dalam melayani dan memberikan bimbingan keagamaan bagi masyarakat Kabupaten Seruyan.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left: Schedule & Info */}
                    <div className="md:col-span-2 space-y-6">
                      
                      {/* Visi Misi */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
                        <h3 className="font-display font-black text-lg text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                          <span className="w-2 h-5 bg-primary rounded-full inline-block" />
                          <span>Visi & Misi Kementerian Agama</span>
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <span className="font-display font-black text-xs text-primary uppercase tracking-wider block mb-1">Visi</span>
                            <p className="text-sm text-slate-600 leading-relaxed font-sans">
                              Kementerian Agama yang profesional dan andal dalam membangun masyarakat yang sholeh dan Sholehah, moderat, cerdas dan unggul untuk mewujudkan Indonesia maju yang berdaulat, mandiri, dan berkepribadian berdasarkan gotong royong.
                            </p>
                          </div>
                          <div>
                            <span className="font-display font-black text-xs text-primary uppercase tracking-wider block mb-1">Misi Layanan KUA</span>
                            <ul className="text-sm text-slate-600 space-y-2 list-disc pl-5 font-sans">
                              <li>Meningkatkan kualitas bimbingan keagamaan, kepenghuluan, dan keluarga sakinah.</li>
                              <li>Menyelenggarakan pelayanan administrasi pernikahan yang transparan, mudah, dan bebas pungli.</li>
                              <li>Meningkatkan partisipasi dan pemberdayaan ekonomi umat melalui zakat dan wakaf.</li>
                              <li>Memperkokoh kerukunan umat beragama yang moderat dan toleran di wilayah Seruyan Raya.</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Tugas Fungsi */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
                        <h3 className="font-display font-black text-lg text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                          <span className="w-2 h-5 bg-primary rounded-full inline-block" />
                          <span>Tugas & Fungsi Utama KUA</span>
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed font-sans mb-4">
                          Berdasarkan PMA No. 34 Tahun 2016, KUA memiliki tugas menyelenggarakan fungsi bimbingan masyarakat Islam dan pelayanan nikah rujuk di wilayah kerjanya. Fungsi pelayanan tersebut mencakup:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-slate-600 font-medium">
                          <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-150">
                            <span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>
                            <span>Pelayanan & Pencatatan Nikah/Rujuk</span>
                          </div>
                          <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-150">
                            <span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>
                            <span>Pembinaan Masjid & Keluarga Sakinah</span>
                          </div>
                          <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-150">
                            <span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>
                            <span>Pengelolaan Zakat, Wakaf & Ibadah Sosial</span>
                          </div>
                          <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-150">
                            <span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>
                            <span>Bimbingan Manasik Haji bagi Jemaah</span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Right Side: Jam Kerja & Statistik */}
                    <div className="space-y-6">
                      
                      {/* Jam Kerja */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-lg"></div>
                        <h3 className="font-display font-black text-lg text-slate-800 mb-4 flex items-center gap-2">
                          <Clock className="w-5 h-5 text-primary shrink-0" /> Jam Pelayanan
                        </h3>
                        
                        <div className="space-y-3 font-sans">
                          <div className="flex justify-between items-center py-2 border-b border-slate-100">
                            <span className="text-sm font-semibold text-slate-700">Senin - Kamis</span>
                            <span className="text-xs font-mono font-bold text-primary bg-emerald-50 px-2.5 py-1 rounded-lg">07:30 - 16:00 WIB</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-slate-100">
                            <span className="text-sm font-semibold text-slate-700">Jumat</span>
                            <span className="text-xs font-mono font-bold text-primary bg-emerald-50 px-2.5 py-1 rounded-lg">07:30 - 16:30 WIB</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm font-semibold text-slate-500">Sabtu & Minggu</span>
                            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">TUTUP / LIBUR</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm font-semibold text-slate-500">Hari Libur Nasional</span>
                            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">TUTUP / LIBUR</span>
                          </div>
                        </div>

                        <div className="mt-5 bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs text-amber-950 leading-relaxed font-medium">
                          <strong>Catatan Penting:</strong> Untuk akad nikah di luar kantor (luar balai nikah) tetap dapat dilayani pada hari Sabtu/Minggu atau Hari Libur Nasional sesuai kesepakatan dan jadwal Penghulu yang telah dikoordinasikan terlebih dahulu.
                        </div>
                      </div>

                      {/* Standar Layanan Kemenag */}
                      <div className="bg-gradient-to-br from-primary to-[#012801] text-white rounded-2xl p-6 shadow-md border border-emerald-800/10">
                        <h3 className="font-display font-black text-base mb-3 text-secondary">Moto Pelayanan</h3>
                        <blockquote className="border-l-2 border-secondary pl-3 italic text-xs leading-relaxed text-emerald-100 mb-4 font-sans">
                          &quot;IKHLAS BERAMAL: Melayani dengan integritas tinggi, senyuman hangat, dan ketegasan dalam keabsahan syariat serta administrasi negara.&quot;
                        </blockquote>
                        <div className="space-y-2 font-semibold">
                          <div className="flex items-center gap-2 text-xs text-emerald-200">
                            <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                            <span>100% Bebas Pungli & Gratifikasi</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-emerald-200">
                            <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                            <span>Keadilan & Kepastian Hukum</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: KONTAK KAMI */}
              {activeTab === 'kontak' && (
                <div className="space-y-6">
                  {/* Banner */}
                  <div className="bg-gradient-to-r from-primary via-[#044a04] to-primary text-white p-6 md:p-8 rounded-3xl border border-emerald-800/10 shadow-lg">
                    <h2 className="font-display font-extrabold text-2xl tracking-tight mb-2 flex items-center gap-2 text-secondary">
                      <Phone className="w-6 h-6 text-secondary" /> Kontak & Hubungi Kami
                    </h2>
                    <p className="text-xs md:text-sm text-emerald-100/90 max-w-2xl font-light">
                      Butuh bantuan, informasi tambahan, atau ingin berkonsultasi seputar pernikahan? Hubungi tim admin KUA Kecamatan Seruyan Raya secara langsung.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Form Kontak Hubungi */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
                      <h3 className="font-display font-black text-lg text-slate-800 mb-5 pb-2 border-b border-slate-100 flex items-center gap-2">
                        <span className="w-2 h-5 bg-primary rounded-full inline-block" />
                        <span>Kirim Pesan Cepat ke Admin</span>
                      </h3>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const nama = formData.get('nama') as string;
                        const isi = formData.get('pesan') as string;
                        if (!nama || !isi) return;
                        
                        // Open WhatsApp with text
                        const waText = `Halo Admin KUA Seruyan Raya, saya ${nama}. Ingin berkonsultasi mengenai: ${isi}`;
                        window.open(`https://wa.me/6285845239435?text=${encodeURIComponent(waText)}`, '_blank');
                        triggerNotification('Mengarahkan ke WhatsApp...');
                        (e.target as HTMLFormElement).reset();
                      }} className="space-y-4 font-sans text-sm">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Nama Lengkap</label>
                          <input 
                            name="nama"
                            type="text" 
                            required
                            placeholder="Contoh: Ahmad Fauzi" 
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Topik Konsultasi</label>
                          <textarea 
                            name="pesan"
                            rows={3}
                            required
                            placeholder="Tuliskan pertanyaan Anda secara detail di sini..." 
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all duration-200"
                          />
                        </div>
                        <button 
                          type="submit" 
                          className="w-full bg-primary hover:bg-[#004f00] text-white font-semibold px-5 py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/10"
                        >
                          <Send className="w-4 h-4" />
                          <span>Kirim via WhatsApp</span>
                        </button>
                      </form>
                    </div>

                    {/* Info Alamat KUA */}
                    <div className="space-y-6">
                      
                      {/* Informasi Lokasi */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                        <h3 className="font-display font-black text-lg text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
                          <span className="w-2 h-5 bg-primary rounded-full inline-block" />
                          <span>Detail Alamat & WhatsApp</span>
                        </h3>
                        
                        <div className="space-y-4 text-sm text-slate-600">
                          {/* Alamat Kantor as Clickable Google Maps Link */}
                          <a 
                            href="https://maps.app.goo.gl/b7Ryswg692gpymgi9?g_st=ac"
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex gap-3 hover:text-primary transition-colors cursor-pointer group/address"
                          >
                            <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5 group-hover/address:scale-110 transition-transform" />
                            <div>
                              <strong className="group-hover/address:underline">Alamat Kantor:</strong>
                              <p className="mt-1 leading-relaxed text-slate-500 text-xs md:text-sm font-medium group-hover/address:text-primary transition-colors">
                                Jl. Jenderal Sudirman Km.69 RT 004 RW 000 Desa Terawan Kec. Seruyan Raya Kab. Seruyan Prov. Kalimantan Tengah, 74260
                              </p>
                              <span className="text-[10px] text-primary font-bold mt-1 inline-block group-hover/address:underline">
                                Buka di Google Maps &rarr;
                              </span>
                            </div>
                          </a>
                          
                          <div className="flex gap-3">
                            <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <strong>Hubungi WhatsApp Layanan:</strong>
                              <p className="mt-1 text-slate-500 font-mono text-xs md:text-sm font-bold">
                                0858-4523-9435
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <strong>Konsultasi & Pengaduan:</strong>
                              <p className="mt-1 text-slate-500 text-xs md:text-sm font-medium">
                                Senin s.d Jumat, pukul 08:00 - 15:00 WIB
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Interactive WhatsApp Button */}
                        <div className="pt-2">
                          <a 
                            href="https://wa.me/6285845239435" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex justify-center items-center gap-2.5 bg-primary hover:bg-[#004f00] text-white font-bold py-3.5 px-4 rounded-xl text-center shadow-md transition-all duration-200"
                          >
                            <img 
                              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
                              alt="WhatsApp" 
                              className="w-5 h-5 filter invert-0"
                            />
                            <span>Hubungi WhatsApp Sekarang</span>
                          </a>
                        </div>
                      </div>

                      {/* Clickable Map Card */}
                      <a 
                        href="https://maps.app.goo.gl/b7Ryswg692gpymgi9?g_st=ac"
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm block hover:border-primary/60 hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-display font-black text-sm text-slate-800 group-hover:text-primary transition-colors">Lokasi Kantor KUA Seruyan Raya</h4>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex flex-col items-center justify-center text-center h-28 group-hover:bg-emerald-50 transition-colors">
                          <MapPin className="w-8 h-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold text-primary">Lihat Peta Lokasi KUA Seruyan Raya &rarr;</span>
                          <span className="text-[10px] text-slate-500 mt-1 font-medium">Kab. Seruyan, Kalimantan Tengah, Indonesia</span>
                        </div>
                      </a>

                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            /* LAYANAN DETAIL VIEW (Dynamic slide-in layout) */
            <motion.div
              key="detail-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm"
            >
              
              {/* Back CTA Button */}
              <button 
                onClick={() => setSelectedServiceId(null)}
                className="inline-flex items-center gap-2 text-primary hover:text-[#004f00] font-black text-sm transition-all duration-200 mb-6 bg-primary/10 hover:bg-primary/15 px-4 py-2.5 rounded-xl border border-primary/20 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Beranda</span>
              </button>

              {/* Service Title Area */}
              <div className="pb-6 border-b border-slate-100 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                    Detail Persyaratan Layanan KUA
                  </span>
                  <h2 className="font-display font-black text-2xl md:text-3xl text-slate-800 tracking-tight leading-none mt-1">
                    {selectedService?.title}
                  </h2>
                </div>
                
                {/* Cost Flag */}
                <div className="bg-secondary/20 text-primary border border-secondary/40 rounded-2xl px-5 py-3 text-center shrink-0 w-full md:w-auto">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-primary font-black">Biaya Layanan Resmi</span>
                  <span className="font-display font-extrabold text-sm md:text-base">Gratis (Rp 0,-) di Kantor KUA</span>
                </div>
              </div>

              {/* Detail Sections layout */}
              <div className="space-y-8 font-sans">
                
                {/* Section 1: Persyaratan Umum */}
                {selectedService?.details?.syarat && (
                  <div className="bg-slate-50 border border-slate-150 rounded-2xl p-6 shadow-sm">
                    <h4 className="font-display font-extrabold text-base md:text-lg text-emerald-900 mb-4 flex items-center gap-2.5 pb-2 border-b border-emerald-900/5">
                      <div className="w-2.5 h-5 bg-emerald-600 rounded-full shrink-0" />
                      <span>1. Persyaratan Umum & Berkas Utama</span>
                    </h4>
                    <div 
                      className="prose prose-sm text-slate-600 leading-relaxed max-w-none text-xs md:text-sm pl-4 pr-2 select-text"
                      dangerouslySetInnerHTML={{ __html: selectedService.details.syarat }}
                    />
                  </div>
                )}

                {/* Section 2: Persyaratan Khusus/Tambahan */}
                {selectedService?.details?.syarat_khusus && (
                  <div className="bg-amber-50/40 border border-amber-200/55 rounded-2xl p-6 shadow-sm">
                    <h4 className="font-display font-extrabold text-base md:text-lg text-amber-900 mb-4 flex items-center gap-2.5 pb-2 border-b border-amber-800/10">
                      <div className="w-2.5 h-5 bg-amber-500 rounded-full shrink-0" />
                      <span>2. Persyaratan Khusus & Pendukung (Jika Terkait)</span>
                    </h4>
                    <div 
                      className="prose prose-sm text-slate-600 leading-relaxed max-w-none text-xs md:text-sm pl-4 pr-2 select-text"
                      dangerouslySetInnerHTML={{ __html: selectedService.details.syarat_khusus }}
                    />
                  </div>
                )}

                {/* Section 3: Prosedur */}
                {selectedService?.details?.prosedur && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h4 className="font-display font-extrabold text-base md:text-lg text-emerald-900 mb-4 flex items-center gap-2.5 pb-2 border-b border-emerald-900/5">
                      <div className="w-2.5 h-5 bg-teal-600 rounded-full shrink-0" />
                      <span>3. Alur & Prosedur Pengurusan</span>
                    </h4>
                    <div 
                      className="prose prose-sm text-slate-600 leading-relaxed max-w-none text-xs md:text-sm pl-4 pr-2 select-text"
                      dangerouslySetInnerHTML={{ __html: selectedService.details.prosedur }}
                    />
                  </div>
                )}

                {/* Section 4: Biaya Terperinci */}
                {selectedService?.details?.biaya && (
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 shadow-sm">
                    <h4 className="font-display font-extrabold text-base md:text-lg text-emerald-900 mb-3 flex items-center gap-2.5">
                      <div className="w-2.5 h-5 bg-emerald-600 rounded-full shrink-0" />
                      <span>4. Ketentuan Biaya Layanan Resmi</span>
                    </h4>
                    <p 
                      className="text-xs md:text-sm text-slate-600 leading-relaxed select-text"
                      dangerouslySetInnerHTML={{ __html: selectedService.details.biaya }}
                    />
                  </div>
                )}

                {/* Section 5: FAQ & Tanya Jawab */}
                {selectedService?.details?.faq && selectedService.details.faq.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h4 className="font-display font-extrabold text-base md:text-lg text-slate-800 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
                      <HelpCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>Tanya Jawab Seputar Layanan ({selectedService.title})</span>
                    </h4>
                    
                    <div className="space-y-3 mt-4">
                      {selectedService.details.faq.map((faqItem, idx) => {
                        const isExpanded = expandedFaqIndex === idx;
                        return (
                          <div 
                            key={idx} 
                            className="border border-slate-150 rounded-xl overflow-hidden transition-colors"
                          >
                            <button
                              onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                              className="w-full text-left px-4 py-3.5 bg-slate-50 hover:bg-slate-100/80 transition flex justify-between items-center gap-3"
                            >
                              <span className="font-bold text-xs md:text-sm text-slate-800 font-sans flex items-center gap-2">
                                <span className="text-emerald-600 text-xs font-mono">Q.</span> {faqItem.question}
                              </span>
                              <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90 text-emerald-600' : ''}`} />
                            </button>
                            
                            <AnimatePresence initial={false}>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-4 bg-white border-t border-slate-100 text-xs md:text-sm text-slate-500 leading-relaxed font-sans">
                                    {faqItem.answer}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>

              {/* Detail Back CTA Button in bottom */}
              <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-center">
                <button 
                  onClick={() => setSelectedServiceId(null)}
                  className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 font-semibold text-xs md:text-sm transition duration-150"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali ke Beranda</span>
                </button>
                
                <a 
                  href="https://wa.me/6285845239435" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs md:text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow transition-all duration-200"
                >
                  <Send className="w-4 h-4" />
                  <span>Konsultasi Syarat</span>
                </a>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-4 border-t-4 border-secondary font-sans mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="font-display font-black text-base md:text-lg text-white tracking-tight uppercase">
              KUA KECAMATAN SERUYAN RAYA
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Sistem Informasi Pelayanan & Persyaratan Nikah Digital Utama
            </div>
            <div className="text-[10px] text-secondary/80 mt-1.5 tracking-wider uppercase font-mono font-bold">
              Kementerian Agama Republik Indonesia &copy; 2026
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3.5 text-xs font-bold uppercase tracking-wider">
            <button onClick={() => { setActiveTab('beranda'); setSelectedServiceId(null); }} className="hover:text-secondary transition-colors cursor-pointer">Beranda</button>
            <span className="text-slate-700">|</span>
            <button onClick={() => { setIsFormulirModalOpen(true); }} className="hover:text-secondary transition-colors text-amber-300 cursor-pointer">Pilih Formulir</button>
            <span className="text-slate-700">|</span>
            <button onClick={() => { setActiveTab('informasi'); setSelectedServiceId(null); }} className="hover:text-secondary transition-colors cursor-pointer">Informasi KUA</button>
            <span className="text-slate-700">|</span>
            <button onClick={() => { setActiveTab('kontak'); setSelectedServiceId(null); }} className="hover:text-secondary transition-colors cursor-pointer">Kontak</button>
          </div>
        </div>
      </footer>

      {/* DIALOG/MODAL: PILIH FORMULIR ONLINE */}
      <AnimatePresence>
        {isFormulirModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormulirModalOpen(false)}
              className="absolute inset-0 bg-slate-900"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl border border-slate-100 z-10 max-h-[90vh] overflow-y-auto"
            >
              
              {/* Close Button */}
              <button 
                onClick={() => setIsFormulirModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="font-sans text-slate-700">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mb-4 text-amber-800 border border-amber-200 shadow-inner">
                  <FileText className="w-6 h-6 shrink-0" />
                </div>
                
                <h3 className="font-display font-extrabold text-xl md:text-2xl text-slate-800 tracking-tight leading-snug mb-1">
                  Pilih Formulir Online KUA Seruyan Raya
                </h3>
                
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed mb-6">
                  Silakan pilih formulir pendaftaran nikah atau pengajuan surat pemeriksaan kesehatan Catin di bawah ini untuk pengisian secara langsung:
                </p>

                {/* 3 Main Google Forms */}
                <div className="space-y-4 mb-6">
                  {FORMULIR_LINKS.map((form) => {
                    const FormIcon = form.icon;
                    return (
                      <div 
                        key={form.id}
                        className="bg-slate-50 hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 rounded-2xl p-4 md:p-5 transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
                      >
                        <div className="flex items-start gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-white transition-colors">
                            <FormIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="inline-block text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md uppercase tracking-wider mb-1">
                              {form.badge}
                            </span>
                            <h4 className="font-display font-bold text-sm md:text-base text-slate-800 leading-snug group-hover:text-primary transition-colors">
                              {form.title}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                              {form.description}
                            </p>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleOpenFormUrl(form.url, form.title)}
                          className="w-full md:w-auto bg-primary hover:bg-[#004f00] text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shrink-0 shadow-md transition-all cursor-pointer"
                        >
                          <span>Buka Formulir</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* CTAs */}
                <div className="flex justify-end pt-2 border-t border-slate-100">
                  <button 
                    onClick={() => setIsFormulirModalOpen(false)}
                    className="text-xs text-slate-500 hover:text-slate-700 font-bold px-4 py-2 rounded-xl"
                  >
                    Tutup
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DIALOG/MODAL: LOGIN ADMIN KUA */}
      <AnimatePresence>
        {isAdminLoginModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdminLoginModalOpen(false)}
              className="absolute inset-0 bg-slate-900"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-100"
            >
              <div className="bg-gradient-to-r from-primary via-[#044a04] to-primary p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2.5 rounded-2xl">
                    <KeyRound className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-lg text-white">Login Admin KUA</h3>
                    <p className="text-xs text-emerald-100/90 font-medium">Pengelolaan Berita &amp; Konten Resmi</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAdminLoginModalOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAdminLogin} className="p-6 space-y-4">
                {loginError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-900 font-medium flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-primary">Info Kredensial Default:</span>
                    <span>Username: <b>admin</b> | Kode Admin: <b>admin123</b></span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Username Admin
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text"
                      placeholder="admin"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Kode Admin / Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="password"
                      placeholder="••••••••"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={() => setIsAdminLoginModalOpen(false)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-700 px-4 py-2.5 rounded-xl"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="bg-primary hover:bg-[#004f00] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition"
                  >
                    Masuk Admin
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DIALOG/MODAL: KELOLA BERITA (TAMBAH / EDIT) */}
      <AnimatePresence>
        {isBeritaFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBeritaFormOpen(false)}
              className="absolute inset-0 bg-slate-900"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-100 max-h-[90vh] flex flex-col"
            >
              <div className="bg-gradient-to-r from-primary via-[#044a04] to-primary p-6 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2.5 rounded-2xl">
                    <Newspaper className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-lg text-white">
                      {editingBerita ? 'Edit Berita KUA' : 'Tambah Berita Baru'}
                    </h3>
                    <p className="text-xs text-emerald-100/90 font-medium">
                      Publikasi berita kegiatan atau informasi layanan KUA
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsBeritaFormOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveBerita} className="p-6 space-y-4 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Judul Berita *
                    </label>
                    <input 
                      type="text"
                      placeholder="Contoh: Kegiatan Bimbingan Perkawinan..."
                      value={formBeritaTitle}
                      onChange={(e) => setFormBeritaTitle(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Kategori Berita *
                    </label>
                    <select
                      value={formBeritaCategory}
                      onChange={(e) => setFormBeritaCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-semibold bg-white"
                    >
                      <option value="Kegiatan KUA">Kegiatan KUA</option>
                      <option value="Layanan & Inovasi">Layanan &amp; Inovasi</option>
                      <option value="Bimbingan Masyarakat">Bimbingan Masyarakat</option>
                      <option value="Pengumuman KUA">Pengumuman KUA</option>
                      <option value="Artikel Agama">Artikel Agama</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tanggal Publikasi (Opsional)
                  </label>
                  <input 
                    type="text"
                    placeholder="Contoh: 02 Agustus 2026"
                    value={formBeritaDate}
                    onChange={(e) => setFormBeritaDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>

                {/* Foto Berita (File Upload or URL) */}
                <div className="bg-stone-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                    Foto Berita (Upload File atau URL)
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div>
                      <label className="block text-[11px] font-bold text-primary mb-1 flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>1. Upload File Foto dari HP / PC</span>
                      </label>
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-900 hover:file:bg-emerald-200 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>2. Atau Masukkan URL Foto</span>
                      </label>
                      <input 
                        type="text"
                        placeholder="https://..."
                        value={formBeritaImage}
                        onChange={(e) => setFormBeritaImage(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Image Preview */}
                  {formBeritaImage && (
                    <div className="mt-2 flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200">
                      <img 
                        src={formBeritaImage} 
                        alt="Preview" 
                        className="w-16 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                      />
                      <span className="text-xs text-slate-500 font-medium truncate">
                        Foto siap ditampilkan pada berita
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Ringkasan Singkat (Muncul di Kartu Beranda) *
                  </label>
                  <textarea 
                    rows={2}
                    placeholder="Tuliskan ringkasan 2-3 kalimat seputar berita ini..."
                    value={formBeritaSummary}
                    onChange={(e) => setFormBeritaSummary(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Isi Berita Lengkap *
                  </label>
                  <textarea 
                    rows={5}
                    placeholder="Tuliskan isi berita selengkapnya..."
                    value={formBeritaContent}
                    onChange={(e) => setFormBeritaContent(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm leading-relaxed"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={() => setIsBeritaFormOpen(false)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-700 px-4 py-2.5 rounded-xl"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="bg-primary hover:bg-[#004f00] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition"
                  >
                    {editingBerita ? 'Simpan Perubahan' : 'Terbitkan Berita'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
