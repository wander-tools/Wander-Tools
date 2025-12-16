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
        
        // Load both app settings and tool settings
        const [appDoc, toolsDoc] = await Promise.all([
          db.collection('settings').doc('app').get(),
          db.collection('settings').doc('tools').get()
        ]);
        
        const appData = appDoc.exists ? appDoc.data() : {};
        const globalLoginRequired = !!(appData.loginRequired);
        
        // Get current tool path from window location
        // Example: tools/image-tools/image-resizer.html (must match admin panel format)
        let toolPath = null;
        
        // Extract tool path from current page URL
        const currentUrl = window.location.href;
        const currentPathname = window.location.pathname;
        
        // Debug: Log current URL info
        console.log('Login Guard - Current URL:', currentUrl);
        console.log('Login Guard - Current Pathname:', currentPathname);
        
        // Method 1: Try to find 'tools/' in the full URL (most reliable)
        const toolsMatch = currentUrl.match(/tools\/[^?#]+\.html/);
        if (toolsMatch) {
          toolPath = toolsMatch[0];
        } else {
          // Method 2: Try pathname directly
          const pathMatch = currentPathname.match(/tools\/.+\.html$/);
          if (pathMatch) {
            toolPath = pathMatch[0];
          } else {
            // Method 3: Construct from pathname parts
            const pathParts = currentPathname.split('/').filter(p => p);
            const toolsIdx = pathParts.indexOf('tools');
            if (toolsIdx !== -1 && toolsIdx < pathParts.length - 1) {
              const remainingParts = pathParts.slice(toolsIdx + 1);
              toolPath = 'tools/' + remainingParts.join('/');
            }
          }
        }
        
        // Normalize tool path - ensure it matches admin panel format exactly
        // Format should be: tools/image-tools/image-resizer.html (no leading slash)
        if (toolPath) {
          // Remove any leading slashes or ../ 
          toolPath = toolPath.replace(/^\.\.\//g, '').replace(/^\//, '');
          // Ensure it starts with 'tools/' (not /tools/)
          if (!toolPath.startsWith('tools/')) {
            // If it starts with just 'tools', add the rest
            if (toolPath.startsWith('tools')) {
              toolPath = toolPath.replace(/^tools/, 'tools');
            } else {
              toolPath = 'tools/' + toolPath;
            }
          }
        }
        
        console.log('Login Guard - Detected Tool Path:', toolPath);
        
        // Check if login is required
        let needLogin = false;
        
        // First check global setting
        if (globalLoginRequired) {
          needLogin = true;
          console.log('Login Guard - Global login required is enabled');
        } else {
          // Check individual tool setting
          if (toolPath && toolsDoc.exists) {
            const toolSettings = toolsDoc.data() || {};
            // Generate toolId same way as admin panel (replace / and . with _)
            const toolId = toolPath.replace(/[\/\.]/g, '_');
            console.log('Login Guard - Tool ID:', toolId);
            console.log('Login Guard - Tool Settings:', toolSettings);
            console.log('Login Guard - Tool Setting for this tool:', toolSettings[toolId]);
            needLogin = toolSettings[toolId] === true;
            
            if (needLogin) {
              console.log('Login Guard - Tool requires login:', toolPath, 'toolId:', toolId);
            } else {
              console.log('Login Guard - Tool does not require login');
            }
          } else {
            console.log('Login Guard - Tool path not found or tools doc does not exist');
            if (!toolPath) console.log('Login Guard - toolPath is null');
            if (!toolsDoc.exists) console.log('Login Guard - toolsDoc does not exist');
          }
        }
        
        // If login not required, allow access
        if (!needLogin) return;
        
        // Check if user is logged in
        const user = auth.currentUser;
        if (user) return; // User is logged in, allow access
        
        // No user and login required, enforce redirect to home where login modal is available
        const dest = '../../index.html#login-required';
        try {
          // small UX: show a blocking overlay for a moment then redirect
          const overlay = document.createElement('div');
          overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;z-index:3000;font-size:18px;';
          overlay.textContent = 'Please sign in to use this tool...';
          document.body.appendChild(overlay);
          setTimeout(() => {
            window.location.href = dest;
          }, 1500);
        } catch(_) {
          window.location.href = dest;
        }
      } catch(err) { 
        console.error('Login guard error:', err);
        // fail-open if settings can't be read - allow access
      }
    }

    // Run after current tick to avoid blocking first paint
    setTimeout(runGuard, 0);
  })();
})();


