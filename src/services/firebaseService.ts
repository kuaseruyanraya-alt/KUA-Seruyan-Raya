import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs,
  Unsubscribe 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { BeritaItem, AppConfig } from "../types";
import { DEFAULT_BERITA, DEFAULT_CONFIG } from "../data";

const BERITA_COLLECTION = "berita";
const CONFIG_COLLECTION = "app_config";
const CONFIG_DOC_ID = "main_config";

/**
 * Subscribe to real-time updates for Berita from Firestore.
 * Automatically seeds default news if the database collection is empty.
 */
export function subscribeBeritaList(onUpdate: (data: BeritaItem[]) => void): Unsubscribe {
  const beritaRef = collection(db, BERITA_COLLECTION);
  
  return onSnapshot(
    beritaRef,
    async (snapshot) => {
      if (snapshot.empty) {
        // Seed default news if database is empty
        try {
          await seedDefaultBerita();
        } catch (e) {
          console.error("Gagal melakukan seed berita awal ke Firestore:", e);
          onUpdate(DEFAULT_BERITA);
        }
      } else {
        const list: BeritaItem[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            title: d.title || "",
            date: d.date || "",
            category: d.category || "Kegiatan KUA",
            image: d.image || "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=800&q=80",
            summary: d.summary || "",
            content: d.content || ""
          };
        });

        // Sort by date or id descending if needed
        onUpdate(list);
      }
    },
    (error) => {
      console.error("Firestore onSnapshot error:", error);
      // Fallback to local data on error
      const saved = localStorage.getItem("kua_seruyan_raya_berita");
      if (saved) {
        try {
          onUpdate(JSON.parse(saved));
          return;
        } catch (e) {}
      }
      onUpdate(DEFAULT_BERITA);
    }
  );
}

/**
 * Seed initial default news items to Firestore doc by doc.
 */
export async function seedDefaultBerita(): Promise<void> {
  for (const item of DEFAULT_BERITA) {
    const docRef = doc(db, BERITA_COLLECTION, item.id);
    await setDoc(docRef, {
      ...item,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  }
}

/**
 * Save or update a single Berita item in Firestore cloud database.
 */
export async function saveBeritaCloud(item: BeritaItem): Promise<void> {
  const docRef = doc(db, BERITA_COLLECTION, item.id);
  await setDoc(docRef, {
    ...item,
    updatedAt: new Date().toISOString()
  }, { merge: true });

  // Also cache in localStorage for instant offline access
  try {
    const current = localStorage.getItem("kua_seruyan_raya_berita");
    let list: BeritaItem[] = current ? JSON.parse(current) : [];
    const index = list.findIndex(b => b.id === item.id);
    if (index >= 0) {
      list[index] = item;
    } else {
      list = [item, ...list];
    }
    localStorage.setItem("kua_seruyan_raya_berita", JSON.stringify(list));
  } catch (e) {}
}

/**
 * Delete a Berita item from Firestore cloud database.
 */
export async function deleteBeritaCloud(id: string): Promise<void> {
  const docRef = doc(db, BERITA_COLLECTION, id);
  await deleteDoc(docRef);

  // Update localStorage
  try {
    const current = localStorage.getItem("kua_seruyan_raya_berita");
    if (current) {
      const list: BeritaItem[] = JSON.parse(current);
      const updated = list.filter(b => b.id !== id);
      localStorage.setItem("kua_seruyan_raya_berita", JSON.stringify(updated));
    }
  } catch (e) {}
}

/**
 * Subscribe to Portal App Configuration real-time updates.
 */
export function subscribeAppConfig(onUpdate: (config: AppConfig) => void): Unsubscribe {
  const docRef = doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID);
  
  return onSnapshot(docRef, async (docSnap) => {
    if (docSnap.exists()) {
      onUpdate(docSnap.data() as AppConfig);
    } else {
      // Seed default config
      try {
        await setDoc(docRef, DEFAULT_CONFIG);
      } catch (e) {
        console.error("Gagal simpan default config ke Firestore:", e);
      }
      onUpdate(DEFAULT_CONFIG);
    }
  }, (err) => {
    console.error("Firestore app_config error:", err);
    onUpdate(DEFAULT_CONFIG);
  });
}

/**
 * Save Portal App Configuration to Firestore.
 */
export async function saveAppConfigCloud(config: AppConfig): Promise<void> {
  const docRef = doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID);
  await setDoc(docRef, config, { merge: true });
}
