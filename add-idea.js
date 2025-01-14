// Reference to the form
const addIdeaForm = document.getElementById("add-idea-form");

// Handle the form submission
// Handle the form submission
addIdeaForm.addEventListener("submit", (e) => {
    e.preventDefault();
  
    // Get input values
    const title = document.getElementById("idea-title").value;
    const description = document.getElementById("idea-description").value;
  
    // Create a new idea object with upvotes and downvotes initialized to 0
    const newIdea = {
      title, 
      description, 
      upvotes: 0, 
      downvotes: 0, 
      comments: []
    };
  
    // Save idea to localStorage
    saveIdeaToStorage(newIdea);
  
    // Redirect to the main page
    window.location.href = "index.html";
  });
  

// Function to save idea to localStorage
function saveIdeaToStorage(idea) {
  const ideas = JSON.parse(localStorage.getItem("ideas")) || [];
  ideas.push(idea);
  localStorage.setItem("ideas", JSON.stringify(ideas));
}
