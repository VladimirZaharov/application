'use client';

import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  getDocs,
  query,
  getDoc,
} from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { ProjectData } from '@/lib/types';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

export async function saveProject(userId: string, projectData: ProjectData) {
  const { firestore } = initializeFirebase();
  const projectRef = doc(
    firestore,
    `users/${userId}/projects/${projectData.id}`
  );
  
  const dataToSave = {
    ...projectData,
    lastModified: serverTimestamp(),
  };

  setDoc(projectRef, dataToSave, { merge: true }).catch((error) => {
    console.error('Firestore save error:', error);
    errorEmitter.emit(
      'permission-error',
      new FirestorePermissionError({
        path: projectRef.path,
        operation: 'write',
        requestResourceData: dataToSave,
      })
    );
  });
}

export async function loadProjects(userId: string) {
  const { firestore } = initializeFirebase();
  const projectsRef = collection(firestore, `users/${userId}/projects`);
  const q = query(projectsRef);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as ProjectData);
}

export async function loadProject(userId: string, projectId: string) {
  const { firestore } = initializeFirebase();
  const projectRef = doc(firestore, `users/${userId}/projects/${projectId}`);
  const docSnap = await getDoc(projectRef);
  if (docSnap.exists()) {
    return docSnap.data() as ProjectData;
  } else {
    return null;
  }
}
