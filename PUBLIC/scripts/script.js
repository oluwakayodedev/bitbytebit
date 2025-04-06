fetch("/api/blogs")
  .then((res) => {
    if (!res.ok) {
      throw new Error("Network response not ok");
    }
    return res.json();
  })
  .then((data) => {
    if (data.length > 0) {
      // sort blogs by modifed date to stay recent
      data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      const recentBlogs = data.slice(0, 9);

      // random blog in the large area
      const rand = Math.floor(Math.random() * recentBlogs.length);
      const randomBlog = recentBlogs[rand];

      // create featured blog section
      renderFeaturedBlog(randomBlog);

      // create grid items with a small delay to prioritize above-the-fold content
      setTimeout(() => {
        renderGridItems(recentBlogs);
      }, 100);
    }
  })
  .catch((error) => console.error("Failed to fetch blogs:", error));

  function renderFeaturedBlog(blog) {
    const largeArea = document.querySelector("#largearea");
    
    largeArea.innerHTML = `
      <a href="/blog/${blog._id}">
        <div class="image-container">
          <img src="${blog.headerImage}" alt="${blog.title}" loading="eager" />
          <div class="overlay">
            <div class="overlay-text">
              <p>Featured</p>
              <h2>${blog.title}</h2>
              <p>${blog.description}</p>
            </div>
          </div>
        </div>
      </a>
    `;
  }
  
  function renderGridItems(blogs) {
    const gridContainer = document.querySelector("#grid-container");
    let gridHTML = '';
    
    blogs.forEach((blog) => {
      gridHTML += `
        <a href="/blog/${blog._id}">
          <article class="grid-item">
            <img src="${blog.headerImage}" alt="${blog.title}" loading="lazy" />
            <h3>${blog.title}</h3>
            <p>${blog.description}</p>
          </article>
        </a>
      `;
    });
    
    gridContainer.innerHTML = gridHTML;
  }