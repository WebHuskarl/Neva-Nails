/**
 * timer.js — Countdown timer for offers
 * Usage: <element data-timer data-deadline="2026-08-01T23:59:59">
 *   contains [data-timer-days], [data-timer-hours], [data-timer-minutes], [data-timer-seconds]
 */

export function initTimers() {
  const timers = document.querySelectorAll('[data-timer]');
  if (!timers.length) return;

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function updateTimer(timerEl) {
    const deadline = new Date(timerEl.dataset.deadline).getTime();
    const now      = Date.now();
    const diff     = deadline - now;

    const daysEl    = timerEl.querySelector('[data-timer-days]');
    const hoursEl   = timerEl.querySelector('[data-timer-hours]');
    const minutesEl = timerEl.querySelector('[data-timer-minutes]');
    const secondsEl = timerEl.querySelector('[data-timer-seconds]');

    if (diff <= 0) {
      if (daysEl)    daysEl.textContent    = '00';
      if (hoursEl)   hoursEl.textContent   = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl)    daysEl.textContent    = pad(days);
    if (hoursEl)   hoursEl.textContent   = pad(hours);
    if (minutesEl) minutesEl.textContent = pad(minutes);
    if (secondsEl) secondsEl.textContent = pad(seconds);
  }

  timers.forEach(timerEl => {
    if (!timerEl.dataset.deadline) return;
    updateTimer(timerEl);
    setInterval(() => updateTimer(timerEl), 1000);
  });
}
