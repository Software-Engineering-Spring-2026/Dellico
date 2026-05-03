import { useState } from "react";

export default function Favorites() {
  const RECOMMENDED = [
    { id: 1, title: "Weather App", course: "CSEN401", type: "Web", tech: "React" },
    { id: 2, title: "Todo List", course: "CSEN702", type: "Web", tech: "React" },
  ];

  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (project) => {
    const already = favorites.find((f) => f.id === project.id);
    if (already) {
      setFavorites(favorites.filter((f) => f.id !== project.id));
    } else {
      setFavorites([...favorites, project]);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>My Favorites</h1>
      {favorites.length === 0 ? (
        <p>You have no favorites yet. Add some below!</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
          {favorites.map((project) => (
            <div key={project.id} style={{ border: "1px solid gold", padding: "1rem", borderRadius: "8px" }}>
              <h3>⭐ {project.title}</h3>
              <p>{project.course} · {project.tech}</p>
              <button onClick={() => toggleFavorite(project)}>Remove</button>
            </div>
          ))}
        </div>
      )}

      <h2>Recommended Projects</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginTop: "1rem" }}>
        {RECOMMENDED.map((project) => (
          <div key={project.id} style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
            <h3>{project.title}</h3>
            <p>{project.course} · {project.tech}</p>
            <button onClick={() => toggleFavorite(project)}>
              {favorites.find((f) => f.id === project.id) ? "❤️ Favorited" : "🤍 Favorite"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}