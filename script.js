// Reference to the form and idea container
const addIdeaForm = document.getElementById("add-idea-form");
const ideaCardsContainer = document.getElementById("idea-cards");

// Load ideas from localStorage on page load
document.addEventListener("DOMContentLoaded", loadIdeasFromStorage);

if (addIdeaForm) {
  addIdeaForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get input values
    const title = document.getElementById("idea-title").value;
    const description = document.getElementById("idea-description").value;
    const imageFile = document.getElementById("idea-image").files[0]; // Get the uploaded image file

    // Convert image to base64 if it exists
    let imageURL = '';
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = function () {
        imageURL = reader.result; // Get base64 encoded image data
        // Create a new idea object with the image
        const newIdea = { 
          title, 
          description, 
          upvotes: 0, 
          downvotes: 0, 
          userVote: null, 
          comments: [], 
          image: imageURL // Save image URL in the idea object
        };

        // Save idea to localStorage
        saveIdeaToStorage(newIdea);

        // Reset form
        addIdeaForm.reset();

        // Redirect back to the main page
        window.location.href = "index.html";
      };
      reader.readAsDataURL(imageFile); // Convert to base64
    } else {
      // If no image is uploaded, create the idea without the image
      const newIdea = { 
        title, 
        description, 
        upvotes: 0, 
        downvotes: 0, 
        userVote: null, 
        comments: [], 
        image: '' // No image if user doesn't upload one
      };

      // Save idea to localStorage
      saveIdeaToStorage(newIdea);

      // Reset form
      addIdeaForm.reset();

      // Redirect back to the main page
      window.location.href = "index.html";
    }
  });
}

// Function to save idea to localStorage
function saveIdeaToStorage(idea) {
  const ideas = JSON.parse(localStorage.getItem("ideas")) || [];
  ideas.push(idea);
  localStorage.setItem("ideas", JSON.stringify(ideas));
}

// Function to load ideas from localStorage
function loadIdeasFromStorage() {
  const ideas = JSON.parse(localStorage.getItem("ideas")) || [];
  ideaCardsContainer.innerHTML = ""; // Clear existing content
  ideas.forEach((idea, index) => addIdeaToPage(idea, index));
}

// Function to add idea to the page
function addIdeaToPage(idea, index) {
  const userVote = idea.userVote || null;
  const ideaCard = `
    <div class="col-12 col-md-6 col-lg-4 d-flex align-items-stretch">
      <div class="card shadow-sm w-100" style="border: none; border-radius: 8px; background-color: #ffffff; position: relative;">
        <img src="/IDEA (1).png " height="300px">
        <div class="card-body" style="padding: 20px;">
          <h5 class="card-title" style="font-size: 1.5rem; font-weight: 600; color: #ffffff;">${idea.title}</h5>
          <p class="card-text text-truncate" style="color: #ffffff; font-size: 1rem;">${idea.description}</p>
          <div class="d-flex justify-content-between align-items-center">
            <div class="btn-group">
              <button class="btn btn-sm view-details-btn" data-index="${index}" style="padding: 5px 15px; background: none; border: none; color: #007bff;">
                <a href="idea-details.html?id=${index}" class="text-decoration-none">View</a>
              </button>
              <button class="btn btn-sm delete-btn" data-index="${index}" style="padding: 5px 15px; background: none; border: none; color: #dc3545;">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Upvote/Downvote buttons at the bottom-right corner -->
        <div style="position: absolute; bottom: 10px; right: 10px; display: flex; flex-direction: column; gap: 5px;">
          <button class="btn btn-sm upvote-btn" data-index="${index}" style="background: none; border: none; color: #28a745; ${userVote === 'upvoted' ? 'opacity: 0.5;' : ''}">
            <i class="fas fa-thumbs-up"></i> ${idea.upvotes || 0}
          </button>
          <button class="btn btn-sm downvote-btn" data-index="${index}" style="background: none; border: none; color: #dc3545; ${userVote === 'downvoted' ? 'opacity: 0.5;' : ''}">
            <i class="fas fa-thumbs-down"></i> ${idea.downvotes || 0}
          </button>
        </div>
      </div>
    </div>
  `;
  ideaCardsContainer.innerHTML += ideaCard;
}

// Handle interactions using event delegation
document.addEventListener("click", (e) => {
  const ideas = JSON.parse(localStorage.getItem("ideas")) || [];

  // Handle delete
  if (e.target.closest(".delete-btn")) {
    const index = e.target.closest(".delete-btn").getAttribute("data-index");
    ideas.splice(index, 1);
    localStorage.setItem("ideas", JSON.stringify(ideas));
    loadIdeasFromStorage(); // Reload UI
  }

  // Handle upvote
  if (e.target.closest(".upvote-btn")) {
    const index = e.target.closest(".upvote-btn").getAttribute("data-index");
    const idea = ideas[index];

    if (idea.userVote === "upvoted") {
      idea.upvotes--;
      idea.userVote = null;
    } else {
      idea.upvotes++;
      if (idea.userVote === "downvoted") idea.downvotes--;
      idea.userVote = "upvoted";
    }

    ideas[index] = idea;
    localStorage.setItem("ideas", JSON.stringify(ideas));
    loadIdeasFromStorage();
  }

  // Handle downvote
  if (e.target.closest(".downvote-btn")) {
    const index = e.target.closest(".downvote-btn").getAttribute("data-index");
    const idea = ideas[index];

    if (idea.userVote === "downvoted") {
      idea.downvotes--;
      idea.userVote = null;
    } else {
      idea.downvotes++;
      if (idea.userVote === "upvoted") idea.upvotes--;
      idea.userVote = "downvoted";
    }

    ideas[index] = idea;
    localStorage.setItem("ideas", JSON.stringify(ideas));
    loadIdeasFromStorage();
  }
});
