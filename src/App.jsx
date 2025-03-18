import React, { useState } from 'react';

export default function App() {
  const [politicians, setPoliticians] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  React.useEffect(() => {
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

  const filteredPoliticians = politicians.filter((politician) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      politician.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      politician.biography.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

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
          <div key={politician.id}>
            <img src={politician.image} alt={politician.name} />
            <h2>{politician.name}</h2>
            <p>
              <strong>Posizione:</strong> {politician.position}
            </p>
            <p>
              <strong>Biografia:</strong> {politician.biography}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
