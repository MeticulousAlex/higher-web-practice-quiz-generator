class ToastComponent {
  constructor() {
    this.element = null;
    this.hideTimeout = null;
    this.init();
  }

  init() {
    this.element = document.createElement('div');
    this.element.className = 'toast';
    this.element.innerHTML = `
      
      <div class="toast__content">
        <div class="toast__icon"></div>
        <div class="toast__title"></div>
        <div class="toast__message"></div>
      </div>
      <button class="toast__button" aria-label="Закрыть">Попробовать снова</button>
    `;

    const closeBtn = this.element.querySelector('.toast__button');
    closeBtn.addEventListener('click', () => this.hide());

    document.body.appendChild(this.element);
  }


  show(type = 'error', title = '', message = '', duration = 3000) {

    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    const icons = {
      error: '❌',
    };

    const iconElement = this.element.querySelector('.toast__icon');
    const titleElement = this.element.querySelector('.toast__title');
    const messageElement = this.element.querySelector('.toast__message');

    iconElement.textContent = icons[type] || icons.error;
    titleElement.textContent = title;
    messageElement.textContent = message;

    this.element.className = `toast toast_visible toast--${type}`;
    if (duration > 0) {
      this.hideTimeout = setTimeout(() => {
        this.hide();
      }, duration);
    }
  }

  hide() {
    this.element.classList.remove('toast_visible');
    
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  destroy() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
    
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }
}


export const Toast = new ToastComponent();
