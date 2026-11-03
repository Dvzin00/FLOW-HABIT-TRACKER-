const KEY = 'vigilia-data-v1';
const initial = {
  habits: [
    { id: 'run', name: 'Movimento consciente', detail: 'CORRIDA · 30 MIN', streak: 4, icon: '🏃' },
    { id: 'read', name: 'Estudo noturno', detail: 'LEITURA · 20 MIN', streak: 8, icon: '📚' },
    { id: 'water', name: 'Hidratação', detail: 'META · 2 LITROS', streak: 2, icon: '💧' },
    { id: 'stretch', name: 'Mobilidade', detail: 'ALONGAMENTO · 10 MIN', streak: 1, icon: '🧘' }
  ],
  workouts: [],
  checks: {},
  createdAt: new Date().toISOString().slice(0, 10)
};

let data = load();
let dialogMode = '';
let toastTimer;

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    return { ...structuredClone(initial), ...saved, habits: saved.habits || structuredClone(initial.habits), workouts: saved.workouts || [], checks: saved.checks || {} };
  } catch {
    return structuredClone(initial);
  }
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(data));
  render();
}

const today = () => {
  const date = new Date();
  return dateKey(date);
};

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const dateFmt = (date, options = { day: '2-digit', month: 'short' }) => new Intl.DateTimeFormat('pt-BR', options).format(new Date(`${date}T12:00:00`));
const activityIcons = { Corrida: '🏃', Caminhada: '🚶', Academia: '🏋️', Ciclismo: '🚴', Alongamento: '🧘', Natação: '🏊', Outro: '✦' };
const habitIcons = { run: '🏃', read: '📚', water: '💧', stretch: '🧘' };

function isDone(id, date = today()) {
  return (data.checks[date] || []).includes(id);
}

function habitCard(habit) {
  const done = isDone(habit.id);
  const icon = habit.icon || habitIcons[habit.id] || '✦';
  return `<article class="habit-card ${done ? 'done' : ''}">
    <span class="habit-emblem"><span class="habit-emoji">${esc(icon)}</span></span>
    <div class="habit-info"><strong>${esc(habit.name)}</strong><small>${esc(habit.detail || 'ATIVIDADE PESSOAL')}</small></div>
    <div class="habit-streak"><span>${Number(habit.streak) || 0}</span> DIAS</div>
    <button class="check-button" data-check="${esc(habit.id)}" aria-label="${done ? 'Desmarcar' : 'Concluir'} ${esc(habit.name)}">${done ? '✓' : ''}</button>
  </article>`;
}

function homeHabitCard(habit) {
  const done = isDone(habit.id);
  return `<article class="habit-card eclipse-task ${done ? 'done' : ''}">
    <span class="eclipse-task-marker" aria-hidden="true"></span>
    <div class="habit-info"><strong>${esc(habit.name)}</strong><small>${esc(habit.detail || 'ATIVIDADE PESSOAL')}</small></div>
    <button class="check-button" data-check="${esc(habit.id)}" aria-label="${done ? 'Desmarcar' : 'Concluir'} ${esc(habit.name)}">${done ? '✓' : ''}</button>
  </article>`;
}

function iconFor(type) {
  return activityIcons[type] || activityIcons.Outro;
}

function renderWeek() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  document.getElementById('weekRange').textContent = `${dateFmt(dateKey(start), { day: '2-digit', month: 'short' }).toUpperCase()} — ${dateFmt(dateKey(end), { day: '2-digit', month: 'short' }).toUpperCase()}`;

  const dayNames = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'];
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return { date, key: dateKey(date), label: dayNames[index] };
  });
  const bars = days.map(day => {
    const rituals = (data.checks[day.key] || []).length;
    const workouts = data.workouts.filter(workout => workout.date === day.key).length;
    const actions = rituals + workouts;
    const baseline = data.habits.length ? rituals / data.habits.length * 100 : 0;
    const level = Math.max(actions ? 22 : 7, Math.min(100, baseline + workouts * 28));
    const active = actions > 0;
    return `<div class="week-beat ${active ? 'active' : ''} ${day.key === today() ? 'today' : ''}" aria-label="${day.label}, ${rituals} atividades concluídas e ${workouts} treinos">
      <span class="week-beat-count">${actions || '·'}</span><div class="week-beat-track"><i style="--beat-height:${level}%"></i></div><small>${day.label.slice(0, 1)}</small>
    </div>`;
  }).join('');
  document.getElementById('weekGrid').innerHTML = bars;

  const activeDays = days.filter(day => data.workouts.some(workout => workout.date === day.key) || (data.checks[day.key] || []).length > 0).length;
  document.getElementById('weekTotal').textContent = `${String(activeDays).padStart(2, '0')} / 07 DIAS`;
}

function render() {
  const now = new Date();
  document.getElementById('todayLabel').textContent = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' }).format(now).toUpperCase();
  document.getElementById('dayNumber').textContent = String(Math.max(1, Math.floor((Date.now() - new Date(`${data.createdAt || today()}T12:00:00`)) / 86400000) + 1)).padStart(3, '0');

  const doneCount = data.habits.filter(habit => isDone(habit.id)).length;
  const percent = data.habits.length ? Math.round(doneCount / data.habits.length * 100) : 0;
  document.getElementById('progressValue').textContent = `${percent}%`;
  document.getElementById('progressRing').style.strokeDashoffset = 314 - (314 * percent / 100);
  document.getElementById('habitList').innerHTML = data.habits.slice(0, 4).map(homeHabitCard).join('') || '<div class="empty-state">NENHUMA ATIVIDADE DEFINIDA.<br>CRIE O PRIMEIRO PASSO.</div>';
  document.getElementById('allHabitList').innerHTML = data.habits.map(habitCard).join('') || '<div class="empty-state">SEU PROTOCOLO COMEÇA COM UMA ESCOLHA.</div>';

  const workoutsToday = data.workouts.filter(workout => workout.date === today());
  const workoutMinutesToday = workoutsToday.reduce((total, workout) => total + (Number(workout.duration) || 0), 0);
  document.getElementById('trainingFeatureTitle').textContent = `${workoutMinutesToday} MIN`;
  document.getElementById('workoutSummary').innerHTML = workoutsToday.length
    ? `<div class="session-summary"><span>${esc(workoutsToday[0].type)} concluída.</span><small>${workoutsToday.length > 1 ? `${workoutsToday.length} SESSÕES` : 'HOJE'}${workoutsToday[0].distance ? ` · ${esc(workoutsToday[0].distance)} KM` : ''}</small></div>`
    : '<span class="summary-empty">SEM REGISTRO HOJE.<br>PRÓXIMA: ESCOLHER ATIVIDADE.</span>';

  renderWeek();
  document.getElementById('activityTypes').innerHTML = Object.keys(activityIcons).map(type => `<button class="type-card" data-quick-workout="${type}"><span class="animated-icon">${iconFor(type)}</span><small>${type.toUpperCase()}</small></button>`).join('');
  const history = [...data.workouts].sort((a, b) => b.date.localeCompare(a.date));
  document.getElementById('historyList').innerHTML = history.length
    ? history.map(workout => `<article class="history-item"><span class="activity-symbol animated-icon">${iconFor(workout.type)}</span><div class="history-meta"><strong>${esc(workout.type)}</strong><small>${dateFmt(workout.date)} · ${esc(workout.duration)} MIN${workout.distance ? ` · ${esc(workout.distance)} KM` : ''}</small></div>${workout.notes ? `<span class="history-value">${esc(workout.notes)}</span>` : ''}</article>`).join('')
    : '<div class="empty-state">SEU HISTÓRICO AINDA ESTÁ EM BRANCO.<br>O PRIMEIRO PASSO É O MAIS IMPORTANTE.</div>';

  const checkedTotal = Object.values(data.checks).reduce((total, checks) => total + checks.length, 0);
  document.getElementById('ritualCount').textContent = data.habits.length;
  document.getElementById('bestStreak').textContent = Math.max(0, ...data.habits.map(habit => Number(habit.streak) || 0));
  document.getElementById('totalWorkouts').textContent = data.workouts.length;
  document.getElementById('totalMinutes').textContent = data.workouts.reduce((total, workout) => total + (Number(workout.duration) || 0), 0);
  document.getElementById('totalHabitsDone').textContent = checkedTotal;
  document.getElementById('ritualSummary').textContent = `${String(doneCount).padStart(2, '0')} / ${String(data.habits.length).padStart(2, '0')}`;
}

function toggleHabit(id, date = today()) {
  const checks = data.checks[date] || [];
  const wasDone = checks.includes(id);
  data.checks[date] = wasDone ? checks.filter(item => item !== id) : [...checks, id];
  const habit = data.habits.find(item => item.id === id);
  if (habit && date === today()) habit.streak = Math.max(0, (Number(habit.streak) || 0) + (wasDone ? -1 : 1));
  toast(wasDone ? 'ATIVIDADE DESMARCADA' : 'ATIVIDADE CONCLUÍDA');
  save();
}

function field(label, name, type = 'text', placeholder = '', extra = '', required = true) {
  return `<div class="field"><label for="${name}">${label}</label><input id="${name}" name="${name}" type="${type}" placeholder="${placeholder}" ${extra} ${required ? 'required' : ''}></div>`;
}

function selectField(label, name, options) {
  return `<div class="field"><label for="${name}">${label}</label><select id="${name}" name="${name}">${options.map(option => `<option>${option}</option>`).join('')}</select></div>`;
}

function openHabit() {
  dialogMode = 'habit';
  document.getElementById('dialogEyebrow').textContent = 'NOVA ATIVIDADE';
  document.getElementById('dialogTitle').textContent = 'Criar hábito';
  document.getElementById('dialogFields').innerHTML = field('NOME DO HÁBITO', 'habitName', 'text', 'Ex.: alongamento ao acordar') + selectField('CATEGORIA', 'habitCategory', ['Bem-estar', 'Corrida', 'Caminhada', 'Academia', 'Mobilidade', 'Estudo', 'Outro']) + field('META OU NOTA (OPCIONAL)', 'habitNote', 'text', 'Ex.: 20 minutos', '', false);
  document.getElementById('entryDialog').showModal();
}

function openWorkout(defaultType) {
  dialogMode = 'workout';
  document.getElementById('dialogEyebrow').textContent = 'REGISTRO DE ATIVIDADE';
  document.getElementById('dialogTitle').textContent = 'Novo treino';
  document.getElementById('dialogFields').innerHTML = selectField('ATIVIDADE', 'workoutType', Object.keys(activityIcons)) + field('DURAÇÃO · MINUTOS', 'duration', 'number', '30', 'min="1" max="1440"') + field('DISTÂNCIA · KM (OPCIONAL)', 'distance', 'number', '5', 'min="0" step="0.01"', false) + field('DATA', 'workoutDate', 'date', '', `value="${today()}"`) + field('NOTA (OPCIONAL)', 'workoutNote', 'text', 'Ex.: treino leve', '', false);
  document.getElementById('entryDialog').showModal();
  if (defaultType) document.getElementById('workoutType').value = defaultType;
}

function toast(message) {
  const element = document.getElementById('toast');
  element.textContent = message;
  element.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove('show'), 1900);
}

function navigate(screen) {
  document.querySelectorAll('.screen').forEach(element => element.classList.toggle('active', element.dataset.screen === screen));
  document.querySelectorAll('.nav-item').forEach(element => element.classList.toggle('selected', element.dataset.nav === screen));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('click', event => {
  const check = event.target.closest('[data-check]');
  if (check) return toggleHabit(check.dataset.check, check.dataset.checkDate || today());
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (action === 'add-habit') openHabit();
  if (action === 'add-workout') openWorkout();
  const nav = event.target.closest('[data-nav]');
  if (nav) navigate(nav.dataset.nav);
  const quickWorkout = event.target.closest('[data-quick-workout]');
  if (quickWorkout) openWorkout(quickWorkout.dataset.quickWorkout);
});

document.getElementById('entryForm').addEventListener('submit', event => {
  if (event.submitter?.value === 'cancel') return;
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  if (dialogMode === 'habit') {
    const name = String(form.get('habitName') || '').trim();
    if (!name) return;
    const category = String(form.get('habitCategory'));
    const note = String(form.get('habitNote') || '').trim();
    data.habits.push({ id: crypto.randomUUID(), name, detail: `${category.toUpperCase()}${note ? ` · ${note.toUpperCase()}` : ''}`, streak: 0, icon: '✦' });
    toast('NOVA ATIVIDADE ADICIONADA');
  } else {
    data.workouts.push({ id: crypto.randomUUID(), type: form.get('workoutType'), duration: form.get('duration'), distance: form.get('distance'), date: form.get('workoutDate') || today(), notes: form.get('workoutNote') });
    toast('ATIVIDADE REGISTRADA');
  }
  document.getElementById('entryDialog').close();
  save();
});

document.getElementById('exportButton').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'flow-meus-dados.json';
  link.click();
  URL.revokeObjectURL(link.href);
  toast('ARQUIVO EXPORTADO');
});

document.getElementById('resetButton').addEventListener('click', () => {
  if (!confirm('Apagar permanentemente todos os hábitos e registros deste aparelho?')) return;
  data = structuredClone(initial);
  data.createdAt = today();
  save();
  toast('ARQUIVO LIMPO');
});

document.getElementById('settingsButton').addEventListener('click', () => navigate('perfil'));
render();
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
