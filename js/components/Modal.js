export class Modal {
  constructor(buttonConfig = {}) {
    this.primaryOptions = buttonConfig.primaryOptions;
    this.secondaryOptions = buttonConfig.secondaryOptions;
  }

  render() {
    const modal = document.createElement('div');
    modal.className = 'modal';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal__content';

    const modalTitle = document.createElement('h2');
    modalTitle.className = 'modal__title';
    modalTitle.textContent = this.title;

    const modalResult = document.createElement('p');
    modalResult.className = 'modal__result';
    modalResult.textContent = this.result;

    const modalText = document.createElement('p');
    modalText.className = 'modal__text';
    modalText.textContent = this.text;

    const modalActions = document.createElement('div');
    modalActions.className = 'modal__actions';

    const modalButtonPrimary = document.createElement('button');
    modalButtonPrimary.className = 'modal__button modal__button_primary';
    modalButtonPrimary.addEventListener('click', this.primaryOptions.callback);
    modalButtonPrimary.textContent = this.primaryOptions.buttonText;

    const modalButtonSecondary = document.createElement('button');
    modalButtonSecondary.className = 'modal__button modal__button_secondary';
    modalButtonSecondary.addEventListener('click', this.secondaryOptions.callback);
    modalButtonSecondary.textContent = this.secondaryOptions.buttonText;
    
    modalActions.append(modalButtonPrimary,modalButtonSecondary);
    modalContent.append(modalTitle, modalResult, modalText, modalActions);
    modal.append(modalContent);

    this.element = modal;
    this.title = modalTitle;
    this.result = modalResult;
    this.text = modalText;
    return this.element;
  }

  setAllText({title, result, text}){
    this.title.textContent = title;
    this.result.textContent = result;
    this.text.textContent = text;
  }

  hideModal(){
    this.element.classList.remove('modal_visible');
  }

  showModal(){
    console.log(this.element)
    this.element.classList.add('modal_visible');
    
  }

  mount(selector) {
    const adjacentElement = document.querySelector(selector);
    if (adjacentElement) {
      adjacentElement.after(this.render());
    }
  }
}