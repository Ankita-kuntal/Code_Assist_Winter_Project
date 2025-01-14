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

      // Show vote counts
      const upvoteBtn = document.getElementById("upvote-btn");
      const downvoteBtn = document.getElementById("downvote-btn");

      upvoteBtn.textContent = `Upvote (${idea.upvotes || 0})`;
      downvoteBtn.textContent = `Downvote (${idea.downvotes || 0})`;

      // Disable the buttons if the user has already voted
      const userVotes = JSON.parse(localStorage.getItem("userVotes")) || {};
      if (userVotes[ideaIndex]) {
        upvoteBtn.disabled = true;
        downvoteBtn.disabled = true;
      }

      // Set upvote and downvote buttons functionality
      upvoteBtn.addEventListener("click", () => {
        if (!userVotes[ideaIndex]) {
          idea.upvotes = (idea.upvotes || 0) + 1;
          ideas[ideaIndex] = idea;
          localStorage.setItem("ideas", JSON.stringify(ideas));

          // Save user's vote to prevent multiple voting
          userVotes[ideaIndex] = 'upvoted';
          localStorage.setItem("userVotes", JSON.stringify(userVotes));

          // Update button text and disable buttons
          upvoteBtn.textContent = `Upvote (${idea.upvotes})`;
          downvoteBtn.disabled = true; // Disable downvote once upvoted
          upvoteBtn.disabled = true;
        }
      });

      downvoteBtn.addEventListener("click", () => {
        if (!userVotes[ideaIndex]) {
          idea.downvotes = (idea.downvotes || 0) + 1;
          ideas[ideaIndex] = idea;
          localStorage.setItem("ideas", JSON.stringify(ideas));

          // Save user's vote to prevent multiple voting
          userVotes[ideaIndex] = 'downvoted';
          localStorage.setItem("userVotes", JSON.stringify(userVotes));

          // Update button text and disable buttons
          downvoteBtn.textContent = `Downvote (${idea.downvotes})`;
          upvoteBtn.disabled = true; // Disable upvote once downvoted
          downvoteBtn.disabled = true;
        }
      });

      // Add a new comment
      document.getElementById("add-comment-btn").addEventListener("click", () => {
        const commentBox = document.getElementById("comment-box");
        const comment = commentBox.value.trim();

        if (comment) {
          idea.comments = idea.comments || [];
          idea.comments.push(comment);
          ideas[ideaIndex] = idea;
          localStorage.setItem("ideas", JSON.stringify(ideas));

          // Add the comment to the UI
          const li = document.createElement("li");
          li.classList.add("list-group-item");
          li.textContent = comment;
          document.getElementById("comments-list").appendChild(li);

          commentBox.value = "";
        }
      });
    }
  }
});
