const API_URL = "https://www.thebitbytebit.tech";

document.addEventListener("DOMContentLoaded", async function () {
  // extract id from URL
  const url = window.location.href;
  const blogId = url.split("/blog/")[1];
  const contentContainer = document.getElementById("content-container");
  const sidebarLinks = document.getElementById("sidebar-links");
  const editButton = document.getElementById("edit-blog-btn");
  const deleteButton = document.getElementById("delete-blog-btn");

  // running both functions in parallel to improve performance
  const perfStart = performance.now();
  try {
    const contentFragment = document.createDocumentFragment();
    const sidebarFragment = document.createDocumentFragment();
    
    // fetch blog data and token validation in parallel
    const [blogData, isAdmin] = await Promise.all([
      fetchBlogData(blogId),
      validateAdminAccess()
    ]);
    
    updatePageMetadata(blogData);
    
    renderSidebar(blogData.sidebarLinks, sidebarFragment);
    renderContent(blogData.content, contentFragment);
    
    sidebarLinks.appendChild(sidebarFragment);
    contentContainer.appendChild(contentFragment);
    
    // config edit/delete buttons based on auth
    setupAdminButtons(isAdmin, blogId, editButton, deleteButton);
    
    // performance metrics
    console.log(`Blog loaded in ${(performance.now() - perfStart).toFixed(2)}ms`);
    
  } catch (error) {
    console.error("Error loading blog:", error);
    contentContainer.textContent = "Error loading blog post...";
    editButton.style.display = "none";
    deleteButton.style.display = "none";
  }
});

async function fetchBlogData(blogId) {
  const response = await fetch(
    `${API_URL}/api/blogs/${blogId}`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch blog data: ${response.status}`);
  }
  
  return response.json();
}

function updatePageMetadata(blogData) {
  document.getElementById("blog-title").textContent = blogData.title;
  document.getElementById("blog-description").textContent = blogData.description;
  
  const headerImage = document.getElementById("header-image");
  const img = new Image();
  img.onload = function() {
    // set AR based on actual image dimensions
    headerImage.style.aspectRatio = `${this.width}/${this.height}`;
    headerImage.src = blogData.headerImage;
  };
  img.src = blogData.headerImage;
  
  // update page title dynamically
  document.title = `${blogData.title} — bitbytebit.hub`;
}

function renderSidebar(links, fragment) {
  if (!links || !links.length) return;
  
  links.forEach((link) => {
    const li = document.createElement("li");
  
    li.innerHTML = `
      <a href="${link.href}">${link.text}</a>
      <img src="../assets/images/arrow.svg" alt="Icon" class="icon">
    `;
    
    fragment.appendChild(li);
  });
}

function renderContent(content, fragment) {
  if (!content || !content.length) return;
  
  // create content elements in one batch
  content.forEach((item) => {
    let element;
    
    switch (item.type) {
      case "heading":
        element = document.createElement(`h${item.level}`);
        element.textContent = item.text;
        element.id = item.id;
        element.classList.add("section-heading");
        break;
        
      case "text":
        element = document.createElement("p");
        element.innerHTML = item.content;
        break;
        
      case "image":
        element = document.createElement("img");
        element.src = item.src;
        element.alt = item.alt || "blog image";
        element.loading = "lazy"; // defer loading of content images
        element.decoding = "async";
        break;
        
      case "quote":
        element = document.createElement("blockquote");
        const p = document.createElement("p");
        p.textContent = item.text;
        
        const span = document.createElement("span");
        span.textContent = `— ${item.author}`;
        p.appendChild(span);
        element.appendChild(p);
        break;
    }
    
    if (element) {
      fragment.appendChild(element);
    }
  });
}

async function validateAdminAccess() {
  try {
    const token = localStorage.getItem("authToken");
    
    // verify token with timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const validateToken = await fetch("/api/auth/verifyToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!validateToken.ok){
      localStorage.removeItem("authToken");
      return false;
    } 
    
    return true;
  } catch (error) {
    console.warn("Admin validation failed:", error.message);
    return false;
  }
}

function setupAdminButtons(isAdmin, blogId, editButton, deleteButton) {
  if (!isAdmin) {
    editButton.style.display = "none";
    deleteButton.style.display = "none";
    return;
  }
  
  editButton.style.display = "block";
  deleteButton.style.display = "block";
  
  editButton.onclick = () => window.location.href = `/editBlog/${blogId}`;
  
  deleteButton.onclick = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No auth token found");
      
      const response = await fetch(
        `${API_URL}/api/blogs/${blogId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (!response.ok) throw new Error(`Delete failed: ${response.status}`);
      window.location.href = "/";
      
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog. Please try again.");
    }
  };
}