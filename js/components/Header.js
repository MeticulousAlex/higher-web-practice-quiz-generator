export class Header {
  constructor(options = {}) {
    this.title = options.title || 'Quiz Generator';
    this.links = options.links || [];
    this.currentPath = options.currentPath || window.location.pathname;
    this.element = null;
     this.menuToggle = null;
    this.menu = options.menu || null;
  }

  render() {
    const header = document.createElement('header');
    header.className = 'header';

    const container = document.createElement('div');
    container.className = 'header__container';

    const logo = document.createElement('img');
    logo.className = 'header__logo';
    logo.src = '../../assets/logo.svg';

    const nav = document.createElement('nav');
    nav.className = 'header__nav';

    this.links.forEach(linkData => {
      const link = document.createElement('a');
      link.className = 'header__link';
      linkData.type == 'add' ? link.classList.add('header__link_add-new') : link.classList.add('header__link_to-menu');
      link.href = linkData.href;
      link.textContent = linkData.text;
      nav.appendChild(link);
    });

    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.setAttribute('aria-label', 'Open menu');
    menuToggle.setAttribute('aria-expanded', 'false');
    
    for (let i = 0; i < 3; i++) {
      const line = document.createElement('span');
      line.className = 'menu-toggle__line';
      menuToggle.appendChild(line);
    }

    this.menuToggle = menuToggle;

    this.menuToggle.addEventListener('click', () => {
      const isActive = this.menuToggle.classList.toggle('active');
      this.menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      if (this.menu) {
        isActive ? this.menu.show() : this.menu.hide();
      }
    });

    if (this.menu && typeof this.menu.setToggleCallback === 'function') {
      this.menu.setToggleCallback((isActive) => {
        if (!this.menuToggle) return;
        if (isActive) {
          this.menuToggle.classList.add('active');
        } else {
          this.menuToggle.classList.remove('active');
        }
      });
    }

    container.appendChild(logo);
    container.appendChild(nav);
    nav.appendChild(menuToggle);
    header.appendChild(container);


    this.element = header;
    return this.element;
  }

  mount(selector) {
    const container = document.querySelector(selector);
    if (container) {
      container.prepend(this.render());
    }
  }

  
  destroy() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
}