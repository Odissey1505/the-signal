/* ============================================================
   INKWELL AUTH — спільний вхід з Inkwell (той самий Supabase-проєкт)
   Сесія спільна, бо курс і Inkwell в одному домені odissey1505.github.io.
   ============================================================ */
const SB = window.supabase
  ? supabase.createClient(
      'https://yhekszqxheljbxoucalt.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZWtzenF4aGVsamJ4b3VjYWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MTE1NTIsImV4cCI6MjA5MDE4NzU1Mn0.cHUU9AFy2yUnfHXjqYTidmXaN6s3ybl0gi7U11eP4bY'
    )
  : null;
window.SB = SB;

document.addEventListener('DOMContentLoaded', async () => {
  const preview = new URLSearchParams(location.search).get('preview') === '1';
  if (!SB) {                       // бібліотека Supabase не завантажилась
    startCourse(null, 'offline');
    return;
  }
  const { data: { session } } = await SB.auth.getSession();
  if (!session) {
    if (preview) { startCourse(null, 'preview'); return; }
    location.href = 'https://odissey1505.github.io/inkwell/';
    return;
  }
  startCourse(session.user);
});
