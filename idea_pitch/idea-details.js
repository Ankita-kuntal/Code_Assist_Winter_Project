document.addEventListener("DOMContentLoaded", () => {
  // Get the idea index from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const ideaIndex = urlParams.get("id");

  if (ideaIndex !== null) {
    const ideas = JSON.parse(localStorage.getItem("ideas")) || [];
    const idea = ideas[ideaIndex];

    if (idea) {
      // Populate the idea details
      document.getElementById("idea-title").textContent = idea.title;
      document.getElementById("idea-description").textContent = idea.description;

      // Initialize vote buttons and counts
      const upvoteBtn = document.getElementById("upvote-btn");
      const downvoteBtn = document.getElementById("downvote-btn");

      if (upvoteBtn && downvoteBtn) {
        // Set initial upvote/downvote counts with icons
        upvoteBtn.innerHTML = `<i class="fas fa-thumbs-up"></i> ${idea.upvotes || 0}`;
        downvoteBtn.innerHTML = `<i class="fas fa-thumbs-down"></i> ${idea.downvotes || 0}`;

        const userVotes = JSON.parse(localStorage.getItem("userVotes")) || {};

        if (userVotes[ideaIndex]) {
          upvoteBtn.disabled = true;
          downvoteBtn.disabled = true;
        }

        // Handle upvote functionality
        upvoteBtn.addEventListener("click", () => {
          if (!userVotes[ideaIndex]) {
            idea.upvotes = (idea.upvotes || 0) + 1;
            ideas[ideaIndex] = idea;
            localStorage.setItem("ideas", JSON.stringify(ideas));

            userVotes[ideaIndex] = "upvoted";
            localStorage.setItem("userVotes", JSON.stringify(userVotes));

            upvoteBtn.innerHTML = `<i class="fas fa-thumbs-up"></i> ${idea.upvotes}`;
            upvoteBtn.disabled = true;
            downvoteBtn.disabled = true;
          }
        });

        // Handle downvote functionality
        downvoteBtn.addEventListener("click", () => {
          if (!userVotes[ideaIndex]) {
            idea.downvotes = (idea.downvotes || 0) + 1;
            ideas[ideaIndex] = idea;
            localStorage.setItem("ideas", JSON.stringify(ideas));

            userVotes[ideaIndex] = "downvoted";
            localStorage.setItem("userVotes", JSON.stringify(userVotes));

            downvoteBtn.innerHTML = `<i class="fas fa-thumbs-down"></i> ${idea.downvotes}`;
            upvoteBtn.disabled = true;
            downvoteBtn.disabled = true;
          }
        });
      }

      // Display existing comments
      const commentsList = document.getElementById("comments-list");
      if (idea.comments && Array.isArray(idea.comments)) {
        idea.comments.forEach((comment) => {
          const li = document.createElement("li");
          li.classList.add("list-group-item");
          li.textContent = comment;
          commentsList.appendChild(li);
        });
      }

      // Add a new comment
      document.getElementById("add-comment-btn").addEventListener("click", () => {
        const commentBox = document.getElementById("comment-box");
        const comment = commentBox.value.trim();

        if (comment) {
          if (!idea.comments) {
            idea.comments = []; // Initialize comments array if it doesn't exist
          }
          idea.comments.push(comment);
          ideas[ideaIndex] = idea;
          localStorage.setItem("ideas", JSON.stringify(ideas));

          // Add the comment to the UI
          const li = document.createElement("li");
          li.classList.add("list-group-item");
          li.textContent = comment;
          commentsList.appendChild(li);

          commentBox.value = ""; // Clear the input field
        } else {
          alert("Comment cannot be empty!");
        }
      });
    } else {
      console.error("Idea not found. Invalid idea index.");
    }
  } else {
    console.error("Idea index not provided in the URL.");
  }
});
