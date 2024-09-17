fetch("https://www.thebitbytebit.tech/api/blogs")
  .then((res) => res.json())
  .then((data) => {
    if (data.length > 0) {
      // sort blogs by modifed date to stay recent
      data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      // recent blogs in the grid
      data.forEach((item) => {
        const link = document.createElement("a");
        link.href = `/blog/${item._id}`;

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
    }
  })
  .catch((error) => console.log(error));
