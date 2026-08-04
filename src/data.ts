import { LayananItem, AppConfig, BeritaItem } from "./types";

export const DEFAULT_CONFIG: AppConfig = {
  googleFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfwO3v_00Kq8r9b0m9r218K-uA_FormPendaftaranNikahKUA/viewform",
  simkahUrl: "https://simkah4.kemenag.go.id/",
  whatsappNumber: "085845239435",
  alamatKua: "Jl. Jenderal Sudirman, Seruyan Raya, Kabupaten Seruyan, Kalimantan Tengah"
};

export const DEFAULT_BERITA: BeritaItem[] = [
  {
    id: "berita-1",
    title: "Kegiatan Bimbingan Perkawinan (Bimwin) Calon Pengantin di KUA Seruyan Raya",
    date: "01 Agustus 2026",
    category: "Kegiatan KUA",
    image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=800&q=80",
    summary: "KUA Seruyan Raya kembali menyelenggarakan Bimbingan Perkawinan bagi calon pengantin guna mewujudkan keluarga sakinah, mawaddah, dan rahmah.",
    content: "Kantor Urusan Agama (KUA) Kecamatan Seruyan Raya sukses melaksanakan program Bimbingan Perkawinan (Bimwin) bagi para calon pengantin yang akan melangsungkan pernikahan. Kegiatan ini bertujuan memberikan pembekalan ilmu berumahtangga, pemahaman hak dan kewajiban suami istri, kesehatan reproduksi, serta upaya pencegahan stunting melalui sertifikasi Elsimil.\n\nKepala KUA Seruyan Raya menyampaikan bahwa bimbingan perkawinan merupakan langkah strategis dari Kementerian Agama agar pasangan calon pengantin memiliki kesiapan mental dan spiritual yang matang sebelum mengarungi kehidupan berumahtangga."
  },
  {
    id: "berita-2",
    title: "Sosialisasi Layanan Digital & Pendaftaran Nikah Online Melalui SIMKAH",
    date: "25 Juli 2026",
    category: "Layanan & Inovasi",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
    summary: "Kepala KUA Seruyan Raya mensosialisasikan kemudahan pendaftaran kehendak nikah secara online melalui situs SIMKAH Kementerian Agama RI.",
    content: "Dalam upaya meningkatkan mutu layanan kepada masyarakat, KUA Seruyan Raya terus mensosialisasikan pemanfaatan Sistem Informasi Manajemen Nikah (SIMKAH) Web yang dapat diakses melalui portal resmi simkah4.kemenag.go.id.\n\nMelalui layanan ini, masyarakat Kabupaten Seruyan khususnya Kecamatan Seruyan Raya dapat melakukan pendaftaran kehendak nikah dari rumah, mengecek ketersediaan jadwal penghulu, serta memantau status validasi berkas secara transparan, mudah, dan akuntabel."
  },
  {
    id: "berita-3",
    title: "Pelayanan Konsultasi Keluarga Sakinah dan Bimbingan Perwakafan",
    date: "15 Juli 2026",
    category: "Bimbingan Masyarakat",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
    summary: "KUA Seruyan Raya membuka layanan konsultasi keluarga sakinah serta bimbingan perwakafan tanah bagi masyarakat di Kabupaten Seruyan.",
    content: "Selain pelayanan pernikahan dan rujuk, KUA Seruyan Raya juga aktif melayani masyarakat dalam bidang bimbingan keluarga sakinah, konsultasi keagamaan, serta pengurusan Akta Ikrar Wakaf (AIW).\n\nMasyarakat yang ingin mengikrarkan tanah wakaf untuk masjid, musala, sarana pendidikan, maupun kepentingan umat lainnya dapat berkonsultasi langsung di Kantor KUA Seruyan Raya tanpa dipungut biaya (gratis)."
  }
];

export function getBeritaList(): BeritaItem[] {
  try {
    const saved = localStorage.getItem("kua_seruyan_raya_berita");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error loading berita from localStorage", e);
  }
  return DEFAULT_BERITA;
}

export function saveBeritaList(list: BeritaItem[]): void {
  try {
    localStorage.setItem("kua_seruyan_raya_berita", JSON.stringify(list));
  } catch (e) {
    console.error("Error saving berita to localStorage", e);
  }
}

export const DATA_LAYANAN: LayananItem[] = [
  {
    id: "nikah",
    title: "Pendaftaran Kehendak Nikah",
    description: "Pendaftaran pernikahan yang dilakukan di wilayah KUA Seruyan Raya atau secara online melalui sistem SIMKAH.",
    icon: "HeartPulse",
    syarat: `
      <ul class="list-disc pl-5 space-y-2">
        <li>Masing-masing Calon Suami & Calon Istri Melampirkan Surat Pengantar Nikah (N1, N2, N3, N4, N5, N6) dari Kantor Desa, Sesuai Alamat KTP dan KK, Dan Ditanda Tangani Kelurahan atau Kepala Desa.</li>
        <li>Fotocopy KTP Elektronik Calon Suami & Calon Istri.</li>
        <li>Fotocopy KK (Kartu Keluarga) Calon Suami & Calon Istri.</li>
        <li>Fotocopy KTP Bapak dan Ibu dari Calon Suami dan Calon Istri.</li>
        <li>Fotocopy Akta Kelahiran Calon Suami & Calon Istri.</li>
        <li>Fotocopy Ijazah Terakhir Calon Suami & Calon Istri.</li>
        <li>Fotocopy KTP Wali Nikah, <span class="italic text-amber-600 font-medium">jika Wali Nasab Bukan Ayah Kandung</span>.</li>
        <li>Fotocopy KTP 2 Orang Saksi Nikah (Saksi I dan Saksi II).</li>
        <li>Pas Foto Calon Suami & Calon Istri dengan latar belakang <strong>Warna Biru</strong>:
          <ul class="list-circle pl-5 mt-1 space-y-1">
            <li>Ukuran 2x3 : masing-masing 4/5 Lembar</li>
            <li>Ukuran 4x6 : masing-masing 2 Lembar</li>
          </ul>
        </li>
        <li>Surat Keterangan Imunisasi / Tetanus Toksoid (TT) bagi Catin Perempuan dari Puskesmas/fasilitas kesehatan.</li>
        <li>Melampirkan Surat Rekomendasi Nikah dari KUA Setempat, <span class="italic text-amber-600">apabila salah satu calon tempat tinggalnya Berbeda Kecamatan/Kabupaten/Provinsi</span>.</li>
        <li>Sertifikat Elsimil (aplikasi pencegahan stunting) bagi catin perempuan.</li>
        <li>Sertifikat Bimbingan Perkawinan (didapat setelah mengikuti Bimbingan Perkawinan).</li>
      </ul>
    `,
    syarat_khusus: `
      <ul class="list-disc pl-5 space-y-2">
        <li>Melampirkan Surat Dispensasi dari Kecamatan apabila mendaftar kurang dari 10 hari kerja dari tanggal akad nikah.</li>
        <li>Surat Keterangan Belum Menikah dari Desa/Lurah setempat.</li>
        <li>Surat Keterangan Izin Wali / Taukil Wali Nikah (<span class="italic text-amber-600">jika Wali Nasab tidak bisa hadir secara fisik pada akad</span>).</li>
        <li>Melampirkan Surat Dispensasi / Izin menikah dari Pengadilan Agama, apabila usia calon suami atau calon istri belum mencukupi batas minimal undang-undang (19 tahun).</li>
        <li>Melampirkan Surat Keterangan Kematian (N6) yang Asli dari Kantor Dinas Catatan Sipil atau Kantor Desa, apabila Suami/Istri terdahulu meninggal dunia (status Duda/Janda Mati).</li>
        <li>Melampirkan Akta Cerai asli dari Pengadilan Agama, apabila berstatus Duda atau Janda Cerai Hidup.</li>
        <li>Melampirkan Surat Izin dari Atasan atau Kesatuan bagi catin berstatus anggota TNI/POLRI.</li>
        <li>Fotocopy Piagam masuk Agama Islam bagi Calon Pengantin yang Mualaf.</li>
      </ul>
    `,
    prosedur: `
      <ol class="list-decimal pl-5 space-y-2">
        <li>Pastikan seluruh berkas persyaratan telah lengkap, ditandatangani, dan dimasukkan ke dalam <strong>Map Hijau</strong>.</li>
        <li>Calon pengantin dan Wali datang langsung ke kantor KUA Seruyan Raya membawa berkas persyaratan fisik tersebut pada hari dan jam kerja (disarankan maksimal 15 hari kerja sebelum akad nikah).</li>
        <li>Setiba di KUA, silakan mengisi Buku Tamu digital/manual yang disediakan.</li>
        <li>Pemeriksaan Pernikahan (Verifikasi Dokumen) terhadap calon suami, calon istri, dan wali nikah oleh Penghulu KUA Kecamatan Seruyan Raya.</li>
        <li>Mengikuti program Bimbingan Perkawinan (Binwin) sesuai jadwal yang telah ditentukan oleh pelaksana KUA.</li>
        <li>Melakukan penyetoran biaya nikah (jika pernikahan dilaksanakan di luar kantor atau di luar hari/jam kerja).</li>
      </ol>
    `,
    biaya: "Rp 0 (Gratis) jika dilaksanakan di Kantor KUA pada hari & jam kerja resmi. Apabila nikah dilaksanakan di luar kantor KUA atau di luar jam kerja resmi, dikenakan biaya PNBP sebesar Rp 600.000 yang disetorkan langsung ke Kas Negara melalui Bank/Kantor Pos.",
    faq: [
      {
        q: "Siapa saja yang wajib hadir saat proses pendaftaran di KUA?",
        a: "Pendaftaran sebaiknya dihadiri oleh kedua calon pengantin untuk keperluan verifikasi berkas, wawancara singkat (pemeriksaan nikah), serta penentuan jadwal bimbingan perkawinan."
      },
      {
        q: "Apakah pendaftaran bisa dilakukan secara online?",
        a: "Ya, pendaftaran kehendak nikah secara online mandiri dapat dilakukan melalui portal resmi SIMKAH Kemenag (SIMKAH Gen 4). Namun, setelah mendaftar online, berkas fisik asli tetap wajib diserahkan ke KUA untuk diverifikasi oleh Penghulu."
      },
      {
        q: "Apakah Bimbingan Perkawinan (Binwin) wajib diikuti?",
        a: "Ya, Bimbingan Perkawinan sangat penting dan wajib diikuti sebagai bekal bepergian mengarungi bahtera rumah tangga, guna mewujudkan keluarga yang sakinah, mawaddah, dan warahmah, serta mencegah stunting dan perceraian dini."
      },
      {
        q: "Bagaimana jika pendaftaran dilakukan kurang dari 10 hari kerja sebelum nikah?",
        a: "Catin harus melampirkan Surat Dispensasi Nikah yang dikeluarkan oleh Camat setempat yang menyatakan alasan mendesak/penting pernikahan tersebut dilangsungkan kurang dari 10 hari kerja."
      }
    ]
  },
  {
    id: "rekomendasi",
    title: "Rekomendasi Nikah",
    description: "Surat pengantar rekomendasi yang diberikan kepada warga Seruyan Raya yang hendak melangsungkan pernikahan di luar wilayah hukum KUA Seruyan Raya.",
    icon: "FileShield",
    syarat: `
      <ul class="list-disc pl-5 space-y-2">
        <li>Pemohon melampirkan Persyaratan Nikah lengkap dari Kantor Desa asal di wilayah Kecamatan Seruyan Raya (N1, N2, N3, N4, N5, N6) yang ditandatangani Kepala Desa atau Lurah.</li>
        <li>Fotocopy KTP Elektronik Pemohon dan Calon Pasangan.</li>
        <li>Fotocopy Kartu Keluarga (KK) Pemohon dan Calon Pasangan.</li>
        <li>Mencatat dengan jelas di kertas alamat lengkap lokasi KUA tujuan pernikahan:
          <ul class="list-circle pl-5 mt-1 space-y-1 font-medium">
            <li>Provinsi Tujuan</li>
            <li>Kabupaten/Kota Tujuan</li>
            <li>Kecamatan Tujuan (KUA Tujuan)</li>
          </ul>
        </li>
      </ul>
    `,
    syarat_khusus: `
      <ul class="list-disc pl-5 space-y-2">
        <li>Melampirkan Surat Keterangan Kematian (N6) yang asli/fotocopy dari Dinas Dukcapil atau Kantor Desa jika pemohon berstatus cerai mati.</li>
        <li>Melampirkan Akta Cerai asli dari Pengadilan Agama jika berstatus cerai hidup.</li>
        <li>Melampirkan Surat Izin dari atasan/kesatuan bagi pemohon yang merupakan anggota aktif TNI/POLRI.</li>
      </ul>
    `,
    prosedur: `
      <ol class="list-decimal pl-5 space-y-2">
        <li>Pastikan semua berkas persyaratan dari desa sudah lengkap, bertandatangan, dan dimasukkan ke dalam map rapi.</li>
        <li>Datang ke Kantor KUA Kecamatan Seruyan Raya pada hari kerja (Senin - Jumat) sebelum pukul 15.00 WIB.</li>
        <li>Mengisi buku kunjungan layanan di KUA.</li>
        <li>Menyerahkan berkas ke petugas layanan untuk diverifikasi keaslian dan kelengkapannya.</li>
        <li>Petugas memproses dan mencetak Surat Rekomendasi Nikah resmi yang ditandatangani Kepala KUA untuk dibawa ke KUA tujuan nikah.</li>
      </ol>
    `,
    biaya: "Rp 0 (Gratis) - Seluruh proses pembuatan surat rekomendasi nikah di KUA Seruyan Raya sama sekali tidak dipungut biaya apapun.",
    faq: [
      {
        q: "Apakah calon pengantin pria wajib mengurus surat rekomendasi nikah?",
        a: "Ya, apabila calon pengantin pria bertempat tinggal di Seruyan Raya namun akan melaksanakan akad nikah di luar wilayah Kecamatan Seruyan Raya (misalnya di kediaman mempelai wanita di kecamatan atau kota lain)."
      },
      {
        q: "Berapa lama masa berlaku Surat Rekomendasi Nikah?",
        a: "Rekomendasi nikah berlaku selama belum dilangsungkan pernikahan, namun sangat dianjurkan untuk segera menyerahkannya ke KUA tujuan nikah selambat-lambatnya 10 hari kerja sebelum pelaksanaan akad."
      },
      {
        q: "Bolehkah pengurusan surat rekomendasi ini diwakilkan?",
        a: "Sebaiknya diurus langsung oleh yang bersangkutan, namun jika berhalangan karena jarak atau pekerjaan, dapat diwakilkan oleh keluarga kandung (orang tua, kakak, adik) dengan membawa dokumen identitas lengkap."
      }
    ]
  },
  {
    id: "taukil",
    title: "Taukil Wali Nikah",
    description: "Pelimpahan wewenang dari wali nasab sah kepada orang lain atau Penghulu untuk mewakili menikahkan calon pengantin wanita karena wali berhalangan hadir.",
    icon: "UserCheck",
    syarat: `
      <ul class="list-disc pl-5 space-y-2">
        <li>Fotocopy KTP Elektronik Wali Nikah yang sah.</li>
        <li>Fotocopy KTP Elektronik Calon Pengantin Wanita dan Calon Pengantin Pria.</li>
        <li>Fotocopy Kartu Keluarga (KK) dan Akta Kelahiran Calon Pengantin Wanita (untuk memverifikasi urutan kedudukan wali nasab).</li>
        <li>Menyiapkan 1 (satu) lembar Meterai Rp 10.000 untuk surat pernyataan pelimpahan.</li>
      </ul>
    `,
    syarat_khusus: `
      <ul class="list-disc pl-5 space-y-2">
        <li>Surat keterangan tertulis alasan berhalangan hadir dari instansi berwenang/Desa, apabila Wali berada di tempat yang sangat jauh (luar kota/luar pulau/luar negeri) atau sakit parah.</li>
        <li>Jika Wali berada di luar kota dan tidak bisa datang sama sekali, maka wajib mengurus Surat Taukil Wali dari KUA domisili Wali berada terlebih dahulu.</li>
      </ul>
    `,
    prosedur: `
      <ol class="list-decimal pl-5 space-y-2">
        <li>Wali nasab yang sah bersama calon pengantin wanita mendatangi Kantor KUA Seruyan Raya membawa berkas persyaratan.</li>
        <li>Wali menyatakan kehendak untuk melimpahkan wewenang wali nikah kepada Penghulu/Kepala KUA secara lisan dan tertulis.</li>
        <li>Kepala KUA melakukan pemeriksaan identitas Wali serta kesesuaian hubungan nasab.</li>
        <li>Wali menandatangani Akta/Surat Pernyataan Taukil Wali Nikah di hadapan Kepala KUA/Penghulu dan saksi-saksi.</li>
      </ol>
    `,
    biaya: "Rp 0 (Gratis) - Layanan ikrar dan administrasi Taukil Wali Nikah di kantor KUA tidak dipungut biaya.",
    faq: [
      {
        q: "Kapan Taukil Wali Nikah ini wajib dilakukan?",
        a: "Ketika wali nasab terdekat yang sah (misal: Ayah Kandung) secara hukum sehat dan ada, namun berhalangan hadir secara fisik saat akad nikah dilangsungkan (misal karena tugas luar kota, sakit keras, atau bermukim di daerah lain)."
      },
      {
        q: "Bagaimana jika ayah kandung sudah meninggal dunia?",
        a: "Jika ayah kandung meninggal dunia, kedudukan wali berpindah secara berurutan sesuai syariat (Kakek, saudara laki-laki sekandung, dst). Taukil Wali hanya diperlukan jika wali pengganti tersebut juga berhalangan hadir saat akad nikah."
      }
    ]
  },
  {
    id: "duplikat",
    title: "Buku Nikah Pengganti (Duplikat)",
    description: "Penerbitan Buku Nikah pengganti resmi bagi pasangan suami istri yang Buku Nikah aslinya mengalami kerusakan fisik berat atau hilang.",
    icon: "FileCirclePlus",
    syarat: `
      <ul class="list-disc pl-5 space-y-2">
        <li><strong>Surat Keterangan Kehilangan</strong> resmi dari Kepolisian setempat (jika Buku Nikah Hilang).</li>
        <li>Membawa fisik Buku Nikah yang rusak (jika statusnya Buku Nikah Rusak).</li>
        <li>Fotocopy KTP Elektronik Suami & Istri.</li>
        <li>Fotocopy Kartu Keluarga (KK) Suami & Istri.</li>
        <li>Pas Foto berwarna terbaru Suami & Istri ukuran 2x3 dengan latar belakang <strong>warna biru</strong> (masing-masing 2 lembar).</li>
      </ul>
    `,
    syarat_khusus: `
      <ul class="list-disc pl-5 space-y-2">
        <li>Sangat disarankan melampirkan fotocopy Buku Nikah terdahulu atau mencatat nomor akta nikah dan tanggal pernikahan untuk memudahkan pencarian data pada buku register KUA Seruyan Raya.</li>
      </ul>
    `,
    prosedur: `
      <ol class="list-decimal pl-5 space-y-2">
        <li>Pemohon datang langsung ke Kantor KUA tempat pernikahan dahulu dilangsungkan (KUA Seruyan Raya) dengan membawa dokumen persyaratan di atas.</li>
        <li>Petugas KUA melakukan verifikasi berkas dan pencarian data pernikahan pada Buku Register Nikah (Model N) atau database SIMKAH.</li>
        <li>Setelah data dipastikan valid dan terdaftar, petugas memproses pencetakan Duplikat Buku Nikah resmi.</li>
        <li>Kepala KUA menandatangani Duplikat Buku Nikah pengganti tersebut dan diserahkan kepada pemohon.</li>
      </ol>
    `,
    biaya: "Rp 0 (Gratis) - Berdasarkan peraturan Kementerian Agama, penerbitan Duplikat Buku Nikah karena hilang atau rusak tidak dikenakan biaya sama sekali.",
    faq: [
      {
        q: "Apakah bisa mengurus Duplikat Buku Nikah jika dahulu menikahnya di KUA luar daerah?",
        a: "Tidak bisa. Duplikat Buku Nikah wajib diterbitkan oleh KUA yang mencatat pernikahan tersebut dahulu, karena seluruh arsip register fisik tersimpan secara aman di KUA asal."
      },
      {
        q: "Bolehkah hanya salah satu (suami atau istri saja) yang datang mengurus?",
        a: "Boleh. Salah satu pihak (suami atau istri) dapat mengurusnya ke KUA asalkan dokumen persyaratan yang dibawa lengkap, termasuk surat kehilangan dari kepolisian atas nama pemilik dokumen."
      }
    ]
  },
  {
    id: "legalisir",
    title: "Legalisasi Buku Nikah",
    description: "Pengesahan salinan/fotocopy Buku Nikah oleh KUA Seruyan Raya guna menjamin keaslian dokumen untuk keperluan administrasi negara lainnya.",
    icon: "FileSignature",
    syarat: `
      <ul class="list-disc pl-5 space-y-2">
        <li>Membawa dokumen <strong>Buku Nikah Asli</strong> (Suami dan Istri).</li>
        <li>Fotocopy Buku Nikah lembar halaman pertama, lembar foto, dan halaman data akad (biasanya sebanyak 5 - 10 lembar sesuai kebutuhan).</li>
        <li>Fotocopy KTP Pemohon yang masih berlaku.</li>
      </ul>
    `,
    syarat_khusus: `
      <ul class="list-disc pl-5 space-y-2">
        <li>Buku Nikah harus dalam keadaan jelas terbaca, tidak robek parah, dan foto pemilik masih terlihat jelas.</li>
        <li>Apabila Buku Nikah diterbitkan oleh KUA selain KUA Seruyan Raya, proses legalisasi tetap dapat dilayani setelah petugas memverifikasi keabsahan data di sistem SIMKAH Nasional.</li>
      </ul>
    `,
    prosedur: `
      <ol class="list-decimal pl-5 space-y-2">
        <li>Membawa dokumen asli dan fotocopy Buku Nikah ke loket pelayanan KUA Seruyan Raya.</li>
        <li>Petugas melakukan pemeriksaan fisik Buku Nikah asli dan mencocokkan dengan lembar fotocopy.</li>
        <li>Petugas melakukan validasi status pernikahan melalui sistem SIMKAH Kemenag.</li>
        <li>Petugas membubuhkan cap basah legalisasi, nomor legalisir, dan Kepala KUA membubuhkan tanda tangan resmi pada lembar fotocopy Buku Nikah.</li>
      </ol>
    `,
    biaya: "Rp 0 (Gratis) - Pelayanan legalisasi dokumen pernikahan tidak dipungut biaya apapun.",
    faq: [
      {
        q: "Berapa lama proses legalisasi Buku Nikah di KUA?",
        a: "Proses ini sangat instan. Apabila dokumen lengkap, data valid di SIMKAH, dan Kepala KUA berada di tempat, proses stempel dan tanda tangan hanya memerlukan waktu sekitar 5 - 15 menit."
      },
      {
        q: "Dapatkah melegalisir fotocopy Buku Nikah tanpa membawa dokumen aslinya?",
        a: "Tidak dapat. Petugas wajib melihat dan memeriksa secara langsung keaslian fisik Buku Nikah untuk mencegah tindak pemalsuan dokumen."
      }
    ]
  },
  {
    id: "itsbat",
    title: "Pencatatan Itsbat Nikah",
    description: "Pencatatan resmi pernikahan ke dalam register negara berdasarkan Keputusan / Penetapan Itsbat Nikah yang telah dikeluarkan oleh Pengadilan Agama.",
    icon: "ScaleBalanced",
    syarat: `
      <ul class="list-disc pl-5 space-y-2">
        <li>Membawa <strong>Salinan Penetapan/Putusan Itsbat Nikah</strong> yang asli dari Pengadilan Agama setempat.</li>
        <li>Fotocopy KTP Elektronik Suami & Istri.</li>
        <li>Fotocopy Kartu Keluarga (KK) Suami & Istri yang terbaru.</li>
        <li>Pas Foto berwarna terbaru Suami & Istri ukuran 2x3 (3 lembar) dan ukuran 4x6 (2 lembar) berlatar belakang <strong>warna biru</strong>.</li>
      </ul>
    `,
    syarat_khusus: `
      <ul class="list-disc pl-5 space-y-2">
        <li>Melampirkan surat keterangan pengantar dari Desa/Lurah setempat mengenai data perkawinan pemohon.</li>
      </ul>
    `,
    prosedur: `
      <ol class="list-decimal pl-5 space-y-2">
        <li>Pemohon datang ke Kantor KUA Seruyan Raya dengan membawa salinan Putusan/Penetapan Pengadilan Agama dan berkas kelengkapan.</li>
        <li>Petugas loket memeriksa kelengkapan berkas dan mencocokkan data pada penetapan Pengadilan Agama.</li>
        <li>Petugas mencatatkan pernikahan ke dalam Buku Register Akta Nikah khusus Itsbat Nikah.</li>
        <li>Pemrosesan dan penerbitan Buku Nikah resmi Kementerian Agama RI untuk pasangan suami istri tersebut.</li>
      </ol>
    `,
    biaya: "Rp 0 (Gratis) - Penerbitan Buku Nikah hasil Itsbat Perkawinan berdasarkan ketetapan Pengadilan Agama tidak dipungut biaya.",
    faq: [
      {
        q: "Apakah Itsbat Nikah itu?",
        a: "Itsbat Nikah adalah jalur hukum melalui Pengadilan Agama untuk mengesahkan pernikahan siri atau pernikahan yang telah dilangsungkan secara sah menurut agama Islam namun belum dicatatkan secara resmi di KUA."
      },
      {
        q: "Kenapa harus mencatatkan Itsbat Nikah ke KUA?",
        a: "Agar pernikahan Anda diakui secara sah oleh hukum negara, sehingga Anda bisa menerbitkan Akta Kelahiran anak, mengurus KK bersama, mengurus paspor, dan mendapatkan jaminan hak waris serta hak hukum lainnya."
      }
    ]
  },
  {
    id: "rujuk",
    title: "Pencatatan Rujuk",
    description: "Pencatatan kembalinya ikatan pernikahan suami-istri yang telah sah bercerai talak raj'i dalam masa iddah, agar pernikahan kembali utuh secara hukum negara.",
    icon: "HandHoldingHeart",
    syarat: `
      <ul class="list-disc pl-5 space-y-2">
        <li>Membawa lembar dokumen <strong>Akta Cerai Asli</strong> dari Pengadilan Agama.</li>
        <li>Melampirkan Surat Keterangan Pengantar Rujuk (Model R) yang dikeluarkan oleh Kepala Desa atau Lurah setempat.</li>
        <li>Fotocopy KTP Elektronik Suami dan Istri.</li>
        <li>Fotocopy Kartu Keluarga (KK) Suami dan Istri.</li>
        <li>Pas Foto berwarna terbaru Suami & Istri ukuran 2x3 (3 lembar) berlatar belakang <strong>warna biru</strong>.</li>
      </ul>
    `,
    syarat_khusus: `
      <ul class="list-disc pl-5 space-y-2">
        <li>Kejadian rujuk wajib dilakukan dan dicatatkan sebelum masa iddah istri berakhir (talak 1 atau talak 2).</li>
        <li>Wajib dihadiri langsung oleh Suami, Istri, dan saksi-saksi yang sah.</li>
      </ul>
    `,
    prosedur: `
      <ol class="list-decimal pl-5 space-y-2">
        <li>Suami dan istri bersama saksi mendatangi Kantor KUA Seruyan Raya membawa dokumen persyaratan lengkap.</li>
        <li>Suami mengucapkan ikrar rujuk secara lisan di hadapan Kepala KUA/Penghulu dan saksi-saksi.</li>
        <li>Suami, istri, saksi-saksi, dan Kepala KUA menandatangani Buku Pendaftaran Rujuk.</li>
        <li>KUA menerbitkan Kutipan Buku Pendaftaran Rujuk dan mengembalikan status pernikahan secara hukum negara.</li>
      </ol>
    `,
    biaya: "Rp 0 (Gratis) - Seluruh proses pencatatan rujuk yang dilakukan di kantor KUA tidak dikenakan biaya PNBP.",
    faq: [
      {
        q: "Bagaimana jika masa iddah istri telah habis sebelum sempat mendaftar rujuk?",
        a: "Apabila masa iddah telah habis, maka pasangan tidak bisa melakukan rujuk secara langsung. Mereka wajib melangsungkan pernikahan baru (mengurus berkas nikah baru, membayar mas kawin baru, dan melakukan akad nikah ulang di hadapan Wali nasab)."
      },
      {
        q: "Apakah rujuk bisa dilakukan setelah talak 3?",
        a: "Tidak bisa. Suami istri yang telah bercerai dengan talak 3 tidak boleh rujuk ataupun menikah kembali kecuali sang istri telah menikah secara sah dengan pria lain, bercerai secara wajar, dan menyelesaikan masa iddahnya dengan suami barunya tersebut (Muhallil)."
      }
    ]
  }
];
