class MenuComponent {
  constructor(links = {}) {
    this.links = links;
    this.element = null;
    this.toggleCallback = null;
    this.init();
  }

  init() {
    this.element = document.createElement('nav');
    this.element.className = 'menu';
    this.optionsList = document.createElement('ul');
    this.optionsList.className = 'menu__options';

    this.element.appendChild(this.optionsList);
    document.body.appendChild(this.element);

    this.element.addEventListener('click', (e) => {
    if (e.target === this.element) {
        this.hide();
    }
    });
  }

  show() {
    this.optionsList.innerHTML = '';
    this.links.forEach((option) => {
        const linkItem = document.createElement('a');
        linkItem.className = 'menu__option';
        linkItem.href = option.href;
        linkItem.textContent = option.text;
        
        this.optionsList.appendChild(linkItem);
    })
   
    this.element.className = `menu menu_visible`;

    if (typeof this.toggleCallback === 'function') {
      this.toggleCallback(true);
    }
  }

  hide() {
    this.element.classList.remove('menu_visible');

    if (typeof this.toggleCallback === 'function') {
      this.toggleCallback(false);
    }

  }

  setToggleCallback(cb) {
    this.toggleCallback = cb;
  }

  destroy() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
}


export const Menu = new MenuComponent();
