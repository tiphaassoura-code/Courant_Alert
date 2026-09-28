/**
 * Liste de départ des quartiers de Brazzaville, avec des coordonnées GPS
 * APPROXIMATIVES (à vérifier et remplacer par les données exactes que le
 * PM doit fournir). Chaque quartier commence sans statut connu ("inconnu").
 *
 * Structure : un tableau d'objets, un objet par quartier.
 *   nom   : nom affiché du quartier
 *   lat   : latitude
 *   lng   : longitude
 */

const QUARTIERS_INITIAUX = [
  { nom: "Bacongo",   lat: -4.2932, lng: 15.2579 },
  { nom: "Batignolles", lat: -4.2751, lng: 15.2589 },
  { nom: "Diata",  lat:  -4.2707, lng: 15.2458 },
  { nom: "Makélékélé",  lat:  -4.2706, lng: 15.2152 },
  { nom: "Mampassi",  lat:  -4.2462, lng: 15.2835 },
  { nom: "Mayanga",  lat:  -4.2692, lng: 15.2931 },
  { nom: "Mfilou",  lat:  -4.26634, lng: 15.2234 },
  { nom: "Mpila",  lat:  -4.2559, lng: 15.2952 },
  { nom: "Moukondo",  lat:  -4.2316, lng: 15.2680 },
  { nom: "Moungali",  lat:  -4.2527, lng: 15.2617 },
  { nom: "Mpissa",  lat:  -4.3052, lng: 15.2519 },
  { nom: "Nkombo",  lat:  -4.1919, lng: 15.2467 },
  { nom: "Plateaux des 15ans",  lat:  -4.25946, lng: 15.26274 },
  { nom: "Poto-poto",  lat:  -4.2661, lng: 15.2832 },
  { nom: "Talangaï",  lat:  -4.2323, lng: 15.2874 }
];

// Coordonnées approximatives du centre de Brazzaville, pour centrer la carte
const CENTRE_BRAZZAVILLE = { lat: -4.276694, lng: 15.263977 };