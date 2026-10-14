import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import { db, auth, googleProvider, handleFirestoreError, OperationType } from './firebase';
import { BlogPost, blogPosts as defaultBlogPosts } from '../data/blogData';

export const SUPER_ADMIN_EMAIL = 'imr.desk@gmail.com';

export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  role: 'superadmin' | 'editor';
  approved: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface LandingPageSettings {
  pageKey: string;
  heroHeadline: string;
  heroSubheadline: string;
  bannerEnabled: boolean;
  bannerTitle: string;
  bannerSubtitle: string;
  bannerCtaText: string;
  guaranteeHeadline: string;
  guaranteeText: string;
  metaTitle: string;
  metaDescription: string;
  updatedAt: string;
  updatedBy: string;
}

export const defaultLandingSettings: LandingPageSettings = {
  pageKey: 'main_landing',
  heroHeadline: 'Verified Secondary Properties in Dubai',
  heroSubheadline: 'Bypass off-plan delays with title-deed verified luxury villas, townhouses, and waterfront apartments ready for immediate transfer.',
  bannerEnabled: true,
  bannerTitle: 'Are You a Property Owner in Dubai?',
  bannerSubtitle: 'List your property with secondary market specialists. Direct access to pre-qualified buyers and corporate investors.',
  bannerCtaText: 'List with SQFT DXB',
  guaranteeHeadline: '100% Title Deed Verified & Ready for Transfer',
  guaranteeText: 'Every listing in our catalog is physically inspected, DLD-verified, and guaranteed free of structural handover disputes.',
  metaTitle: 'SQFT DXB | Verified Secondary Market Properties Dubai',
  metaDescription: 'Browse ready-to-move secondary market villas, penthouses, and apartments across Dubai with verified title deeds and transparent pricing.',
  updatedAt: new Date().toISOString(),
  updatedBy: 'System',
};

/**
 * Sign in with Firebase Email & Password
 */
export async function signInWithEmail(email: string, pass: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
  return cred.user;
}

/**
 * Register new admin with Firebase Email & Password
 */
export async function registerWithEmail(email: string, pass: string): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  return cred.user;
}

/**
 * Send password reset email via Firebase Auth
 */
export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

/**
 * Sign in with Google (optional convenience)
 */
export async function signInAdmin(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

/**
 * Sign out from Firebase
 */
export async function signOutAdmin(): Promise<void> {
  await signOut(auth);
}

/**
 * Verify or record admin profile in Firestore
 */
export async function checkAndRegisterAdmin(user: User): Promise<AdminUser | null> {
  const adminDocRef = doc(db, 'admins', user.uid);
  const isSuper = (user.email || '').toLowerCase().trim() === SUPER_ADMIN_EMAIL.toLowerCase().trim();

  try {
    const snap = await getDoc(adminDocRef);

    if (snap.exists()) {
      const data = snap.data() as AdminUser;
      await setDoc(
        adminDocRef,
        { lastLoginAt: new Date().toISOString(), approved: true },
        { merge: true }
      );
      return { ...data, approved: true };
    }

    const newAdmin: AdminUser = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || 'Admin',
      role: isSuper ? 'superadmin' : 'editor',
      approved: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    await setDoc(adminDocRef, newAdmin);
    return newAdmin;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `admins/${user.uid}`);
    return null;
  }
}

/**
 * Listen to blog posts in real time from Firestore
 */
export function subscribeToBlogs(
  onUpdate: (blogs: BlogPost[]) => void,
  onError?: (err: any) => void
) {
  const colRef = collection(db, 'blogs');
  return onSnapshot(
    colRef,
    (snap) => {
      const list: BlogPost[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as BlogPost);
      });
      list.sort((a, b) => (b.publishedDate || '').localeCompare(a.publishedDate || ''));
      onUpdate(list);
    },
    (err) => {
      if (onError) onError(err);
      handleFirestoreError(err, OperationType.LIST, 'blogs');
    }
  );
}

/**
 * Seed initial mock blogs to Firestore if empty
 */
export async function seedInitialBlogs(): Promise<number> {
  const colRef = collection(db, 'blogs');
  const snap = await getDocs(colRef);
  if (snap.size > 0) return snap.size;

  let seeded = 0;
  for (const post of defaultBlogPosts) {
    await setDoc(doc(db, 'blogs', post.id), {
      ...post,
      published: true,
      createdAt: new Date().toISOString(),
    });
    seeded++;
  }
  return seeded;
}

/**
 * Save or update blog post in Firestore
 */
export async function saveBlogPost(post: Partial<BlogPost> & { title: string; slug: string }): Promise<string> {
  const id = post.id || `blog-${Date.now()}`;
  const docRef = doc(db, 'blogs', id);

  const payload: any = {
    ...post,
    id,
    updatedAt: new Date().toISOString(),
  };

  if (!post.createdAt) {
    payload.createdAt = new Date().toISOString();
  }
  if (post.published === undefined) {
    payload.published = true;
  }

  try {
    await setDoc(docRef, payload, { merge: true });
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `blogs/${id}`);
    return id;
  }
}

/**
 * Delete blog post from Firestore
 */
export async function deleteBlogPost(id: string): Promise<void> {
  const docRef = doc(db, 'blogs', id);
  try {
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `blogs/${id}`);
  }
}

/**
 * Fetch or listen to landing page settings from Firestore
 */
export function subscribeToLandingSettings(
  onUpdate: (settings: LandingPageSettings) => void
) {
  const docRef = doc(db, 'landing_pages', 'main_landing');
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as LandingPageSettings);
      } else {
        onUpdate(defaultLandingSettings);
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, 'landing_pages/main_landing');
    }
  );
}

/**
 * Save landing page settings to Firestore
 */
export async function saveLandingSettings(
  settings: Partial<LandingPageSettings>,
  userEmail?: string
): Promise<void> {
  const docRef = doc(db, 'landing_pages', 'main_landing');
  const payload = {
    ...defaultLandingSettings,
    ...settings,
    updatedAt: new Date().toISOString(),
    updatedBy: userEmail || 'Admin',
  };

  try {
    await setDoc(docRef, payload, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'landing_pages/main_landing');
  }
}
