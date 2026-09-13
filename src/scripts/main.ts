const toast = document.querySelector<HTMLElement>('#toast')!;
let toastTimer: ReturnType<typeof setTimeout>;
function notify(message: string) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 4500);
}

const emailButton = document.querySelector<HTMLButtonElement>('#copy-email')!;
emailButton.hidden = false;
emailButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('mail@johanneskroll.com');
    notify('Email copied.');
  } catch {
    notify('You can email me at mail@johanneskroll.com.');
  }
});

const smiley = document.querySelector<HTMLButtonElement>('#smiley')!;
smiley.disabled = false;
let helloCount = 0;
smiley.addEventListener('click', () => {
  helloCount++;
  const messages = [
    'Hello to you, too! ☺',
    'Yes, this button is here for a reason.',
    'Secret found. You’ve reached the very unofficial end of the internet.',
  ];
  notify(messages[Math.min(helloCount - 1, 2)]);
  smiley.classList.toggle('wink');
  if (helloCount >= 3) smiley.setAttribute('aria-label', 'Secret found. Say hello again');
});

// An old-school secret, with no storage or tracking.
const konami = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];
let sequenceIndex = 0;
document.addEventListener('keydown', (event) => {
  const target = event.target as HTMLElement;
  if (
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    target.isContentEditable ||
    target.closest('input, textarea, select, dialog')
  )
    return;
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  sequenceIndex = key === konami[sequenceIndex] ? sequenceIndex + 1 : key === konami[0] ? 1 : 0;
  if (sequenceIndex === konami.length) {
    const enabled = document.documentElement.classList.toggle('retro-mode');
    notify(
      enabled
        ? 'Secret found: blueprint mode. Enter the code again to switch back.'
        : 'Back to the paper version.',
    );
    sequenceIndex = 0;
  }
});

// Only fetch game code when someone actually wants to play.
const dialog = document.querySelector<HTMLDialogElement>('#game-dialog')!;
document.querySelector<HTMLElement>('#game-fallback')!.hidden = true;
let activeGame: { destroy: () => void } | undefined;
let opening = false;
document.querySelectorAll<HTMLButtonElement>('[data-game]').forEach((button) => {
  button.hidden = false;
  button.addEventListener('click', async () => {
    if (opening || dialog.open) return;
    opening = true;
    button.setAttribute('aria-busy', 'true');
    try {
      const { startGame } = await import('./games');
      activeGame = startGame(button.dataset.game === 'clique' ? 'clique' : 'memory');
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    } catch {
      notify('The game couldn’t load. Please try again.');
    } finally {
      opening = false;
      button.removeAttribute('aria-busy');
    }
  });
});
dialog.querySelector('.dialog-close')!.addEventListener('click', () => dialog.close());
dialog.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab') return;
  const buttons = [...dialog.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')];
  const first = buttons[0];
  const last = buttons[buttons.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
});
dialog.addEventListener('click', (event) => {
  const bounds = dialog.getBoundingClientRect();
  if (
    event.target === dialog &&
    (event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom)
  )
    dialog.close();
});
dialog.addEventListener('close', () => {
  activeGame?.destroy();
  activeGame = undefined;
  document.body.style.overflow = '';
});
