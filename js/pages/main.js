import { Header } from '../components/Header.js'
import { Toast } from '../components/Toast.js';
import { validateQuizJson } from '../utils/validation.js';
import { saveQuiz } from '../utils/storage.js';
import { Menu } from '../components/Menu.js';

const menuLinks = [
  { href: '/create', text: 'Добавить квиз' },
  { href: '/quizzes', text: 'Сохранённые квизы' },
];

Menu.links = menuLinks;

const header = new Header({
  title: 'Quiz Generator',
  links: [
    { text: 'Посмотреть сохранённые квизы', href: './quizzes.html', type: 'menu' },
  ],
  menu: Menu
});

header.mount('body');

const form = document.getElementById('jsonForm');
const jsonInput = document.getElementById('jsonInput');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  jsonInput.classList.remove('json-form__textarea_error');

  const jsonText = jsonInput.value.trim();
  if (!jsonText) {
    showError();
    return;
  }

  const validationResult = validateQuizJson(jsonText);
  if (!validationResult.isValid) {
    showError();
    Toast.show('error', 'Ошибка: не удалось обработать JSON.', 'Проверьте формат данных и попробуйте снова.', 5000);
    return;
  }

  try {
    await saveQuiz(validationResult.data);
    window.location.href = './quizzes.html';

  } catch (error) {
    showError();
    Toast.show('error', 'Ошибка', 'Не удалось сохранить тест', 5000);
  }
});

function showError() {
  jsonInput.classList.add('json-form__textarea_error');
}

jsonInput.addEventListener('input', () => {
    jsonInput.classList.remove('json-form__textarea_error');
  }
);
