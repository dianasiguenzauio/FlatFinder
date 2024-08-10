//En este archivo van a definir todas las funciones para interactuar con firebase
//operaciones de bdd CRUD
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

//vamos a definir el nombre de la coleccion que vamos a utilizar
const collectionName = "users";

//vamos a definir la referencia a la collecion que vamos a utilizar
const usersCollectionRef = collection(db, collectionName);

//vamos a definir la funcion de lectura
export const getUsers = async () => {
  const data = await getDocs(usersCollectionRef);
  const users = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  //console.log(users);

  return users;
};

//Vamos a definir la funcion de creacion de datos
export const createUser = async (user) => {
  await addDoc(usersCollectionRef, user);
};

//vamosa definir la funcion de actualizacion de datos

export const updateUser = async (id, updateUserData) => {
  const userRef = doc(db, collectionName, id);
  await updateDoc(userRef, updateUserData);
};

export const getUserById = async (id) => {
  const userRef = doc(db, collectionName, id);
  const user = await getDoc(userRef);
  return user.data();
};
export const deleteUser = async (id) => {
  await deleteDoc(doc(db, collectionName, id));
};

//vamos a definir el nombre de la coleccion que vamos a utilizar
const collectionFlats = "flats";

//vamos a definir la referencia a la collecion que vamos a utilizar
const flatsCollectionRef = collection(db, collectionFlats);

//vamos a definir la funcion de lectura
export const getFlats = async () => {
  const data = await getDocs(flatsCollectionRef);
  const flats = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  //console.log(users);

  return flats;
};
//Vamos a definir la funcion de creacion de datos
export const createFlats = async (flat) => {
  await addDoc(flatsCollectionRef, flat);
};
