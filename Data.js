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
  { nom: "Plateaux",  lat:  -4.2634, lng: 15.2832 }
];

// Coordonnées approximatives du centre de Brazzaville, pour centrer la carte
const CENTRE_BRAZZAVILLE = { lat: -4.276694, lng: 15.263977 };