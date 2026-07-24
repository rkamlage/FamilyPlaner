# 👨‍👩‍👧‍👦 FamilyPlaner - Zeitplanung & Aktivitäten für Familien

Ein moderner, intelligenter Familien-Kalender und Aktivitätsplaner für Android und Web. **FamilyPlaner** hilft Familien, nicht nur den eigenen Alltag zu organisieren, sondern sich mühelos mit befreundeten Familien zu vernetzen, spontane Verabredungen der Kinder ("Ad-hoc Anfragen") zu koordinieren und gemeinsame Wünsche automatisch abzugleichen.

---

## 🌟 Hauptmerkmale

### 1. 👥 Flexibles Account- & Profilmodell
* **Eltern-Modus:** Volle Übersicht über Termine, Freigabe von Verabredungen externer Kinder, Verknüpfung befreundeter Familien und Organisation von Fahrgemeinschaften.
* **Selbstständige Kinder (eigenes Handy):** Eigener vereinfachter Login, Erstellen von Wünschen und Spontan-Anfragen mit direkter Rückmeldung.
* **Verwaltete Kinder (ohne Handy):** Eltern verwalten das Profil komplett mit (Eintragen von Wünschen, Antworten auf Anfragen).

### 2. ⚡ Ad-hoc Spontan-Anfragen ("Wer hat JETZT Lust?")
* Blitz-Anfragen für spontane Aktivitäten (z. B. *"Nick möchte heute um 15:00 Uhr Fußball spielen im Park"*).
* Push-Benachrichtigung an befreundete Familien.
* Quick-RSVP Buttons (*"Bin dabei!"*, *"Passt leider nicht"*, *"Ab 16 Uhr"*).

### 3. 🎯 Kinder-Wunschliste & Automatisches Matchmaking
* Kinder stellen Wünsche per Icon/Emoji ein (z. B. 🏊 Schwimmbad, 🎬 Kino, 🎲 Brettspiele).
* **Wish Match:** Die App erkennt Überschneidungen mit befreundeten Kindern und schlägt den Eltern automatisch gemeinsame Ausflüge vor.

### 4. 🚗 Fahrgemeinschaften (Carpooling)
* Bei gemeinsamen Terminen können Eltern angeben, wer hin- und wer zurückfährt.

---

## 🚀 Technologie & Setup

* **Frontend:** HTML5, Modern Vanilla CSS (Design Tokens, Glassmorphism, Micro-Animations), JavaScript (ES6+ State Management).
* **Cross-Platform Readiness:** Entwickelt als Mobile-First Progressive Web App (PWA) / Responsive Web App – direkt im mobilen Browser nutzbar oder exportierbar als Android App (Expo / Capacitor).
* **Version Control:** Git & GitHub Integration.

---

## 📂 Projektstruktur

```
FamilyPlaner/
├── index.html        # Haupt-Anwendungsseite (Mobile First Dashboard)
├── styles.css        # Modernes Design-System & Animationen
├── app.js            # Interaktive Logik, State-Management & Simulationen
├── README.md         # Dokumentation
└── .gitignore        # Git-Ausschlussregeln
```

---

## 🔧 Lokale Ausführung

Einfach `index.html` in einem modernen Browser öffnen oder über einen lokalen Webserver starten (z. B. Live Server oder `npx serve`).
