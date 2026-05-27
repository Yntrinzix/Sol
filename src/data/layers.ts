export interface PlanetLayer {
  name: string;
  color: string;
  radiusFraction: number;
  description: string;
}

export const PLANET_LAYERS: Record<string, PlanetLayer[]> = {
  sun: [
    { name: 'Core', color: '#FFFFFF', radiusFraction: 0.25, description: 'Nuclear fusion converts hydrogen to helium at 15 million °C.' },
    { name: 'Radiative Zone', color: '#FFF4C4', radiusFraction: 0.7, description: 'Energy travels outward as photons bouncing between particles for thousands of years.' },
    { name: 'Convective Zone', color: '#FFD966', radiusFraction: 0.95, description: 'Hot plasma rises and cool plasma sinks in giant convection cells.' },
    { name: 'Photosphere', color: '#FDB813', radiusFraction: 1.0, description: 'The visible surface emitting light at approximately 5,500 °C.' },
  ],
  mercury: [
    { name: 'Inner Core', color: '#C0C0C0', radiusFraction: 0.45, description: 'Solid iron core making up a disproportionately large fraction of the planet.' },
    { name: 'Outer Core', color: '#A0A0A0', radiusFraction: 0.65, description: 'Liquid iron-sulfur layer generating a weak magnetic field.' },
    { name: 'Mantle', color: '#8B7355', radiusFraction: 0.95, description: 'Thin silicate mantle only about 600 km thick.' },
    { name: 'Crust', color: '#B5B5B5', radiusFraction: 1.0, description: 'Dark silicate crust heavily cratered from billions of years of impacts.' },
  ],
  venus: [
    { name: 'Core', color: '#D4A574', radiusFraction: 0.5, description: 'Iron-nickel core similar in size to Earth\u2019s but possibly entirely liquid.' },
    { name: 'Mantle', color: '#A0522D', radiusFraction: 0.95, description: 'Rocky silicate mantle driving sporadic volcanic resurfacing events.' },
    { name: 'Crust', color: '#C8A882', radiusFraction: 0.99, description: 'Basaltic crust with no tectonic plates, resurfaced ~500 million years ago.' },
    { name: 'Atmosphere', color: '#E8CDA0', radiusFraction: 1.0, description: 'Dense CO₂ atmosphere with sulfuric acid clouds creating extreme greenhouse heating.' },
  ],
  earth: [
    { name: 'Inner Core', color: '#FFFACD', radiusFraction: 0.19, description: 'Solid iron-nickel sphere at 5,400 °C under immense pressure.' },
    { name: 'Outer Core', color: '#FF8C00', radiusFraction: 0.55, description: 'Liquid iron-nickel generating Earth\u2019s protective magnetic field via dynamo action.' },
    { name: 'Mantle', color: '#CD853F', radiusFraction: 0.99, description: 'Semi-solid silicate rock that flows slowly driving plate tectonics.' },
    { name: 'Crust', color: '#228B22', radiusFraction: 1.0, description: 'Thin rocky shell divided into tectonic plates, 5-70 km thick.' },
  ],
  mars: [
    { name: 'Core', color: '#CD7F32', radiusFraction: 0.5, description: 'Liquid iron-sulfur core approximately 1,800 km in radius.' },
    { name: 'Mantle', color: '#8B4513', radiusFraction: 0.95, description: 'Silicate mantle enriched in iron, now largely geologically dormant.' },
    { name: 'Crust', color: '#E27B58', radiusFraction: 1.0, description: 'Iron oxide-rich basaltic crust giving Mars its distinctive red color.' },
  ],
  jupiter: [
    { name: 'Core', color: '#8B8682', radiusFraction: 0.15, description: 'Dense core of rock, metal, and hydrogen compounds under extreme pressure.' },
    { name: 'Metallic Hydrogen', color: '#A9A9A9', radiusFraction: 0.6, description: 'Hydrogen compressed into a metallic liquid state conducting electricity.' },
    { name: 'Molecular Hydrogen', color: '#D2B48C', radiusFraction: 0.9, description: 'Vast layer of liquid molecular hydrogen transitioning to gas.' },
    { name: 'Cloud Layer', color: '#DEB887', radiusFraction: 0.98, description: 'Ammonia ice, ammonium hydrosulfide, and water clouds in distinct bands.' },
    { name: 'Atmosphere', color: '#C88B3A', radiusFraction: 1.0, description: 'Hydrogen-helium atmosphere with visible storm systems and jet streams.' },
  ],
  saturn: [
    { name: 'Core', color: '#8B7D6B', radiusFraction: 0.2, description: 'Rocky-icy core roughly 10-20 Earth masses surrounded by metallic hydrogen.' },
    { name: 'Metallic Hydrogen', color: '#B8B8B8', radiusFraction: 0.5, description: 'Metallic hydrogen layer generating Saturn\u2019s magnetic field.' },
    { name: 'Molecular Hydrogen', color: '#DAC088', radiusFraction: 0.88, description: 'Deep layer of liquid and gaseous molecular hydrogen.' },
    { name: 'Cloud Layer', color: '#F0E68C', radiusFraction: 0.97, description: 'Ammonia ice clouds forming pale gold bands less distinct than Jupiter\u2019s.' },
    { name: 'Atmosphere', color: '#E8D48B', radiusFraction: 1.0, description: 'Hydrogen-helium upper atmosphere with periodic giant storm eruptions.' },
  ],
  uranus: [
    { name: 'Core', color: '#696969', radiusFraction: 0.2, description: 'Small rocky-iron core about 0.5 Earth masses.' },
    { name: 'Ice Mantle', color: '#48D1CC', radiusFraction: 0.7, description: 'Hot dense fluid of water, methane, and ammonia ices under high pressure.' },
    { name: 'Molecular Hydrogen', color: '#87CEEB', radiusFraction: 0.9, description: 'Hydrogen-helium envelope transitioning from liquid to gas.' },
    { name: 'Cloud Layer', color: '#AFEEEE', radiusFraction: 0.97, description: 'Methane ice clouds absorbing red light giving the blue-green appearance.' },
    { name: 'Atmosphere', color: '#7DE8E8', radiusFraction: 1.0, description: 'Hydrogen-helium-methane atmosphere with extreme seasonal variations.' },
  ],
  neptune: [
    { name: 'Core', color: '#4A4A4A', radiusFraction: 0.2, description: 'Rocky-iron core roughly 1.2 Earth masses at extreme temperature.' },
    { name: 'Ice Mantle', color: '#1E90FF', radiusFraction: 0.7, description: 'Superheated water-ammonia-methane fluid possibly containing diamond rain.' },
    { name: 'Molecular Hydrogen', color: '#4169E1', radiusFraction: 0.9, description: 'Hydrogen-helium gas layer with increasing density toward the interior.' },
    { name: 'Cloud Layer', color: '#5B7FE8', radiusFraction: 0.97, description: 'Methane and hydrogen sulfide clouds with visible dark storm spots.' },
    { name: 'Atmosphere', color: '#3E54E8', radiusFraction: 1.0, description: 'Dynamic hydrogen-helium-methane atmosphere with the fastest winds in the solar system.' },
  ],
};
