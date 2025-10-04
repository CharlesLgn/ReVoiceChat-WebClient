class EmojiPicker {

  async init() {
    this.categories = await fetch("src/js/component/general.emoji.json").then(res => res.json());
    this.currentCategory = 'smileys';
    this.onEmojiSelect = null;
  }

  addCustomEmojiCategory(name, category) {
    this.categories[name] = category
  }

  addCustomEmoji(category, emoji) {
    if (this.categories[category]) {
      this.categories[category].emojis.push(emoji);
    }
  }

  create() {
    const picker = document.createElement('div');
    picker.className = 'emoji-picker-content';
    picker.innerHTML = `
          <div class="emoji-picker-header">
            <div class="emoji-picker-categories">
              ${Object.keys(this.categories).map(key => `
                <button class="emoji-category-btn ${key === this.currentCategory ? 'active' : ''}"
                        data-category="${key}">
                  ${this.categories[key].icon}
                </button>
              `).join('')}
            </div>
          </div>
          <div class="emoji-picker-search">
            <input type="text" placeholder="Search..." class="emoji-search-input">
          </div>
          <div class="emoji-picker-body">
            <div class="emoji-grid"></div>
          </div>
        `;

    this.element = picker;
    this.renderEmojis();
    this.attachEvents();

    return picker;
  }

  renderEmojis(filter = '') {
    const grid = this.element.querySelector('.emoji-grid');
    let emojis
    if (filter) {
      emojis = Object.values(this.categories).flatMap(category => category.emojis);
      emojis = emojis.filter(e =>
          e.content === filter
          || e.names.some(name => name.toLowerCase().includes(filter.toLowerCase()))
          || e.description.toLowerCase().includes(filter.toLowerCase())
      );
    } else {
      const category = this.categories[this.currentCategory];
      emojis = category.emojis;
    }

    if (emojis.length === 0) {
      grid.innerHTML = '<div class="emoji-empty">No emojis found</div>';
      return;
    }

    grid.innerHTML = emojis.map(emoji => `
          <button class="emoji-item" data-emoji="${emoji.content}">${emoji.content}</button>
        `).join('');
  }

  attachEvents() {
    this.element.querySelectorAll('.emoji-category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.category;
        this.currentCategory = category;

        this.element.querySelectorAll('.emoji-category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        this.renderEmojis();
      });
    });

    this.element.addEventListener('click', (e) => {
      if (e.target.classList.contains('emoji-item')) {
        const emoji = e.target.dataset.emoji;
        if (this.onEmojiSelect) {
          this.onEmojiSelect(emoji);
        }
      }
    });

    const searchInput = this.element.querySelector('.emoji-search-input');
    searchInput.addEventListener('input', (e) => {
      this.renderEmojis(e.target.value);
    });
  }
}

function initCustomGeneral(picker) {
  picker.addCustomEmojiCategory('custom_general', {
    icon: '<img src="src/img/favicon.png" alt="revoice"/>',
    emojis: [
      {content: '🎮',description: "game", names:["game"]},
      {content: '🎯',description: "test", names:["test"]},
      {content: '🚀',description: "test2", names:["test2"]}
    ]
  })
}

function initCustomServer(picker) {
  picker.addCustomEmojiCategory('custom_server', {
    icon: '🏠',
    emojis: [
      {content: '🏰',description: "castle", names:["castle"]},
      {content: '⚔️',description: "sword", names:["sword"]},
      {content: '🛡️',description: "shield", names:["shield"]}
    ]
  })
}

function initCustomUser(picker) {
  picker.addCustomEmojiCategory('custom_perso', {
    icon: '👽',
    emojis: [
      {content: '🦄', description: "unicorn", names:["unicorn"]},
      {content: '🌟', description: "star", names:["star"]},
      {content: '🔮', description: "magic", names:["magic"]}
    ]
  })
}