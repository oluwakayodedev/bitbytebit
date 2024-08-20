fetch("https://blog-crud-xvln.onrender.com/api/blogs/")
  .then((res) => res.json())
  .then((data) => {
    console.log(data)
    if (data.length > 0) {  

      const rand = Math.floor(Math.random() * 6);

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
    }
  })
  .then((data) => {
    console.log(data)
    if (data.length > 0) {
      const imgUrl = data[0].image;

      const imageContainer = document.createElement("div");
      imageContainer.classList.add("flexbox-item-1");

      const imgElement = document.createElement("img");
      imgElement.src = imgUrl;
      imgElement.alt = "flexbox1";

      imageContainer.appendChild(imgElement);

      document.querySelector("#flexbox-container").appendChild(imageContainer)
    }
  })
  .catch((error) => console.log(error));
