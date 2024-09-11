fetch("http://localhost:3000/api/blogs/")
  .then((res) => res.json())
  .then((data) => {
    if (data.length > 0) {  

      const rand = Math.floor(Math.random() * data.length);

      const imageUrl = data[rand].headerImage;
      const title = data[rand].title;
      const description = data[rand].description;
      const blogId = data[rand]._id;

      const link = document.createElement("a");
      link.href = `/blog/${blogId}`;

      const imageContainer = document.createElement("div");
      imageContainer.classList.add("image-container");

      const imgElement = document.createElement("img");
      imgElement.src = imageUrl;
      imgElement.alt = "Blog Image";

      const overlay = document.createElement("div");
      overlay.classList.add("overlay");

      const overlayText = document.createElement("div");
      overlayText.classList.add("overlay-text");
      overlayText.innerHTML = `
              <p>Featured</p>
              <h2>${title}</h2>
              <p>${description}</p>
            `;

      overlay.appendChild(overlayText);
      imageContainer.appendChild(imgElement);
      imageContainer.appendChild(overlay);

      link.appendChild(imageContainer);

      document.querySelector("#largearea").appendChild(link);

      return data;
    }
  })
  .then((data) => {
    console.log(data);

    data.forEach((item) => {
      // 
      const link = document.createElement("a");
      link.href = `/blog/${item._id}`;
      
      //flexbox item
      const gridItem = document.createElement("article");
      gridItem.classList.add("grid-item");

      const imgElement = document.createElement("img");
      imgElement.src = item.headerImage;
      imgElement.alt = item.title;

      const titleElement = document.createElement("h3");
      titleElement.textContent = item.title;

      const descriptionElement = document.createElement("p");
      descriptionElement.textContent = item.description;

      gridItem.appendChild(imgElement);
      gridItem.appendChild(titleElement);
      gridItem.appendChild(descriptionElement);

      link.appendChild(gridItem);

      document.querySelector("#grid-container").appendChild(link);
    });
  })
  .catch((error) => console.log(error));


// Login form script
document.addEventListener('DOMContentLoaded', async () => {
  const loginForm = document.getElementById('loginForm');
  const contentArea = document.querySelector('main, footer, .fixed-buttons');

  // check auth and hide login
  if (contentArea) {
    contentArea.style.display = 'none';
  }

  const token = localStorage.getItem('authToken');
  if (token) {
    // user verified?, redirect /publishBlog
    window.location.href = '/publishBlog';
    return;
  }

  // user not authenticated, login!
  if (contentArea) {
    contentArea.style.display = 'block';
  }

  // login form submission
  if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const errorMessage = document.getElementById('error-message');

      try {
        const response = await fetch('/api/auth/admin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
          // store token in localStorage
          localStorage.setItem('authToken', data.token);
          console.log("You're loggedIn...");
          window.location.href = '/publishBlog';
        } else {
          errorMessage.textContent = data.msg || 'Login failed. Please try again.';
        }
      } catch (error) {
        console.error('Error:', error);
        errorMessage.textContent = 'An error occurred. Please try again later.';
      }
    });
  }
});
