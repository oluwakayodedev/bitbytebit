document.addEventListener("DOMContentLoaded", async function () {
    // extract id from URL
    const url = window.location.href;
    const blogId = url.split("/editBlog/")[1];
  
    // tetch blog data using the blogId
    try {
      const response = await fetch(
        `https://www.thebitbytebit.tech/api/blogs/${blogId}`
      );
      if (!response.ok) {
        throw new Error("failed to fetch blog data");
      }
      const blogData = await response.json();
  
      console.log(blogData);
  
      document.getElementById("title").value = blogData.title;
      document.getElementById("description").value = blogData.description;
  
      const sectionsContainer = document.querySelector(".sections");
      sectionsContainer.innerHTML = "";
  
      // add both heading and content into a section
      const sections = [];
      let currentSection = { heading: "Untitled Section", content: "" };
  
      blogData.content.forEach((item) => {
        if (item.type === "heading") {
          if (currentSection.heading !== "Untitled Section" || currentSection.content !== "") {
            sections.push(currentSection);
          }
          currentSection = { heading: item.text, content: "" };
        } else if (item.type === "text") {
          currentSection.content = item.content;
        }
      });
  
      // redundant empty section check
      if (currentSection.heading !== "Untitled Section" || currentSection.content !== "") {
        sections.push(currentSection);
      }
  
      // render sections
      sections.forEach((section, index) => {
        const sectionElement = document.createElement("div");
        sectionElement.classList.add("section");
        sectionElement.innerHTML = `
                  <details ${index === 0 ? "open" : ""}>
                      <summary>Section ${index + 1}:</summary>
                      <label for="sectionTitle${index + 1}">Section Title:</label>
                      <input type="text" id="sectionTitle${index + 1}" name="sectionTitle[]" value="${section.heading}">
                      
                      <div class="editor-toolbar">
                          <button type="button" class="boldBtn"><img src="./assets/images/bold.svg" alt="Bold"></button>
                          <button type="button" class="italicBtn"><img src="./assets/images/italic.svg" alt="Italic" class="italic"></button>
                          <button type="button" class="quoteBtn"><img src="./assets/images/quote.svg" alt="Quote"></button>
                          <button type="button" class="imageBtn"><img src="./assets/images/image.svg" alt="Add Image" class="pic"></button>
                          <input type="file" class="imageUpload" accept="image/*" style="display: none;">
                      </div>
                      
                      <div class="sectionContent" contenteditable="true" placeholder="Write your content here...">${section.content}</div>
                  </details>
              `;
        sectionsContainer.appendChild(sectionElement);
      });
    } catch (error) {
      console.error(error);
    }
  });
  