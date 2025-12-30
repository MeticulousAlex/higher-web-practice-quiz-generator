import { Header } from '../components/Header.js';
import { Menu } from '../components/Menu.js';
import { Modal } from '../components/Modal.js';
import { getQuiz } from '../utils/storage.js';
import { checkAnswer } from '../utils/validation.js';

const menuLinks = [
  { href: '/create', text: 'Добавить квиз' },
  { href: '/quizzes', text: 'Сохранённые квизы' },
];

Menu.links = menuLinks;

const header = new Header({
  title: 'Quiz Generator',
  links: [
    { text: 'Посмотреть сохранённые квизы', href: './quizzes.html', type:'menu' },
  ],
  menu: Menu
});

header.mount('body');

const modal = new Modal({
  primaryOptions:{
    buttonText: 'К списку квизов',
    callback: () => {
      window.location.href = './quizzes.html'
    }
  },
  secondaryOptions:{
    buttonText: 'Пройти снова',
    callback: () => {
      currentQuestionIndex = 0;
      correctAnswersCount = 0;
      modal.hideModal();
      quiz.classList.remove('quiz_hidden');
      renderQuestion();
    }
  }
})

modal.mount('header')

const quiz = document.querySelector('.quiz');
const quizTitle = document.querySelector('.quiz__title');
const quizSubtitle = document.querySelector('.quiz__subtitle');
const multipleOptionsFeedback = document.querySelector('.question__multiple-feedback');
const submitButton = document.querySelector('.question__button');
const currentQuestionSpan = document.querySelector('.progress__current');
const totalQuestionsSpan = document.querySelector('.progress__total');
const progressFill = document.querySelector('.progress__fill');
let currentQuiz = null;
let currentQuestionIndex = 0;
let correctAnswersCount = 0;
let isAnswered = false;


async function initQuiz() {

  const urlParams = new URLSearchParams(window.location.search);
  const quizId = urlParams.get('id');
  const questionParam = urlParams.get('question');

  if (!quizId) {
    console.error('ID not defined')
    return;
  }

  try {

    currentQuiz = await getQuiz(quizId);
    if (!currentQuiz) {
      console.error('quiz not found')
      return;
    }

    currentQuestionIndex = questionParam ? parseInt(questionParam, 10) - 1 : 0;
    
    if (currentQuestionIndex < 0 || currentQuestionIndex >= currentQuiz.questions.length) {
      currentQuestionIndex = 0;
    }

    quizTitle.textContent = 'Квиз: ' + currentQuiz.title;
    quizSubtitle.textContent = currentQuiz.description;
    quiz.classList.remove('quiz_hidden');
    renderQuestion();

  } catch (error) {
    console.error('Ошибка при загрузке теста:', error);
  }
}

function renderQuestion() {
  const question = currentQuiz.questions[currentQuestionIndex];

  updateProgress();

  isAnswered = false;

  const templateId = question.type === 'single' ? 'single-question-template' : 'multiple-question-template';
  const template = document.getElementById(templateId);
  const questionElement = template.content.cloneNode(true);

  const questionText = questionElement.querySelector('.question__text');
  const questionOptions = questionElement.querySelector('.question__options');
  
  questionText.textContent = question.text;

  question.options.forEach(option => {
    const optionElement = createOption(option, question.type);
    questionOptions.appendChild(optionElement);
  });

  const questionContainer = document.getElementById('question-container');
  questionContainer.innerHTML = '';
  questionContainer.appendChild(questionElement);

  multipleOptionsFeedback.classList.remove('question__multiple-feedback_visible');
  submitButton.textContent = 'Ответить';

  updateURL();
}

function createOption(option, questionType) {

  const templateId = questionType === 'single' ? 'option-template' : 'checkbox-option-template';
  const template = document.getElementById(templateId);
  const optionElement = template.content.cloneNode(true);
  
  const input = optionElement.querySelector('.option__input');
  const text = optionElement.querySelector('.option__text');
  const feedback = optionElement.querySelector('.option__feedback');
  
  input.value = option.id;
  input.name = 'question';
  text.textContent = option.text;
  feedback.textContent = option.message;
  
  return optionElement;
}

function updateProgress() {
  const current = currentQuestionIndex + 1;
  const total = currentQuiz.questions.length;
  const percentage = (current / total) * 100;

  currentQuestionSpan.textContent = current;
  totalQuestionsSpan.textContent = total;
  progressFill.style.width = `${percentage}%`;
}

function updateURL() {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set('question', currentQuestionIndex + 1);
  
  const newURL = `${window.location.pathname}?${urlParams.toString()}`;
  window.history.pushState({}, '', newURL);
}

quiz.addEventListener('submit', (e) => {
  e.preventDefault();

  if (isAnswered) {
    goToNextQuestion();
  } else {
    handleAnswerSubmit();
  }
});

function handleAnswerSubmit() {
  const question = currentQuiz.questions[currentQuestionIndex];
  const questionContainer = document.getElementById('question-container');
  const questionOptions = questionContainer.querySelector('.question__options');

  const selectedInputs = questionOptions.querySelectorAll('input:checked');

  if (selectedInputs.length === 0) {
    console.error('select at least one option');
    return;
  }

  const selectedIds = Array.from(selectedInputs).map(input => input.value);
  const result = checkAnswer(question, selectedIds);
  
  if (result.isCorrect.correct) {
    correctAnswersCount++;
  }

  highlightOptions(question, selectedIds, result);
  disableOptions();

  isAnswered = true;
  updateSubmitButton();
}

function highlightOptions(question, selectedIds, result) {
  const questionContainer = document.getElementById('question-container');
  const questionOptions = questionContainer.querySelector('.question__options');
  const optionElements = questionOptions.querySelectorAll('.option');
  
  optionElements.forEach((optionElement, index) => {
    const optionLabel = optionElement.querySelector('.option__label');
    const optionFeedback = optionElement.querySelector('.option__feedback');
    const option = question.options[index];
    const isSelected = selectedIds.includes(String(option.id));
    
    if (isSelected) {

      if(question.type === "single") optionFeedback.classList.add('option__feedback_visible');

      if (option.correct) {
        optionLabel.classList.add('option__label_correct');
      } else {
        optionLabel.classList.add('option__label_incorrect');
      }
    } else if (option.correct) {
      optionLabel.classList.add('option__label_correct');
      if(question.type === "single") optionFeedback.classList.add('option__feedback_visible');
    } else {
      optionLabel.classList.add('option__label_disabled');
    }
  });

  if (question.type === 'multiple' && result.isCorrect.hasCorrect && !result.isCorrect.correct ){
    multipleOptionsFeedback.textContent = 'Часть ответов верна, но вы пропустили несколько правильных опций'
    multipleOptionsFeedback.classList.add('question__multiple-feedback_visible');
  } else if(question.type === 'multiple' && !result.isCorrect.hasCorrect && result.isCorrect.hasWrong){
    multipleOptionsFeedback.textContent = 'Правильные ответы не выбраны. Увы!'
    multipleOptionsFeedback.classList.add('question__multiple-feedback_visible');
  }
}

function disableOptions() {
  const questionContainer = document.getElementById('question-container');
  const labels = questionContainer.querySelectorAll('.option__label');

  labels.forEach(label => {
    label.querySelector('.option__input').disabled = true
  });
}


function updateSubmitButton() {
  const isLastQuestion = currentQuestionIndex === currentQuiz.questions.length - 1;
  console.log(currentQuestionIndex)
  if (isLastQuestion) {
    submitButton.textContent = 'Завершить тест';
  } else {
    submitButton.textContent = 'Следующий вопрос';
  }
}

function goToNextQuestion() {
  const isLastQuestion = currentQuestionIndex === currentQuiz.questions.length - 1;
  
  if (isLastQuestion) {
    showResults();
  } else {
    currentQuestionIndex++;
    renderQuestion();
  }
}

function showResults() {
  const totalQuestions = currentQuiz.questions.length;
  const percentage = Math.round((correctAnswersCount / totalQuestions) * 100);
  
  if (percentage == 100) {
    modal.setAllText({
      title:'Тест завершён!',
      result:'Вы ответили правильно на все вопросы 🎉',
      text:'Ваши знания в UX-дизайне на высоте — вы уверенно разбираетесь в пользовательских сценариях и принципах проектирования интерфейсов.'
    })
  } else if (percentage >= 50) {
    modal.setAllText({
      title: 'Хороший результат!',
      result:`Вы ответили правильно на ${correctAnswersCount} из ${totalQuestions} вопросов`,
      text:'Отличная попытка! Вы хорошо понимаете UX-подход, но некоторые темы стоит освежить. Пройдите тест ещё раз, чтобы закрепить знания.'
    })
  } else {
        modal.setAllText({
      title: 'Не расстраивайтесь!',
      result:`Вы ответили правильно только на ${correctAnswersCount} из ${totalQuestions} вопросов`,
      text:'Не переживайте — ошибки это часть обучения. Попробуйте пройти тест снова, чтобы закрепить материал и улучшить результат.'
    })
  }

  modal.showModal();
  quiz.classList.add('quiz_hidden');
}

initQuiz();