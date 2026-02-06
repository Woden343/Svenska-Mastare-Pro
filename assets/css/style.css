/* ============================================
   SVENSKA MÄSTARE PRO - CSS MODERNE
   Design professionnel avec animations fluides
============================================ */

:root {
  /* Couleurs principales - Palette moderne */
  --bg-primary: #0a0e16;
  --bg-secondary: #141b26;
  --bg-elevated: #1a2332;
  
  --text-primary: #f0f4f8;
  --text-secondary: #a8b8cc;
  --text-muted: #6b7a8f;
  
  --accent-blue: #5b9eff;
  --accent-blue-hover: #4a8fef;
  --accent-purple: #8b7ff6;
  --accent-green: #5dd694;
  --accent-yellow: #ffc247;
  --accent-red: #ff6b7a;
  
  /* Gradients modernes */
  --gradient-primary: linear-gradient(135deg, #5b9eff 0%, #8b7ff6 100%);
  --gradient-success: linear-gradient(135deg, #5dd694 0%, #3ab76e 100%);
  --gradient-card: linear-gradient(135deg, rgba(91, 158, 255, 0.05) 0%, rgba(139, 127, 246, 0.05) 100%);
  
  /* Glassmorphism */
  --glass-bg: rgba(26, 35, 50, 0.7);
  --glass-border: rgba(255, 255, 255, 0.08);
  
  /* Ombres élégantes */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.12);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.16);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.24);
  --shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.32);
  
  /* Border radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-full: 9999px;
  
  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* ============================================
   BASE & RESET
============================================ */

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  overflow-x: hidden;
}

/* Background animé subtil */
body::before {
  content: '';
  position: fixed;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 30% 50%, rgba(91, 158, 255, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(139, 127, 246, 0.05) 0%, transparent 50%);
  animation: backgroundPulse 20s ease-in-out infinite;
  pointer-events: none;
  z-index: -1;
}

@keyframes backgroundPulse {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-5%, -5%); }
}

/* ============================================
   LAYOUT
============================================ */

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px;
}

@media (max-width: 768px) {
  .container {
    padding: 16px;
  }
}

/* ============================================
   TOPBAR MODERNE
============================================ */

.topbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  
  /* Glassmorphism effect */
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  
  border-bottom: 1px solid var(--glass-border);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  
  transition: all var(--transition-base);
}

.topbar.scrolled {
  padding: 12px 24px;
  box-shadow: var(--shadow-lg);
}

@media (max-width: 768px) {
  .topbar {
    padding: 12px 16px;
    flex-wrap: wrap;
    gap: 12px;
  }
}

/* ============================================
   BRAND & LOGO
============================================ */

.brand {
  font-weight: 800;
  font-size: 20px;
  letter-spacing: -0.5px;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform var(--transition-fast);
}

.brand:hover {
  transform: scale(1.02);
}

.brand::before {
  content: '🇸🇪';
  font-size: 24px;
  -webkit-text-fill-color: initial;
}

/* ============================================
   NAVIGATION
============================================ */

.topnav {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

/* ============================================
   BUTTONS MODERNES
============================================ */

.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  
  padding: 10px 20px;
  border-radius: var(--radius-full);
  
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  white-space: nowrap;
  
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-primary);
  
  cursor: pointer;
  transition: all var(--transition-base);
  overflow: hidden;
}

/* Effet de brillance au hover */
.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left var(--transition-slow);
}

.btn:hover::before {
  left: 100%;
}

.btn:hover {
  border-color: rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn:active {
  transform: translateY(0);
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none !important;
}

/* Variantes de boutons */
.btn-primary {
  background: var(--gradient-primary);
  border: none;
  color: white;
  font-weight: 700;
  box-shadow: 0 4px 16px rgba(91, 158, 255, 0.3);
}

.btn-primary:hover {
  box-shadow: 0 8px 24px rgba(91, 158, 255, 0.4);
  transform: translateY(-3px);
}

.btn-success {
  background: var(--gradient-success);
  border: none;
  color: white;
  box-shadow: 0 4px 16px rgba(93, 214, 148, 0.3);
}

.btn-ghost {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

/* ============================================
   CARDS ÉLÉGANTES
============================================ */

.card {
  position: relative;
  background: var(--bg-elevated);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  padding: 24px;
  
  transition: all var(--transition-base);
  overflow: hidden;
}

/* Gradient subtil en background */
.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--gradient-primary);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.card:hover::before {
  opacity: 1;
}

.card:hover {
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

.card h3 {
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.3px;
  color: var(--text-primary);
}

.card h4 {
  margin: 16px 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--accent-blue);
}

.card p {
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 12px;
}

/* Card avec accent coloré */
.card-accent {
  background: linear-gradient(135deg, rgba(91, 158, 255, 0.08) 0%, rgba(139, 127, 246, 0.08) 100%);
  border-color: rgba(91, 158, 255, 0.2);
}

/* ============================================
   GRID SYSTEM
============================================ */

.grid {
  display: grid;
  gap: 20px;
}

.grid-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.grid-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

@media (max-width: 1024px) {
  .grid-3 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .grid-2, .grid-3 {
    grid-template-columns: 1fr;
  }
}

/* ============================================
   PILLS & BADGES
============================================ */

.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  
  padding: 6px 14px;
  border-radius: var(--radius-full);
  
  font-size: 13px;
  font-weight: 600;
  
  background: rgba(91, 158, 255, 0.15);
  color: var(--accent-blue);
  border: 1px solid rgba(91, 158, 255, 0.3);
  
  transition: all var(--transition-fast);
}

.pill:hover {
  background: rgba(91, 158, 255, 0.25);
  transform: scale(1.05);
}

.pill-success {
  background: rgba(93, 214, 148, 0.15);
  color: var(--accent-green);
  border-color: rgba(93, 214, 148, 0.3);
}

.pill-warning {
  background: rgba(255, 194, 71, 0.15);
  color: var(--accent-yellow);
  border-color: rgba(255, 194, 71, 0.3);
}

.pill-error {
  background: rgba(255, 107, 122, 0.15);
  color: var(--accent-red);
  border-color: rgba(255, 107, 122, 0.3);
}

/* ============================================
   KPI / STATS
============================================ */

.kpi {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.kpi .pill {
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-primary);
  border-color: rgba(255, 255, 255, 0.12);
  padding: 10px 16px;
  font-size: 14px;
}

.kpi .pill:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* ============================================
   FORMS MODERNES
============================================ */

input, textarea, select {
  width: 100%;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.12);
  
  font-size: 15px;
  font-family: inherit;
  
  transition: all var(--transition-base);
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: var(--accent-blue);
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 0 0 3px rgba(91, 158, 255, 0.15);
}

input::placeholder, textarea::placeholder {
  color: var(--text-muted);
}

/* ============================================
   CHOICES / OPTIONS
============================================ */

.choice {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  
  padding: 14px 16px;
  border-radius: var(--radius-md);
  
  border: 2px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  
  cursor: pointer;
  transition: all var(--transition-base);
}

.choice:hover {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.06);
  transform: translateX(4px);
}

.choice.correct {
  border-color: rgba(93, 214, 148, 0.6);
  background: rgba(93, 214, 148, 0.1);
  animation: successPulse 0.5s ease;
}

.choice.wrong {
  border-color: rgba(255, 107, 122, 0.6);
  background: rgba(255, 107, 122, 0.1);
  animation: shake 0.5s ease;
}

@keyframes successPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}

/* ============================================
   TABLES PROFESSIONNELLES
============================================ */

.table-wrap {
  overflow-x: auto;
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: var(--bg-elevated);
  box-shadow: var(--shadow-sm);
}

table.zebra {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

table.zebra th, table.zebra td {
  padding: 14px 16px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 14px;
}

table.zebra th {
  position: sticky;
  top: 0;
  background: var(--bg-secondary);
  backdrop-filter: blur(10px);
  font-weight: 700;
  color: var(--text-primary);
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.5px;
  border-bottom: 2px solid rgba(91, 158, 255, 0.3);
  z-index: 10;
}

table.zebra tbody tr {
  transition: background var(--transition-fast);
}

table.zebra tbody tr:nth-child(even) {
  background: rgba(255, 255, 255, 0.02);
}

table.zebra tbody tr:hover {
  background: rgba(91, 158, 255, 0.08);
  cursor: pointer;
}

/* ============================================
   UTILITIES
============================================ */

.muted {
  color: var(--text-muted);
  font-weight: 500;
}

hr {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin: 20px 0;
}

.text-center {
  text-align: center;
}

.text-gradient {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ============================================
   FOOTER
============================================ */

.footer {
  padding: 32px 24px;
  text-align: center;
  color: var(--text-muted);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  margin-top: 48px;
}

.footer a {
  color: var(--accent-blue);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.footer a:hover {
  color: var(--accent-blue-hover);
  text-decoration: underline;
}

/* ============================================
   ANIMATIONS GLOBALES
============================================ */

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.fade-in {
  animation: fadeIn 0.4s ease;
}

.slide-in {
  animation: slideInRight 0.4s ease;
}

/* ============================================
   SCROLLBAR PERSONNALISÉE
============================================ */

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}

/* ============================================
   LOADING STATES
============================================ */

.loading {
  position: relative;
  pointer-events: none;
  opacity: 0.6;
}

.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid var(--accent-blue);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ============================================
   RESPONSIVE TWEAKS
============================================ */

@media (max-width: 640px) {
  body {
    font-size: 14px;
  }
  
  .card {
    padding: 16px;
  }
  
  .btn {
    padding: 8px 16px;
    font-size: 13px;
  }
  
  .brand {
    font-size: 18px;
  }
}

/* ============================================
   DARK MODE ENHANCEMENTS
============================================ */

@media (prefers-color-scheme: dark) {
  /* Déjà en dark mode par défaut */
}

/* ============================================
   PRINT STYLES
============================================ */

@media print {
  .topbar, .footer, .btn {
    display: none !important;
  }
  
  .card {
    border: 1px solid #000;
    box-shadow: none;
    page-break-inside: avoid;
  }
}
