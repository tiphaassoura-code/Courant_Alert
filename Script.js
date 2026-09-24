/**
 * Logique de l'application Courant Alert :
 * 1. Charger les donnees (localStorage si elles existent, sinon les
 *    quartiers de depart definis dans data.js)
 * 2. Afficher le formulaire, la liste et la carte
 * 3. Mettre à jour les trois en meme temps à chaque nouveau signalement
 */

// Cle utilisee pour stocker les donnees dans le localStorage du navigateur
const CLE_STOCKAGE = "courant-alert-donnees";

// Durée, en millisecondes, au-delà de laquelle un statut est considéré
// comme "pas frais" (objectif du PRD : au moins 70% des statuts affichés
// doivent dater de moins de 2 heures au moment de la démo).
// 2 heures = 2 * 60 minutes * 60 secondes * 1000 millisecondes
const DELAI_FRAICHEUR_MS = 2 * 60 * 60 * 1000;

// Variable globale qui contient l'etat actuel de tous les quartiers.
// Structure : { "Bacongo": { lat, lng, statut, heure }, ... }
let donneesQuartiers = {};

// Compteur global de signalements (nombre total reçu depuis le debut)
let nombreSignalements = 0;

// Reference à l'objet carte Leaflet, initialisée plus bas
let carte;

// On garde une reference à chaque marqueur pour pouvoir les mettre à jour
// sans avoir à recreer toute la carte à chaque signalement.
let marqueurs = {};


/* =====================================================
   1. CHARGEMENT DES DONNEES
   ===================================================== */

function chargerDonnees() {
  const donneesEnregistrees = localStorage.getItem(CLE_STOCKAGE);

  if (donneesEnregistrees) {
    // Des donnees existent deja dans le navigateur : on les reutilise.
    const parsed = JSON.parse(donneesEnregistrees);
    donneesQuartiers = parsed.quartiers;
    nombreSignalements = parsed.compteur;
  } else {
    // Premiere visite : on part de la liste initiale (data.js),
    // chaque quartier commence avec un statut "inconnu".
    QUARTIERS_INITIAUX.forEach((quartier) => {
      donneesQuartiers[quartier.nom] = {
        lat: quartier.lat,
        lng: quartier.lng,
        statut: "inconnu",
        heure: null,
        nombreSignalements: 0
      };
    });
    nombreSignalements = 0;
  }
}

function sauvegarderDonnees() {
  const aEnregistrer = {
    quartiers: donneesQuartiers,
    compteur: nombreSignalements
  };
  localStorage.setItem(CLE_STOCKAGE, JSON.stringify(aEnregistrer));
}


/* =====================================================
   2. FORMULAIRE
   ===================================================== */

function remplirListeDeroulanteQuartiers() {
  const select = document.getElementById("quartier");

  Object.keys(donneesQuartiers).forEach((nomQuartier) => {
    const option = document.createElement("option");
    option.value = nomQuartier;
    option.textContent = nomQuartier;
    select.appendChild(option);
  });
}

function initialiserFormulaire() {
  const formulaire = document.getElementById("formulaire-signalement");

  formulaire.addEventListener("submit", (evenement) => {
    // Empêche le rechargement de page par défaut d'un formulaire HTML
    evenement.preventDefault();

    const quartierChoisi = document.getElementById("quartier").value;
    const statutChoisi = document.getElementById("statut").value;

    enregistrerSignalement(quartierChoisi, statutChoisi);

    // On réinitialise le formulaire pour le prochain signalement
    formulaire.reset();
  });
}

function enregistrerSignalement(nomQuartier, statut) {
  const maintenant = new Date();

  donneesQuartiers[nomQuartier].statut = statut;
  donneesQuartiers[nomQuartier].heure = maintenant.toISOString();
  donneesQuartiers[nomQuartier].nombreSignalements =
    (donneesQuartiers[nomQuartier].nombreSignalements || 0) + 1;

 // Le compteur global recommence à 0 après le 10e signalement.
  // L'opérateur % (modulo) donne le reste d'une division : pour n'importe
  // quel nombre entre 0 et 9, (n + 1) % 10 = n + 1, mais à 9, (9 + 1) % 10
  // donne 0, ce qui fait "boucler" le compteur au lieu de continuer à 10.
  nombreSignalements = (nombreSignalements + 1) % 10;

  sauvegarderDonnees();

  // On met à jour les trois affichages concernes
  afficherCompteur();
  afficherListeQuartiers();
  mettreAJourMarqueur(nomQuartier);
}


/* =====================================================
   3. COMPTEUR
   ===================================================== */

function afficherCompteur() {
  document.getElementById("compteur-valeur").textContent = nombreSignalements;
}


/* =====================================================
   4. LISTE DES QUARTIERS
   ===================================================== */

function formaterHeure(heureISO) {
  if (!heureISO) {
    return "Aucun signalement pour l'instant";
  }
  const date = new Date(heureISO);
  return "Mis à jour à " + date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function estStatutFrais(heureISO) {
  // Un quartier jamais signalé n'a pas de statut "frais" à proprement
  // parler : on renvoie false pour ne pas afficher un badge trompeur.
  if (!heureISO) {
    return false;
  }
 
  const heureDuSignalement = new Date(heureISO);
  const maintenant = new Date();
 
  // La soustraction de deux objets Date donne directement un nombre de
  // millisecondes écoulées entre les deux — pas besoin de calcul manuel.
  const ecouleMs = maintenant - heureDuSignalement;
 
  return ecouleMs < DELAI_FRAICHEUR_MS;
}
 
function badgeFraicheur(heureISO) {
  // Pas de badge du tout si le quartier n'a jamais été signalé
  if (!heureISO) {
    return "";
  }
 
  if (estStatutFrais(heureISO)) {
    return `<span class="badge-fraicheur frais">Récent</span>`;
  }
 
  return `<span class="badge-fraicheur perime">Plus de 2h</span>`;
}

function afficherListeQuartiers() {
  const liste = document.getElementById("liste-quartiers");
  liste.innerHTML = ""; // On repart de zéro à chaque mise à jour

  Object.keys(donneesQuartiers).forEach((nomQuartier) => {
    const infos = donneesQuartiers[nomQuartier];

    const element = document.createElement("li");
    element.innerHTML = `
      <span>
        <span class="pastille ${infos.statut}"></span>
        ${nomQuartier}
        ${badgeFraicheur(infos.heure)}
      </span>
      <span class="heure-signalement">
        ${infos.nombreSignalements || 0} signalement(s) — ${formaterHeure(infos.heure)}
      </span>
    `;

    liste.appendChild(element);
  });
}


/* =====================================================
   5. CARTE INTERACTIVE (Leaflet)
   ===================================================== */

function couleurStatut(statut) {
  if (statut === "coupure") return "#c0392b";
  if (statut === "retour") return "#2f6f4f";
  return "#aaaaaa"; // statut "inconnu"
}

function creerIcone(statut) {
  return L.divIcon({
    className: "marqueur-couleur",
    html: `<div style="
      background:${couleurStatut(statut)};
      width:16px;
      height:16px;
      border-radius:50%;
      border:2px solid white;
      box-shadow:0 0 2px rgba(0,0,0,0.5);
    "></div>`,
    iconSize: [16, 16]
  });
}

function initialiserCarte() {
  carte = L.map("carte").setView(
    [CENTRE_BRAZZAVILLE.lat, CENTRE_BRAZZAVILLE.lng],
    14
  );

    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
    attribution: "© Esri, © OpenStreetMap contributors"
  }).addTo(carte);

  // On crée un marqueur pour chaque quartier connu au chargement
  Object.keys(donneesQuartiers).forEach((nomQuartier) => {
    const infos = donneesQuartiers[nomQuartier];

    const marqueur = L.marker([infos.lat, infos.lng], {
      icon: creerIcone(infos.statut)
    })
      .addTo(carte)
      .bindPopup(construirePopup(nomQuartier, infos))

       // bindTooltip avec permanent:true affiche le nom du quartier en
      // permanence à côté du marqueur, sans avoir besoin de cliquer dessus.
      .bindTooltip(nomQuartier, {
        permanent: true,
        direction: "right",
        offset: [10, 0],
        className: "etiquette-quartier"
      });

    marqueurs[nomQuartier] = marqueur;
  });
}

function construirePopup(nomQuartier, infos) {
  const libelleStatut =
    infos.statut === "coupure" ? "Coupure" :
    infos.statut === "retour" ? "Retour du courant" :
    "Statut inconnu";

  return `<b>${nomQuartier}</b><br>${libelleStatut}<br>${formaterHeure(infos.heure)}`;
}

function mettreAJourMarqueur(nomQuartier) {
  const infos = donneesQuartiers[nomQuartier];
  const marqueur = marqueurs[nomQuartier];

  marqueur.setIcon(creerIcone(infos.statut));
  marqueur.setPopupContent(construirePopup(nomQuartier, infos));
}


/* =====================================================
   6. DÉMARRAGE DE L'APPLICATION
   ===================================================== */

function demarrerApplication() {
  chargerDonnees();
  remplirListeDeroulanteQuartiers();
  initialiserFormulaire();
  afficherCompteur();
  afficherListeQuartiers();
  initialiserCarte();
}

// On attend que le HTML soit complètement chargé avant de démarrer
document.addEventListener("DOMContentLoaded", demarrerApplication);