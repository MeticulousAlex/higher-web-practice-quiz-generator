import { Header } from '../components/Header.js';
import { Menu } from '../components/Menu.js';
import { getAllQuizzes} from '../utils/storage.js';


const menuLinks = [
  { href: '/create', text: 'Добавить квиз' },
  { href: '/quizzes', text: 'Сохранённые квизы' },
];

Menu.links = menuLinks;

const header = new Header({
  title: 'Quiz Generator',
  links: [
    { text: 'Добавить квиз', href: './index.html', type: 'add'},
  ],
  menu: Menu
});

header.mount('body');

const quizzes = document.querySelector('.quizzes');
const quizzesGrid = document.querySelector('.quizzes__grid');
const pageTitle = document.querySelector('.quizzes__title');
const emptyState = document.querySelector('.quizzes__no-quiz');

async function loadQuizzes() {
  try {
    const quizzes = await getAllQuizzes();

    if (quizzes.length === 0) {
      showEmptyState();
      return;
    }

    hideEmptyState();
    renderQuizzes(quizzes);

  } catch (error) {
    console.error('Ошибка при загрузке тестов:', error);
  }
}

function renderQuizzes(quizzes) {
  quizzesGrid.innerHTML = '';

  quizzes.forEach(quiz => {
    const card = createQuizCard(quiz);
    quizzesGrid.appendChild(card);
  });
}

function createQuizCard(quiz) {
  const card = document.createElement('article');
  card.className = 'quiz-card';

  const content = document.createElement('div');
  content.className = 'quiz-card__content';

  const title = document.createElement('h3');
  title.className = 'quiz-card__title';
  title.textContent = quiz.title;

  const description = document.createElement('p');
  description.className = 'quiz-card__description';
  description.textContent = quiz.description || 'Описание не указано';

  content.appendChild(title);
  content.appendChild(description);


  const bottomBar = document.createElement('div');
  bottomBar.className = 'quiz-card__bottom-bar';

  const questionsCaption = document.createElement('span');
  questionsCaption.className = 'quiz-card__questions';
  questionsCaption.innerHTML = `${quiz.questions.length} ${getQuestionWord(quiz.questions.length)}`;

  const startButton = document.createElement('a');
  startButton.className = 'quiz-card__button';
  startButton.href = `./quiz.html?id=${quiz.id}`;
  startButton.textContent = 'Пройти';

  bottomBar.appendChild(questionsCaption);
  bottomBar.appendChild(startButton);

  card.appendChild(content);
  card.appendChild(bottomBar);

  return card;
}

function getQuestionWord(count) {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'вопросов';
  }

  if (lastDigit === 1) {
    return 'вопрос';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'вопроса';
  }

  return 'вопросов';
}

function showEmptyState() {
  quizzes.classList.add('quizzes_empty')
  quizzesGrid.classList.add('quizzes__grid_hidden');
  pageTitle.classList.add('quizzes__title_hidden');
  emptyState.classList.remove('quizzes__no-quiz_hidden')
}

function hideEmptyState() {
  quizzes.classList.remove('quizzes_empty')
  quizzesGrid.classList.remove('quizzes__grid_hidden');
  pageTitle.classList.remove('quizzes__title_hidden');
  emptyState.classList.add('quizzes__no-quiz_hidden')
}

loadQuizzes();
