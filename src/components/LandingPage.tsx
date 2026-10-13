import React from 'react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white overflow-y-auto">
      {/* Hero Section */}
      <div className="relative">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-12">
          {/* Logo & Title */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="text-5xl">🏗️</span>
              <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                ArchiBuilder
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-indigo-200 max-w-2xl mx-auto leading-relaxed">
              Créez, aménagez, planifiez et estimez vos projets architecturaux — <span className="font-semibold text-white">sans aucune compétence requise</span>
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <span className="px-4 py-1.5 bg-white/10 backdrop-blur rounded-full text-sm text-indigo-200 border border-white/10">
                🎯 Simple d'utilisation
              </span>
              <span className="px-4 py-1.5 bg-white/10 backdrop-blur rounded-full text-sm text-indigo-200 border border-white/10">
                📱 Responsive
              </span>
              <span className="px-4 py-1.5 bg-white/10 backdrop-blur rounded-full text-sm text-indigo-200 border border-white/10">
                💰 Estimation automatique
              </span>
              <span className="px-4 py-1.5 bg-white/10 backdrop-blur rounded-full text-sm text-indigo-200 border border-white/10">
                🇫🇷 100% en français
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mb-16">
            <button
              onClick={onStart}
              className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl text-lg font-bold shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center gap-3">
                🚀 Commencer mon projet
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </button>
            <p className="mt-3 text-sm text-indigo-300">Gratuit • Aucune inscription requise</p>
          </div>

          {/* Features Preview */}
          <div className="space-y-20">
            {/* Feature 1: Building Editor */}
            <FeatureSection
              number="01"
              title="Éditeur de bâtiment"
              subtitle="Dessinez vos plans en quelques clics"
              description="Créez le plan de votre bâtiment en dessinant directement les pièces sur un canvas interactif. Ajoutez des murs, portes, fenêtres et toits. Glissez-déposez pour organiser l'espace comme bon vous semble."
              features={[
                'Dessin intuitif par glisser-déposer',
                'Pièces prédéfinies (salon, cuisine, chambre...)',
                'Modification des propriétés en temps réel',
                'Grille magnétique pour un alignement parfait',
              ]}
              image="https://image.qwenlm.ai/generated-images/aaf21f73-a72c-4527-aa22-c84e11cc11b2/_result.png"
              color="from-blue-500/20 to-cyan-500/20"
              borderColor="border-blue-500/30"
              reversed={false}
            />

            {/* Feature 2: Environment */}
            <FeatureSection
              number="02"
              title="Aménagement du terrain"
              subtitle="Intégrez votre bâtiment dans son environnement"
              description="Placez arbres, allées, piscines, jardins et clôtures autour de votre construction. Visualisez l'intégration de votre projet dans son contexte paysager."
              features={[
                '7 types d\'éléments paysagers',
                'Placement libre par glisser-déposer',
                'Visualisation top-down du terrain',
                'Redimensionnement des éléments',
              ]}
              image="https://image.qwenlm.ai/generated-images/6948e6e0-4163-4c98-887e-9df210fd948d/_result.png"
              color="from-green-500/20 to-emerald-500/20"
              borderColor="border-green-500/30"
              reversed={true}
            />

            {/* Feature 3: Work Planner */}
            <FeatureSection
              number="03"
              title="Planificateur de travaux"
              subtitle="Organisez votre chantier de A à Z"
              description="Suivez chaque étape de la construction, du terrassement à la réception des travaux. Planifiez les durées, gérez les dépendances et suivez l'avancement en temps réel."
              features={[
                '12 étapes prédéfinies avec descriptions',
                'Suivi du statut (en attente, en cours, terminé)',
                'Filtrage par catégorie de travaux',
                'Gestion des dépendances entre étapes',
              ]}
              image="https://image.qwenlm.ai/generated-images/b4ab1bbd-e83e-4ac6-b1ba-012034e5fabc/_result.png"
              color="from-orange-500/20 to-amber-500/20"
              borderColor="border-orange-500/30"
              reversed={false}
            />

            {/* Feature 4: Cost Estimator */}
            <FeatureSection
              number="04"
              title="Estimateur de coûts"
              subtitle="Maîtrisez votre budget en détail"
              description="Obtenez une estimation automatique du coût total de votre projet. Détaillez les matériaux, la main d'œuvre et ajustez les paramètres selon votre niveau de finition souhaité."
              features={[
                'Calcul automatique basé sur la surface',
                'Détail de 10+ types de matériaux',
                '3 niveaux de finition (standard, premium, luxe)',
                'Conseils pour optimiser le budget',
              ]}
              image="https://image.qwenlm.ai/generated-images/4c68c91f-fd4e-48f5-b797-5b3b8153fc6f/_result.png"
              color="from-purple-500/20 to-pink-500/20"
              borderColor="border-purple-500/30"
              reversed={true}
            />
          </div>

          {/* How it works */}
          <div className="mt-24 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              Comment ça marche ?
            </h2>
            <p className="text-indigo-200 mb-12 text-lg">4 étapes simples pour concrétiser votre projet</p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: '1', icon: '✏️', title: 'Dessinez', desc: 'Créez le plan de votre bâtiment pièce par pièce' },
                { step: '2', icon: '🌳', title: 'Aménagez', desc: 'Intégrez l\'environnement autour du bâtiment' },
                { step: '3', icon: '📋', title: 'Planifiez', desc: 'Organisez les étapes de construction' },
                { step: '4', icon: '💰', title: 'Estimez', desc: 'Obtenez le coût total de votre projet' },
              ].map((item) => (
                <div key={item.step} className="relative bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                  <span className="text-4xl block mb-3">{item.icon}</span>
                  <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-indigo-200">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-24 text-center pb-12">
            <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur border border-indigo-400/20 rounded-3xl p-10 max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Prêt à construire ?</h2>
              <p className="text-indigo-200 mb-6">Lancez-vous dès maintenant, c'est gratuit et sans inscription.</p>
              <button
                onClick={onStart}
                className="px-8 py-4 bg-white text-indigo-700 rounded-2xl text-lg font-bold hover:bg-indigo-50 hover:scale-105 transition-all duration-300 shadow-xl"
              >
                🏗️ Ouvrir ArchiBuilder
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FeatureSectionProps {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  image: string;
  color: string;
  borderColor: string;
  reversed: boolean;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({
  number, title, subtitle, description, features, image, color, borderColor, reversed
}) => (
  <div className={`flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 items-center`}>
    {/* Text */}
    <div className="flex-1 space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-4xl font-black text-indigo-400/50">{number}</span>
        <div>
          <h3 className="text-2xl md:text-3xl font-bold">{title}</h3>
          <p className="text-indigo-300">{subtitle}</p>
        </div>
      </div>
      <p className="text-indigo-100/80 leading-relaxed">{description}</p>
      <ul className="space-y-2">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-indigo-200">
            <span className="w-5 h-5 bg-indigo-500/30 rounded-full flex items-center justify-center text-xs">✓</span>
            {f}
          </li>
        ))}
      </ul>
    </div>

    {/* Image */}
    <div className="flex-1">
      <div className={`bg-gradient-to-br ${color} border ${borderColor} rounded-2xl p-3 shadow-2xl`}>
        <img
          src={image}
          alt={title}
          className="w-full rounded-xl shadow-lg"
          loading="lazy"
        />
      </div>
    </div>
  </div>
);
