import data from '../languages/data.json';

if (!localStorage.getItem('language')) {
  localStorage.setItem('language', 'vi');
}

const currentLanguage = localStorage.getItem('language') || 'vi';

export const language = (findText) => {
  const foundText = data.find((a) => a.name === findText);
  if (foundText) {
    return foundText[currentLanguage];
  }
  
  return findText;
};
