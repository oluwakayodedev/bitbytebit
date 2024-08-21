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
