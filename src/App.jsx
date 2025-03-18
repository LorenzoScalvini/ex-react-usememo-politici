import React, { useState, useEffect, useMemo } from 'react';

const PoliticianCard = React.memo(({ politician }) => {
  console.log(`Rendering card for: ${politician.name}`); // This will now only log when the component actually renders
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

  const filteredPoliticians = useMemo(() => {
    return politicians.filter((politician) => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      return (
        politician.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        politician.biography.toLowerCase().includes(lowerCaseSearchTerm)
      );
    });
  }, [politicians, searchTerm]);

  return (
    <div>
      <h1>Lista dei Politici</h1>
      <input
        type="text"
        placeholder="Cerca per nome o biografia..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div>
        {filteredPoliticians.map((politician) => (
          <PoliticianCard key={politician.id} politician={politician} />
        ))}
      </div>
    </div>
  );
}
