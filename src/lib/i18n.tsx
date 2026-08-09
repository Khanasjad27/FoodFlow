import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'es' | 'fr';

export interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
  label: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇬🇧', label: 'English' },
  { code: 'es', name: 'Español', flag: '🇪🇸', label: 'Español' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', label: 'Français' },
];

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Navigation & Settings
    'nav.switchDemo': 'Switch Demo Account',
    'nav.settings': 'Settings',
    'nav.guidedTour': 'Guided Tour',
    'nav.signOut': 'Sign Out',
    'nav.restaurantPortal': 'Restaurant Portal',
    'nav.ngoPortal': 'NGO Partner Portal',
    'nav.selectLanguage': 'Select Language',
    'nav.highContrast': 'High-Contrast Mode',
    'nav.userSettings': 'User Settings',
    'nav.resetData': 'Reset Sample Data',

    // Dashboards
    'dashboard.availableSurplus': 'Available Surplus Food',
    'dashboard.postSurplus': 'Post Surplus Food',
    'dashboard.myImpact': 'My Impact Stats',
    'dashboard.mealsSaved': 'Meals Saved',
    'dashboard.kgRescued': 'Kg Rescued',
    'dashboard.co2Avoided': 'CO₂ Avoided',
    'dashboard.claimListing': 'Claim Listing',
    'dashboard.confirmPickup': 'Confirm Pickup',
    'dashboard.showQr': 'Show QR Code',
    'dashboard.sustainabilityBadges': 'Sustainability Badges',
    'dashboard.aiMatch': 'AI Match Score',
    'dashboard.nearbyRadar': 'Live Proximity Radar',
    'dashboard.searchFilter': 'Filter listings by food or location...',
    'dashboard.foodType': 'Food Type',
    'dashboard.servings': 'Servings',
    'dashboard.expires': 'Expires',

    // Achievements
    'achievements.title': 'Eco Impact Progress',
    'achievements.subtitle': 'Earn official zero-waste badges based on total kilograms of food saved.',
    'achievements.unlocked': 'Badges Unlocked',
    'achievements.share': 'Share Achievement',
    'achievements.totalRescued': 'Total Food Rescued',

    // AI Chat Assistant
    'chat.title': 'FoodFlow AI Assistant',
    'chat.subtitle': 'Smart Food Match & Safety Consultant',
    'chat.placeholder': 'Ask AI about listings, nearby food, or safety rules...',
    'chat.closestListing': '📍 What is the closest listing to me?',
    'chat.myLocation': '📍 Show my current location',
    'chat.myStats': '📊 Show my ESG impact stats',
    'chat.howMatchWorks': '⚡ How does Match Score work?',
  },
  es: {
    // Navigation & Settings
    'nav.switchDemo': 'Cambiar Cuenta Demo',
    'nav.settings': 'Configuración',
    'nav.guidedTour': 'Tour Guiado',
    'nav.signOut': 'Cerrar Sesión',
    'nav.restaurantPortal': 'Portal Restaurantes',
    'nav.ngoPortal': 'Portal Socios ONG',
    'nav.selectLanguage': 'Seleccionar Idioma',
    'nav.highContrast': 'Modo Alto Contraste',
    'nav.userSettings': 'Ajustes de Usuario',
    'nav.resetData': 'Restablecer Datos',

    // Dashboards
    'dashboard.availableSurplus': 'Alimentos Excedentes Disponibles',
    'dashboard.postSurplus': 'Publicar Alimento Excedente',
    'dashboard.myImpact': 'Mis Estadísticas de Impacto',
    'dashboard.mealsSaved': 'Comidas Salvadas',
    'dashboard.kgRescued': 'Kg Rescatados',
    'dashboard.co2Avoided': 'CO₂ Evitado',
    'dashboard.claimListing': 'Reclamar Alimento',
    'dashboard.confirmPickup': 'Confirmar Recogida',
    'dashboard.showQr': 'Mostrar Código QR',
    'dashboard.sustainabilityBadges': 'Insignias de Sostenibilidad',
    'dashboard.aiMatch': 'Coincidencia IA',
    'dashboard.nearbyRadar': 'Radar de Proximidad en Vivo',
    'dashboard.searchFilter': 'Filtrar alimentos por nombre o ubicación...',
    'dashboard.foodType': 'Tipo de Comida',
    'dashboard.servings': 'Raciones',
    'dashboard.expires': 'Vence',

    // Achievements
    'achievements.title': 'Progreso de Impacto Ecológico',
    'achievements.subtitle': 'Obtén insignias oficiales de cero residuos según los kilos de comida rescatados.',
    'achievements.unlocked': 'Insignias Desbloqueadas',
    'achievements.share': 'Compartir Logro',
    'achievements.totalRescued': 'Total Alimento Rescatado',

    // AI Chat Assistant
    'chat.title': 'Asistente IA FoodFlow',
    'chat.subtitle': 'Consultor de Coincidencia e Higiene Alimentaria',
    'chat.placeholder': 'Pregunta a la IA sobre excedentes, ubicaciones o normas...',
    'chat.closestListing': '📍 ¿Cuál es la oferta más cercana?',
    'chat.myLocation': '📍 Mostrar mi ubicación actual',
    'chat.myStats': '📊 Mostrar mis estadísticas de impacto',
    'chat.howMatchWorks': '⚡ ¿Cómo funciona la coincidencia IA?',
  },
  fr: {
    // Navigation & Settings
    'nav.switchDemo': 'Changer de compte démo',
    'nav.settings': 'Paramètres',
    'nav.guidedTour': 'Visite Guidée',
    'nav.signOut': 'Déconnexion',
    'nav.restaurantPortal': 'Portail Restaurant',
    'nav.ngoPortal': 'Portail Partenaire ONG',
    'nav.selectLanguage': 'Choisir la Langue',
    'nav.highContrast': 'Mode Haut Contraste',
    'nav.userSettings': 'Paramètres Utilisateur',
    'nav.resetData': 'Réinitialiser les données',

    // Dashboards
    'dashboard.availableSurplus': 'Surplus Alimentaires Disponibles',
    'dashboard.postSurplus': 'Publier un Surplus',
    'dashboard.myImpact': 'Mes Statistiques d\'Impact',
    'dashboard.mealsSaved': 'Repas Sauvés',
    'dashboard.kgRescued': 'Kg Sauvés',
    'dashboard.co2Avoided': 'CO₂ Évité',
    'dashboard.claimListing': 'Réclamer l\'Offre',
    'dashboard.confirmPickup': 'Confirmer la Collecte',
    'dashboard.showQr': 'Afficher le Code QR',
    'dashboard.sustainabilityBadges': 'Badges de Durabilité',
    'dashboard.aiMatch': 'Score d\'Ajustement IA',
    'dashboard.nearbyRadar': 'Radar de Proximité en Direct',
    'dashboard.searchFilter': 'Filtrer les offres par type ou lieu...',
    'dashboard.foodType': 'Type d\'Aliment',
    'dashboard.servings': 'Portions',
    'dashboard.expires': 'Expire le',

    // Achievements
    'achievements.title': 'Progrès d\'Impact Écologique',
    'achievements.subtitle': 'Gagnez des badges zéro déchet officiels basés sur les kilos de nourriture sauvés.',
    'achievements.unlocked': 'Badges Débloqués',
    'achievements.share': 'Partager le Succès',
    'achievements.totalRescued': 'Nourriture Totale Sauvée',

    // AI Chat Assistant
    'chat.title': 'Assistant IA FoodFlow',
    'chat.subtitle': 'Conseiller en Sécurité Alimentaire et Proximité',
    'chat.placeholder': 'Posez une question sur les offres, la sécurité ou la distance...',
    'chat.closestListing': '📍 Quelle est l\'offre la plus proche ?',
    'chat.myLocation': '📍 Afficher ma position actuelle',
    'chat.myStats': '📊 Afficher mes statistiques d\'impact',
    'chat.howMatchWorks': '⚡ Comment fonctionne le score d\'ajustement ?',
  },
};

const LANGUAGE_KEY = 'foodflow_language';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem(LANGUAGE_KEY);
    if (stored === 'es' || stored === 'fr' || stored === 'en') {
      return stored;
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_KEY, lang);
  };

  const t = (key: string, fallback?: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
