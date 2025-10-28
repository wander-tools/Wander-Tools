// Inject a floating Wander Tools home logo button on tool pages
(function(){
  try {
    if (document.getElementById('wt-home-logo-btn')) return;
    const style = document.createElement('style');
    style.textContent = `
      .wt-home-logo-btn{position:fixed;left:16px;top:16px;width:46px;height:46px;border-radius:50%;background:var(--primary-color, #4361ee);color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 18px rgba(0,0,0,.18);text-decoration:none;z-index:2000;transition:transform .2s ease, background .2s ease}
      .wt-home-logo-btn:hover{transform:translateY(-2px);background:var(--secondary-color, #3f37c9)}
      .wt-home-logo-btn i{font-size:1.2rem}
    `;
    document.head.appendChild(style);
    const a = document.createElement('a');
    a.id = 'wt-home-logo-btn';
    a.className = 'wt-home-logo-btn';
    a.href = '../../index.html';
    a.setAttribute('aria-label','Go to Wander Tools Home');
    a.innerHTML = '<i class="fas fa-tools"></i>';
    document.body.appendChild(a);
  } catch(_) {}
  
  // Lightweight auth guard – blocks direct access when loginRequired is enabled
  (function guard(){
    const FIREBASE_APP = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js';
    const FIREBASE_AUTH = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js';
    const FIREBASE_STORE = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js';
    const cfg = {
      apiKey: "AIzaSyBCIRviVtANQrb72IZzyNlQMuCzsIATP7k",
      authDomain: "wander-tools.firebaseapp.com",
      projectId: "wander-tools",
      storageBucket: "wander-tools.firebasestorage.app",
      messagingSenderId: "911828766491",
      appId: "1:911828766491:web:e38541bd54996adea5cdbe",
      measurementId: "G-GY19ZGWP4K"
    };

    function loadScript(src){
      return new Promise((resolve, reject)=>{
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const s = document.createElement('script'); s.src = src; s.onload = resolve; s.onerror = reject; document.head.appendChild(s);
      });
    }

    async function ensureFirebase(){
      if (window.firebase && window.firebase.apps && window.firebase.apps.length) return;
      await loadScript(FIREBASE_APP);
      await loadScript(FIREBASE_AUTH);
      await loadScript(FIREBASE_STORE);
      if (!window.firebase?.apps?.length) { window.firebase.initializeApp(cfg); }
      try { window.firebase.auth().setPersistence(window.firebase.auth.Auth.Persistence.LOCAL).catch(()=>{}); } catch(_) {}
    }

    async function runGuard(){
      try {
        await ensureFirebase();
        const db = window.firebase.firestore();
        const auth = window.firebase.auth();
        const doc = await db.collection('settings').doc('app').get();
        const needLogin = !!(doc.exists && (doc.data()||{}).loginRequired);
        if (!needLogin) return; // open access
        const user = auth.currentUser;
        if (user) return; // allowed
        // No user, enforce redirect to home where login modal is available
        const dest = '../../index.html#login-required';
        try {
          // small UX: show a blocking overlay for a moment then redirect
          const overlay = document.createElement('div');
          overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;z-index:3000;';
          overlay.textContent = 'Please sign in to use this tool...';
          document.body.appendChild(overlay);
        } catch(_) {}
        window.location.href = dest;
      } catch(_) { /* fail-open if settings can't be read */ }
    }

    // Run after current tick to avoid blocking first paint
    setTimeout(runGuard, 0);
  })();
})();


