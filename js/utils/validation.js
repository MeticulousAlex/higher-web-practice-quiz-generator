import { z } from 'zod';

const optionSchema = z.object({
  id: z.number(),
  text: z.string().min(1, 'Текст варианта не может быть пустым'),
  correct: z.boolean(),
  message: z.string().optional(),
});

const questionSchema = z.object({
  id: z.number(),
  text: z.string().min(1, 'Текст вопроса не может быть пустым'),
  type: z.enum(['single', 'multiple'], {
    errorMap: () => ({ message: 'Тип вопроса должен быть "single" или "multiple"' }),
  }),
  options: z.array(optionSchema).min(2, 'Вопрос должен содержать минимум 2 варианта ответа'),
});

const quizSchema = z.object({
  title: z.string().min(1, 'Название теста не может быть пустым'),
  description: z.string().optional(),
  questions: z.array(questionSchema).min(1, 'Тест должен содержать минимум 1 вопрос'),
});


export function validateQuizJson(jsonString) {
  try {
    if (!jsonString || !jsonString.trim()) {
      return {
        isValid: false,
        error: 'JSON строка не может быть пустой',
      };
    }

    let parsedData;
    try {
      parsedData = JSON.parse(jsonString);
    } catch (parseError) {
      return {
        isValid: false,
        error: `Ошибка парсинга JSON: ${parseError.message}`,
      };
    }

    if (parsedData === null || typeof parsedData !== 'object' || Array.isArray(parsedData)) {
      return {
        isValid: false,
        error: 'JSON должен быть объектом',
      };
    }

    const result = quizSchema.safeParse(parsedData);

    if (result.success) {
      return {
        isValid: true,
        data: result.data,
      };
    } else {
      const errorMessages = result.error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join('; ');

      return {
        isValid: false,
        error: errorMessages,
      };
    }
  } catch (error) {
    return {
      isValid: false,
      error: `Неожиданная ошибка: ${error.message}`,
    };
  }
}

export function checkAnswer(question, userAnswer) {
  const { type, options } = question;
  
  const selectedIds = Array.isArray(userAnswer) 
    ? userAnswer.map(id => parseInt(id, 10))
    : [parseInt(userAnswer, 10)];
  
  const correctIds = options
    .filter(option => option.correct)
    .map(option => option.id);
  
  let isCorrect = {};
  if (type === 'single') {
    isCorrect.correct = selectedIds.length === 1 && selectedIds[0] === correctIds[0];
  } else {
    isCorrect = {
      correct:
        selectedIds.length === correctIds.length &&
        selectedIds.every(id => correctIds.includes(id)),
      hasCorrect:selectedIds.some(id => correctIds.includes(id)),
      hasWrong: selectedIds.some(id => !correctIds.includes(id))
    }
  }
  
  const texts = [];
  
  options.forEach(option => {
    const isSelected = selectedIds.includes(option.id);
    
    if (isSelected && option.message) {
      texts.push({
        id: option.id,
        message: option.message,
        isSuccess: option.correct,
      });
    }
  });
  
  if (texts.length === 0) {
    texts.push({
      id: 0,
      message: isCorrect ? 'Правильно!' : 'Неправильно!',
      isSuccess: isCorrect,
    });
  }
  
  return {
    isCorrect,
    texts,
  };
}
