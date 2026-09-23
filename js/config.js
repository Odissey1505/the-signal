/* ============================================================
   THE SIGNAL — налаштування
   Вхід через Inkwell — у js/auth.js.
   Таблиця прогресу — sql/signal_progress.sql.
   ?preview=1 — відкрити без входу · ?teacher=1 — Teacher view (лише для викладачів)
   ============================================================ */
window.SIGNAL_CONFIG = {
  INKWELL_URL: "https://odissey1505.github.io/inkwell/",
  PROGRESS_TABLE: "signal_progress",
  COURSE_ID: "the-signal-8",
  STORAGE_KEY: "signal8:progress:v2",
  VERSION: "1.1.0"          // змініть після оновлення уроків, щоб браузери не брали старі файли з кешу
};

/* Уроки реєструються тут, коли підвантажуються файли з lessons/ */
window.SIGNAL_LESSONS = window.SIGNAL_LESSONS || {};
