import React, { useState, useEffect, useMemo } from 'react';

const PoliticianCard = React.memo(({ politician }) => {
  console.log(`Rendering card for: ${politician.name}`);
  return (
    <div>
      <img src={politician.image} alt={politician.name} />
      <h2>{politician.name}</h2>
      <p>
        <strong>Posizione:</strong> {politician.position}
      </p>
      <p>
        <strong>Biografia:</strong> {politician.biography}
      </p>
    </div>
  );
});

export default function App() {
  const [politicians, setPoliticians] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');

  useEffect(() => {
    const fetchPoliticians = async () => {
      try {
        const response = await fetch(
          'https://boolean-spec-frontend.vercel.app/freetestapi/politicians'
        );
        if (!response.ok) {
          throw new Error('Errore nella richiesta API');
        }
        const data = await response.json();
        setPoliticians(data);
      } catch (error) {
        console.error('Errore durante il fetch dei politici:', error);
      }
    };
    fetchPoliticians();
  }, []);

  const uniquePositions = useMemo(() => {
    const positions = politicians.map((politician) => politician.position);
    return ['', ...new Set(positions)];
  }, [politicians]);

  const filteredPoliticians = useMemo(() => {
    return politicians.filter((politician) => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const matchesSearchTerm =
        politician.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        politician.biography.toLowerCase().includes(lowerCaseSearchTerm);

      const matchesPosition =
        selectedPosition === '' || politician.position === selectedPosition;

      return matchesSearchTerm && matchesPosition;
    });
  }, [politicians, searchTerm, selectedPosition]);

  return (
    <div>
      <h1>Lista dei Politici</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Cerca per nome o biografia..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: '10px' }}
        />

        <select
          value={selectedPosition}
          onChange={(e) => setSelectedPosition(e.target.value)}
        >
          <option value="">Tutte le posizioni</option>
          {uniquePositions.slice(1).map((position) => (
            <option key={position} value={position}>
              {position}
            </option>
          ))}
        </select>
      </div>

      <div>
        {filteredPoliticians.map((politician) => (
          <PoliticianCard key={politician.id} politician={politician} />
        ))}
      </div>
    </div>
  );
}
