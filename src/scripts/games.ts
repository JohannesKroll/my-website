type GameKind = 'memory' | 'clique';
type Card = { symbol: string; name: string };

export function startGame(kind: GameKind) {
  const title = document.querySelector<HTMLElement>('#game-title')!;
  const description = document.querySelector<HTMLElement>('#game-description')!;
  const board = document.querySelector<HTMLElement>('#game-board')!;
  const status = document.querySelector<HTMLElement>('#game-status')!;
  const counter = document.querySelector<HTMLElement>('#game-counter')!;
  const reset = document.querySelector<HTMLButtonElement>('#game-reset')!;
  const controller = new AbortController();
  let round: AbortController;
  let timeout: ReturnType<typeof setTimeout> | undefined;

  function begin() {
    clearTimeout(timeout);
    round?.abort();
    round = new AbortController();
    board.replaceChildren();
    status.textContent = '';
    counter.textContent = '';
    if (kind === 'memory') memory();
    else clique();
  }

  function memory() {
    title.textContent = 'Memory';
    description.textContent =
      'Turn over two cards at a time. Find all four pairs: code, curiosity, travel, and a little play. Use touch, mouse, or Tab and Enter.';
    const pairs: Card[] = [
      { symbol: '⌘', name: 'Code' },
      { symbol: '✳', name: 'Curiosity' },
      { symbol: '◎', name: 'Travel' },
      { symbol: '☺', name: 'Play' },
    ];
    const cards = [...pairs, ...pairs];
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    const grid = document.createElement('div');
    grid.className = 'memory-board';
    grid.setAttribute('role', 'group');
    grid.setAttribute('aria-label', 'Memory cards');
    board.append(grid);
    let first: number | null = null;
    let locked = false;
    let moves = 0;
    let found = 0;
    const matched = new Set<number>();
    const buttons: HTMLButtonElement[] = [];
    counter.textContent = '0 MOVES · 0/4 PAIRS';
    status.textContent = 'A fresh deck. Pick any card.';

    cards.forEach((card, index) => {
      const button = document.createElement('button');
      button.className = 'memory-card';
      button.textContent = '?';
      button.setAttribute('aria-label', `Card ${index + 1}, face down`);
      button.setAttribute('aria-pressed', 'false');
      buttons.push(button);
      grid.append(button);
      button.addEventListener(
        'click',
        () => {
          if (locked || matched.has(index) || first === index) return;
          button.textContent = card.symbol;
          button.classList.add('flipped');
          button.setAttribute('aria-label', `Card ${index + 1}, ${card.name}`);
          button.setAttribute('aria-pressed', 'true');
          if (first === null) {
            first = index;
            status.textContent = `${card.name}. Now look for its pair.`;
            return;
          }
          moves++;
          const previous = first;
          first = null;
          if (cards[previous].name === card.name) {
            found++;
            [previous, index].forEach((i) => {
              matched.add(i);
              buttons[i].classList.add('matched');
              buttons[i].setAttribute('aria-disabled', 'true');
              buttons[i].setAttribute('aria-label', `Card ${i + 1}, ${card.name}, matched`);
            });
            status.textContent =
              found === 4
                ? `All four pairs in ${moves} moves. ${moves === 4 ? 'A perfect little meeting of minds!' : 'A well-earned brain break. Nicely done!'}`
                : `A pair of ${card.name.toLowerCase()} cards! ${4 - found} pairs to go.`;
          } else {
            locked = true;
            status.textContent = `${cards[previous].name} and ${card.name}. Not a pair—keep exploring.`;
            timeout = setTimeout(() => {
              [previous, index].forEach((i) => {
                buttons[i].textContent = '?';
                buttons[i].classList.remove('flipped');
                buttons[i].setAttribute('aria-pressed', 'false');
                buttons[i].setAttribute('aria-label', `Card ${i + 1}, face down`);
              });
              locked = false;
            }, 1100);
          }
          counter.textContent = `${moves} ${moves === 1 ? 'MOVE' : 'MOVES'} · ${found}/4 PAIRS`;
        },
        { signal: round.signal },
      );
    });
  }

  function clique() {
    title.textContent = 'Find the clique';
    description.textContent =
      'Find the group of four dots where every dot has a direct line to every other dot. Select a dot to add it; select it again to remove it. No timer, no rush.';
    const points = [
      { x: 20, y: 24 },
      { x: 53, y: 17 },
      { x: 81, y: 35 },
      { x: 70, y: 73 },
      { x: 32, y: 82 },
      { x: 16, y: 57 },
    ];
    const edges = [
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 2],
      [1, 3],
      [2, 3],
      [0, 5],
      [4, 5],
      [3, 4],
      [2, 4],
    ];
    const selected = new Set<number>();
    const surface = document.createElement('div');
    surface.className = 'clique-board';
    surface.setAttribute('role', 'group');
    surface.setAttribute('aria-label', 'Connection puzzle. Each dot announces its connections.');
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');
    svg.classList.add('clique-lines');
    const lines = edges.map(([a, b]) => {
      const line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', String(points[a].x));
      line.setAttribute('y1', String(points[a].y));
      line.setAttribute('x2', String(points[b].x));
      line.setAttribute('y2', String(points[b].y));
      svg.append(line);
      return line;
    });
    surface.append(svg);
    board.append(surface);
    const key = document.createElement('p');
    key.className = 'clique-key';
    key.textContent = 'Inspired by my QAOA maximum-clique project. This one needs only you.';
    board.append(key);
    counter.textContent = '0/4 DOTS SELECTED';
    status.textContent = 'Every good group starts with one connection.';

    points.forEach((point, index) => {
      const button = document.createElement('button');
      button.className = 'graph-node';
      button.style.left = `${point.x}%`;
      button.style.top = `${point.y}%`;
      const label = String.fromCharCode(65 + index);
      const connections = edges
        .filter((edge) => edge.includes(index))
        .map((edge) => String.fromCharCode(65 + edge.find((i) => i !== index)!))
        .sort()
        .join(', ');
      button.textContent = label;
      button.setAttribute('aria-label', `Dot ${label}, connected to ${connections}`);
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener(
        'click',
        () => {
          if (selected.has(index)) selected.delete(index);
          else selected.add(index);
          button.setAttribute('aria-pressed', String(selected.has(index)));
          edges.forEach(([a, b], i) =>
            lines[i].classList.toggle('selected-edge', selected.has(a) && selected.has(b)),
          );
          const group = [...selected];
          const connected = group.every((a, i) =>
            group
              .slice(i + 1)
              .every((b) => edges.some((edge) => edge.includes(a) && edge.includes(b))),
          );
          counter.textContent = `${selected.size}/4 DOTS SELECTED`;
          status.textContent = !connected
            ? 'Not everyone has a direct connection. Try removing a dot or choosing another.'
            : selected.size === 4
              ? 'You found the clique! Four dots, six connections. Good company indeed.'
              : selected.size > 1
                ? `These ${selected.size} are all connected. Can you grow the group?`
                : 'A good start. Who else belongs in the group?';
        },
        { signal: round.signal },
      );
      surface.append(button);
    });
  }
  reset.addEventListener('click', begin, { signal: controller.signal });
  begin();
  return {
    destroy() {
      clearTimeout(timeout);
      round.abort();
      controller.abort();
    },
  };
}
