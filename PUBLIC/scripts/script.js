fetch("https://blog-crud-xvln.onrender.com/api/blogs/")
  .then((res) => res.json())
  .then((data) => {
    if (data.length > 0) {  

      const rand = Math.floor(Math.random() * data.length);

      const imageUrl = data[rand].image;
      const title = data[rand].title;
      const description = data[rand].description;

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

      document.querySelector("#largearea").appendChild(imageContainer);

      return data;
    }
  })
  .then((data) => {
    console.log(data);

    data.forEach((item) => {
      //flexbox item
      const gridItem = document.createElement("article");
      gridItem.classList.add("grid-item");

      const imgElement = document.createElement("img");
      imgElement.src = item.image;
      imgElement.alt = item.title;

      const titleElement = document.createElement("h3");
      titleElement.textContent = item.title;

      const descriptionElement = document.createElement("p");
      descriptionElement.textContent = item.description;

      gridItem.appendChild(imgElement);
      gridItem.appendChild(titleElement);
      gridItem.appendChild(descriptionElement);

      document.querySelector("#grid-container").appendChild(gridItem);
    });
  })
  .catch((error) => console.log(error));


// Login form script
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
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
          alert('Login successful');
          // window.location.href = '/admin/create-blog';
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