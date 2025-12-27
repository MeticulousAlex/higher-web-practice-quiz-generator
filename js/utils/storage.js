import { dbPromise } from './db';
import { nanoid } from 'nanoid';


export async function saveQuiz(quizData) {
  const db = await dbPromise;
  const id = nanoid();
  const quiz = { id, ...quizData };
  await db.put('quizzes', quiz);
  return id;
}

export async function getQuiz(id) {
  const db = await dbPromise;
  return db.get('quizzes', id);
}

export async function getAllQuizzes() {
  const db = await dbPromise;
  return db.getAll('quizzes');
}

export async function deleteQuiz(id) {
  const db = await dbPromise;
  return db.delete('quizzes', id);
}

export async function clearAllQuizzes() {
  const db = await dbPromise;
  return db.clear('quizzes');
}
