class EmojiPicker {
  constructor() {
    this.categories = {
      smileys: { name: '😊 Smileys', emojis: ['😀','😃','😄','😁','😅','😂','🤣','😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🤩','🥳','😏','😒','😞','😔','😟','😕','🙁','😣','😖','😫','😩','🥺','😢','😭','😤','😠','😡','🤬','🤯','😳','🥵','🥶','😱','😨','😰','😥','😓'] },
      gestures: { name: '👋 Gestes', emojis: ['👋','🤚','🖐','✋','🖖','👌','🤌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','👍','👎','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏'] },
      animals: { name: '🐶 Animaux', emojis: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🐤','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🐛','🦋','🐌','🐞','🐜','🦟'] },
      food: { name: '🍔 Nourriture', emojis: ['🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🍆','🥑','🥦','🥬','🥒','🌶','🫑','🌽','🥕','🥔','🍠','🥐','🥯','🍞','🥖','🧀','🥚','🍳','🥞','🥓','🥩','🍗','🍖','🌭','🍔','🍟','🍕','🥪','🌮','🌯','🥗','🍝','🍜','🍲','🍛','🍣','🍱','🍤','🍙','🍚','🍘','🍥','🍢','🍡','🍧','🍨','🍦','🥧','🧁','🍰','🎂','🍮','🍭','🍬','🍫','🍿','🍩','🍪'] },
      activities: { name: '⚽ Activités', emojis: ['⚽','🏀','🏈','⚾','🎾','🏐','🏉','🎱','🏓','🏸','🏒','🏑','🥅','⛳','🏹','🎣','🥊','🥋','🎽','🛹','🛼','⛸','🥌','🎿','🏂','🏋️','🤸','🏌️','🏇','🧘','🏄','🏊','🚣','🧗','🚴','🚵','🎪','🎨','🎬','🎤','🎧','🎼','🎹','🥁','🎷','🎺','🎸','🎻','🎲','🎯','🎳','🎮','🎰'] },
      travel: { name: '✈️ Voyages', emojis: ['🚗','🚕','🚙','🚌','🚎','🏎','🚓','🚑','🚒','🚐','🚚','🚛','🚜','🚲','🛵','🏍','🛺','🚨','🚔','🚍','🚘','🚖','🚡','🚠','🚟','🚃','🚋','🚝','🚄','🚅','🚈','🚂','🚆','🚇','🚊','🚉','✈️','🛫','🛬','🛩','🚁','🛶','⛵','🚤','🛥','⛴','🚢','⚓','🏰','🏯','🏟','🎡','🎢','🎠','⛲','🏖','🏝','🏜','🌋','⛰','🏔','🗻','⛺','🏕'] },
      objects: { name: '💡 Objets', emojis: ['⌚','📱','📲','💻','⌨️','🖥','🖨','🖱','🕹','💾','💿','📀','📷','📸','📹','🎥','📞','☎️','📺','📻','🎙','⏰','⌛','⏳','💡','🔦','🕯','💸','💵','💴','💶','💷','💰','💳','💎','🔧','🔨','⚒','🛠','⛏','🔩','⚙️','🔫','💣','🔪','🗡','⚔️','🛡','📿','🔮','💈','🔭','🔬','💊','💉','🩺','🚪','🛏','🛋','🪑','🚽','🚿','🛁','🧴','🧹','🧺','🧻','🎁','🎈','🎀','🎊','🎉','✉️','📧','📦','📋','📁','📂','📰','📓','📕','📗','📘','📙','📚','📖','✂️','📌','📍','✏️','🔍','🔐','🔒'] },
      symbols: { name: '❤️ Symboles', emojis: ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','💕','💞','💓','💗','💖','💘','💝','✨','⭐','🌟','✔️','✅','❌','❗','❓','⚠️','🔥','💯','💢','💤','🎵','🎶','🔔','🔕','📣','📢','💬','💭','🗨','🗯','♠️','♥️','♦️','♣️','🎴','👁️','💀','☠️','👻','👽','🤖','💩','😺','😸','😹','😻','😼','😽','🙀','😿','😾'] },
      custom_general: { name: '⭐ General', emojis: [] },
      custom_server: { name: '🏠 Server', emojis: [] },
      custom_perso: { name: '👤 User', emojis: [] }
    };

    this.currentCategory = 'smileys';
    this.onEmojiSelect = null;
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
                  ${this.categories[key].name.split(' ')[0]}
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
    const category = this.categories[this.currentCategory];

    let emojis = category.emojis;
    if (filter) {
      emojis = emojis.filter(e => e.includes(filter));
    }

    if (emojis.length === 0) {
      grid.innerHTML = '<div class="emoji-empty">No emojis in this category</div>';
      return;
    }

    grid.innerHTML = emojis.map(emoji => `
          <button class="emoji-item" data-emoji="${emoji}">${emoji}</button>
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
  picker.addCustomEmoji('custom_general', '🎮');
  picker.addCustomEmoji('custom_general', '🎯');
  picker.addCustomEmoji('custom_general', '🚀');
}

function initCustomServer(picker) {
  picker.addCustomEmoji('custom_server', '🏰');
  picker.addCustomEmoji('custom_server', '⚔️');
  picker.addCustomEmoji('custom_server', '🛡️');
}

function initCustomUser(picker) {
  picker.addCustomEmoji('custom_perso', '🦄');
  picker.addCustomEmoji('custom_perso', '🌟');
  picker.addCustomEmoji('custom_perso', '🔮');
}