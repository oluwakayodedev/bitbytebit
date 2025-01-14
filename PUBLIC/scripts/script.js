fetch("https://www.thebitbytebit.tech/api/blogs", {
  method: 'GET',
  headers: {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
  },
})
  .then((res) => res.json())
  .then((data) => {
    if (data.length > 0) {
      // sort blogs by modifed date to stay recent
      data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      const recentBlogs = data.slice(0, 9);

      // random blog in the large area
      const rand = Math.floor(Math.random() * recentBlogs.length);
      const randomBlog = recentBlogs[rand];

      const link = document.createElement("a");
      link.href = `/blog/${randomBlog._id}`;

      const imageContainer = document.createElement("div");
      imageContainer.classList.add("image-container");

      const imgElement = document.createElement("img");
      imgElement.src = randomBlog.headerImage;
      imgElement.alt = "Blog Image";
      imgElement.loading = "lazy";

      const overlay = document.createElement("div");
      overlay.classList.add("overlay");

      const overlayText = document.createElement("div");
      overlayText.classList.add("overlay-text");
      overlayText.innerHTML = `
        <p>Featured</p>
        <h2>${randomBlog.title}</h2>
        <p>${randomBlog.description}</p>
      `;

      overlay.appendChild(overlayText);
      imageContainer.appendChild(imgElement);
      imageContainer.appendChild(overlay);

      link.appendChild(imageContainer);
      document.querySelector("#largearea").appendChild(link);

      // Display recent blogs in the grid
      recentBlogs.forEach((blog) => {
        const link = document.createElement("a");
        link.href = `/blog/${blog._id}`;

        const gridItem = document.createElement("article");
        gridItem.classList.add("grid-item");

        const imgElement = document.createElement("img");
        imgElement.src = blog.headerImage;
        imgElement.alt = blog.title;
        imgElement.loading = "lazy";

        const titleElement = document.createElement("h3");
        titleElement.textContent = blog.title;

        const descriptionElement = document.createElement("p");
        descriptionElement.textContent = blog.description;

        gridItem.appendChild(imgElement);
        gridItem.appendChild(titleElement);
        gridItem.appendChild(descriptionElement);
        link.appendChild(gridItem);

        document.querySelector("#grid-container").appendChild(link);
      });
    }
  })
  .catch((error) => console.log(error));