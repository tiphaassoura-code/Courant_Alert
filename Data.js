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
  { nom: "Bacongo",   lat: -4.295585, lng: 15.245811 },
  { nom: "Batignolles", lat: -4.259311 , lng: 15.258978 },
  { nom: "Plateaux",  lat: -4.275187 , lng: 15.287143 }
];

// Coordonnées approximatives du centre de Brazzaville, pour centrer la carte
const CENTRE_BRAZZAVILLE = { lat: -4.276694, lng: 15.263977 };