document.addEventListener("DOMContentLoaded", async function () {
  // extract id from URL
  const url = window.location.href;
  const blogId = url.split("/blog/")[1];

  // fetch blog data using the blogId
  try {
    const response = await fetch(`http://www.thebitbytebit.tech/api/blogs/${blogId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch blog data");
    }
    const blogData = await response.json();

    // inject header content
    document.getElementById("blog-title").textContent = blogData.title;
    document.getElementById("blog-description").textContent = blogData.description;
    document.getElementById("header-image").src = blogData.headerImage;

    // inject sidebar links
    const sidebarLinks = document.getElementById("sidebar-links");
    blogData.sidebarLinks.forEach((link) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = link.href;
      a.textContent = link.text;

      const icon = document.createElement("img");
      icon.src = "../assets/images/arrow.svg";
      icon.alt = "Icon";
      icon.className = "icon";

      li.appendChild(a);
      li.appendChild(icon);
      sidebarLinks.appendChild(li);
    });

    // inject content
    const contentContainer = document.getElementById("content-container");
    blogData.content.forEach((item) => {
      if (item.type === "heading") {
        const heading = document.createElement(`h${item.level}`);
        heading.textContent = item.text;
        heading.id = item.id; // ID for smooth scrolling
        contentContainer.appendChild(heading);
      } else if (item.type === "text") {
        const p = document.createElement("p");
        p.innerHTML = item.content; // innerHTML to render HTML content
        contentContainer.appendChild(p);
      } else if (item.type === "image") {
        const img = document.createElement("img");
        img.src = item.src;
        img.alt = item.alt;
        contentContainer.appendChild(img);
      } else if (item.type === "quote") {
        const blockquote = document.createElement("blockquote");
        const p = document.createElement("p");
        p.textContent = item.text;
        const span = document.createElement("span");
        span.textContent = `— ${item.author}`;
        p.appendChild(span);
        blockquote.appendChild(p);
        contentContainer.appendChild(blockquote);
      }
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    document.getElementById("content-container").textContent =
      "Error loading blog post...";
  }

  // delete button
  document.getElementById("delete-blog-btn").addEventListener("click", async function () {
    try {
      const response = await fetch(`http://www.thebitbytebit.tech/api/blogs/${blogId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error("Failed to delete blog");
      }
      
      window.location.href = '/';
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  });
});
