import { useState, useEffect } from "react";

function RecommendedProjects() {
  const [recommendedProjects, setRecommendedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allProjects, setAllProjects] = useState([]);
  const currentUser = localStorage.getItem("currentUserEmail");
  const role = localStorage.getItem("role");

  useEffect(() => {
    loadProjects();
  }, []);

  function loadProjects() {
    setLoading(true);
    
    // Get all projects
    const projects = JSON.parse(localStorage.getItem("allProjects")) || [];
    setAllProjects(projects);
    
    // Get public projects (not the user's own)
    const publicProjects = projects.filter(p => 
      p.visibility === "Public" && p.studentEmail !== currentUser
    );
    
    // Get user's favorite projects
    const favorites = JSON.parse(localStorage.getItem("favoriteProjects")) || [];
    const userFavorites = favorites.filter(f => f.userEmail === currentUser);
    
    // If user has favorites, recommend similar projects
    if (userFavorites.length > 0) {
      // Get the courses from favorites
      const favoriteCourses = new Set();
      const favoriteSkills = new Set();
      
      userFavorites.forEach(fav => {
        const project = projects.find(p => p.id === fav.projectId);
        if (project) {
          favoriteCourses.add(project.course);
          if (project.programmingLanguages) {
            project.programmingLanguages.split(",").forEach(skill => 
              favoriteSkills.add(skill.trim().toLowerCase())
            );
          }
        }
      });
      
      // Score projects
      const scoredProjects = publicProjects.map(project => {
        let score = 0;
        
        // Match by course (highest weight)
        if (favoriteCourses.has(project.course)) score += 10;
        
        // Match by skills
        if (project.programmingLanguages) {
          const projectSkills = project.programmingLanguages.toLowerCase().split(",");
          projectSkills.forEach(skill => {
            if (favoriteSkills.has(skill.trim())) score += 5;
          });
        }
        
        // Higher rating = higher score
        const rating = project.rating || 0;
        score += rating;
        
        return { ...project, score };
      });
      
      const recommendations = scoredProjects
        .filter(p => p.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      
      setRecommendedProjects(recommendations);
    } else {
      // If no favorites, show most popular projects (highest rated or most recent)
      const popularProjects = publicProjects
        .map(project => ({
          ...project,
          score: (project.rating || 0) + (Math.random() * 5)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);
      
      setRecommendedProjects(popularProjects);
    }
    
    setLoading(false);
  }

  function getRating(project) {
    const feedbacks = JSON.parse(localStorage.getItem("instructorFeedback")) || [];
    const projectFeedback = feedbacks.find(f => f.projectName === project.title);
    return projectFeedback?.rating || "Not rated";
  }

  function addToFavorites(project) {
    const favorites = JSON.parse(localStorage.getItem("favoriteProjects")) || [];
    const alreadyExists = favorites.some(f => f.projectId === project.id && f.userEmail === currentUser);
    
    if (alreadyExists) {
      alert("Project already in favorites");
      return;
    }
    
    favorites.push({
      id: Date.now(),
      projectId: project.id,
      projectTitle: project.title,
      userEmail: currentUser,
      addedAt: new Date().toISOString()
    });
    
    localStorage.setItem("favoriteProjects", JSON.stringify(favorites));
    alert("Added to favorites!");
    loadProjects(); // Refresh recommendations
  }

  if (loading) {
    return (
      <div className="recommended-container">
        <h1>Recommended for You</h1>
        <div className="loading-state">Loading recommendations...</div>
      </div>
    );
  }

  if (allProjects.length === 0) {
    return (
      <div className="recommended-container">
        <h1>Recommended for You</h1>
        <div className="empty-state">
          <p>📭 No projects available yet.</p>
          <p>Check back later when students have created projects!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recommended-container">
      <h1>💡 Recommended for You</h1>
      <p>Personalized project recommendations based on your interests</p>

      {recommendedProjects.length === 0 ? (
        <div className="empty-state">
          <p>⭐ No recommendations yet.</p>
          <p>Start favoriting projects to get personalized recommendations!</p>
          <button 
            className="primary" 
            onClick={() => window.location.href = "/browse-projects"}
          >
            Browse Projects
          </button>
        </div>
      ) : (
        <>
          <div className="recommended-grid">
            {recommendedProjects.map(project => (
              <div key={project.id} className="recommended-card">
                <h3>{project.title}</h3>
                <p className="project-course">{project.course}</p>
                <p className="project-student">👨‍🎓 {project.studentEmail}</p>
                <p className="project-languages">💻 {project.programmingLanguages || "No languages specified"}</p>
                <div className="rating">⭐ {getRating(project)}</div>
                <div className="recommended-actions">
                  <button 
                    className="primary" 
                    onClick={() => {
                      localStorage.setItem("selectedProject", JSON.stringify(project));
                      window.location.href = "/project-details";
                    }}
                  >
                    View Project
                  </button>
                  <button 
                    className="secondary-btn" 
                    onClick={() => addToFavorites(project)}
                  >
                    ★ Favorite
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="recommendation-note">
            <p>💡 Like a project? Click "Favorite" to get better recommendations!</p>
          </div>
        </>
      )}
    </div>
  );
}

export default RecommendedProjects;