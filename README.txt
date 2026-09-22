ALECU DIGITAL STRATEGIES

Dezarhiveaza fisierele si deschide index.html. Nu necesita instalare.

TRADUCERI
Textele RO/EN ale paginii, proiectelor si controalelor sunt in translations.js.
Modifica valoarea cheii dorite in obiectele ro si en (de exemplu "hero.title").
In index.html, data-i18n="hero.intro" afiseaza text simplu, iar
data-i18n-html="hero.title" permite markup local precum <br> si <em>.
i18n.js aplica traducerile la selectarea RO/EN; app.js foloseste I18n.t(cheie).
Pastreaza aceleasi chei in ambele limbi. O traducere lipsa foloseste romana.
Descrierile imaginilor raman langa caile lor, in project-images.js.
Include translations.js si i18n.js la publicare, inainte de app.js.

IMAGINI PROIECTE
1. Copiaza pozele in folderul images.
2. Deschide project-images.js intr-un editor de text.
3. Completeaza lista proiectului cu src (cale fisier), ro si en (descrieri alternative). Exemplu:

"DEM4PED": [
  { src: "images/dem4ped-01.jpg", ro: "Panoul principal", en: "Main dashboard" },
  { src: "images/dem4ped-02.jpg", ro: "Detalii energie", en: "Energy details" }
]

Lista goala: chenar. O imagine: afisare simpla. Doua sau mai multe: carusel cu sageti, indicatori, taste stanga/dreapta cand un control este selectat si swipe pe mobil. Fara derulare automata.
Nu uita sa incluzi folderul images la publicare.
Formularul deschide aplicatia de email, nu trimite automat.
