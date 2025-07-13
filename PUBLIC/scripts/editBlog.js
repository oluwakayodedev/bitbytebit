document.addEventListener("DOMContentLoaded", async function () {
  const numberWords = [
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
  ];

  // extract id from URL
  const url = window.location.href;
  const blogId = url.split("/editBlog/")[1];

  // fetch blog data using the blogId
  try {
    const response = await fetch(
      `/api/blogs/${blogId}`
    );
    if (!response.ok) {
      throw new Error("failed to fetch blog data");
    }
    const blogData = await response.json();

    console.log(blogData);

    document.getElementById("title").value = blogData.title;
    document.getElementById("description").value = blogData.description;

    const blogTitle = blogData.title;
    const siteName = "bitbytebit.hub";
    document.title = `Editing: ${blogTitle} | ${siteName}`;

    // set current header image
    const headerImagePreview = document.getElementById("headerImagePreview");
    headerImagePreview.src = blogData.headerImage;
    // handle image upload
    const headerImageInput = document.getElementById("headerImage");
    headerImageInput.addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "myuploadpreset");

        try {
          const uploadResponse = await fetch(
            "https://api.cloudinary.com/v1_1/dxjeykfd8/image/upload",
            {
              method: "POST",
              body: formData,
            }
          );

          if (!uploadResponse.ok) throw new Error("failed to upload image");

          const uploadResult = await uploadResponse.json();
          const newImageUrl = uploadResult.secure_url;

          headerImagePreview.src = newImageUrl;
          blogData.headerImage = newImageUrl; // Update blogData for submission
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
        }
      }
    });

    const sectionsContainer = document.querySelector(".sections");
    sectionsContainer.innerHTML = ""; // Clear existing sections before rendering

    const sections = [];
    let currentSection = { heading: "Untitled Section", content: "" };

    blogData.content.forEach((item) => {
      if (item.type === "heading") {
        if (
          currentSection.heading !== "Untitled Section" ||
          currentSection.content !== ""
        ) {
          sections.push(currentSection);
        }
        currentSection = { heading: item.text, content: "" };
      } else if (item.type === "text") {
        currentSection.content = item.content;
      }
    });

    if (
      currentSection.heading !== "Untitled Section" ||
      currentSection.content !== ""
    ) {
      sections.push(currentSection);
    }

    sections.forEach((section, index) => {
      const sectionElement = document.createElement("div");
      sectionElement.classList.add("section");
      // Use index + 1 for section numbering and IDs to match original logic
      const sectionDisplayIndex = index + 1; 
      sectionElement.innerHTML = `
          <details ${index === 0 ? "open" : ""}>
              <summary>Section ${sectionDisplayIndex}:</summary>
              <label for="sectionTitle${sectionDisplayIndex}">Section Title:</label>
              <input type="text" id="sectionTitle${sectionDisplayIndex}" name="sectionTitle[]" value="${section.heading}">
              
              <div class="editor-toolbar">
                  <button type="button" class="boldBtn"><img src="/assets/images/bold.svg" alt="Bold"></button>
                  <button type="button" class="italicBtn"><img src="/assets/images/italic.svg" alt="Italic" class="italic"></button>
                  <button type="button" class="quoteBtn"><img src="/assets/images/quote.svg" alt="Quote"></button>
                  <button type="button" class="imageBtn"><img src="/assets/images/image.svg" alt="Add Image" class="pic"></button>
                  <input type="file" class="imageUpload" accept="image/*" style="display: none;">
              </div>
              
              <div class="sectionContent" contenteditable="true" placeholder="Write your content here...">${section.content}</div>
          </details>
      `;
      sectionsContainer.appendChild(sectionElement);
      attachEditorToolbarListeners(sectionElement); 
      attachImageUploadListener(sectionElement); 
    });

    // Initialize sectionCount after rendering existing sections
    let sectionCount = sectionsContainer.querySelectorAll('.section').length + 1;

    const addSectionButton = document.getElementById("addSectionButton");
    if (addSectionButton) {
        addSectionButton.addEventListener("click", function () {
            if (sectionCount > numberWords.length) {
                if(addSectionButton.disabled !== undefined) addSectionButton.disabled = true;
                alert("Maximum number of sections reached.");
                return;
            }

            const newSectionElement = document.createElement("div");
            newSectionElement.classList.add("section");

            const sectionWord = (sectionCount <= numberWords.length) ? numberWords[sectionCount - 1] : sectionCount.toString();
            newSectionElement.innerHTML = `
                <details open>
                    <summary>Section ${sectionWord}:</summary>
                    <label for="sectionTitle${sectionCount}">Section Title:</label>
                    <input type="text" id="sectionTitle${sectionCount}" name="sectionTitle[]" value=""> 
                    
                    <div class="editor-toolbar">
                        <button type="button" class="boldBtn"><img src="/assets/images/bold.svg" alt="Bold"></button>
                        <button type="button" class="italicBtn"><img src="/assets/images/italic.svg" alt="Italic" class="italic"></button>
                        <button type="button" class="quoteBtn"><img src="/assets/images/quote.svg" alt="Quote"></button>
                        <button type="button" class="imageBtn"><img src="/assets/images/image.svg" alt="Add Image" class="pic"></button>
                        <input type="file" class="imageUpload" accept="image/*" style="display: none;">
                    </div>
                    
                    <div class="sectionContent" contenteditable="true" placeholder="Write your content here..."></div>
                </details>
            `;

            sectionsContainer.appendChild(newSectionElement);
            
            attachEditorToolbarListeners(newSectionElement);
            attachImageUploadListener(newSectionElement); 

            sectionCount++;
        });
    }


    function attachEditorToolbarListeners(container) {
      const boldBtns = container.querySelectorAll(".boldBtn");
      const italicBtns = container.querySelectorAll(".italicBtn");
      const quoteBtns = container.querySelectorAll(".quoteBtn");
    
      function toggleStyle(tag) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
      
        const command = tag === "bold" ? "bold" : "italic";
        // execCommand is now on the brim of death, but i trust https://stackoverflow.com/a/70831583
        document.execCommand(command, false, null);
      }
      
      boldBtns.forEach((btn) => {
        btn.addEventListener("click", () => toggleStyle("bold"));
      });
      
      italicBtns.forEach((btn) => {
        btn.addEventListener("click", () => toggleStyle("italic"));
      });

      quoteBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const section = btn.closest('.section');
          const sectionContent = section.querySelector('.sectionContent');
        
          const selection = window.getSelection();
          if (!selection.rangeCount) return;

          const range = selection.getRangeAt(0);
          const commonAncestor = range.commonAncestorContainer;

          // check if selection is within the sectionContent div
          if (sectionContent.contains(commonAncestor)) {
            const blockquote = document.createElement("blockquote");
            blockquote.style.padding = "10px";
            blockquote.style.borderLeft = "4px solid #666";
            const paragraph = document.createElement("p");
            const span = document.createElement("span");
            span.textContent = " — Author Name";
            span.style.fontStyle = "italic";

            if (!range.collapsed) {
              const quoteText = range.toString();
              paragraph.textContent = quoteText;
              paragraph.appendChild(span);
              blockquote.appendChild(paragraph);
              range.deleteContents();
            } else {
              paragraph.innerHTML = `“Quote text goes here.”`;
              paragraph.appendChild(span);
              blockquote.appendChild(paragraph);
            }

            range.insertNode(blockquote);

            range.setStartAfter(blockquote);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
          } else {
            alert("place cursor within the sectionContent area to add quote!");
          }
        });
      });
    }

    function attachImageUploadListener(section) { 
      const imageBtn = section.querySelector(".imageBtn");
      const imageUpload = section.querySelector(".imageUpload"); 
    
      if (imageBtn && imageUpload) {
        imageBtn.addEventListener("click", () => {
          imageUpload.click(); 
        });
    
        imageUpload.addEventListener("change", (event) => {
          const file = event.target.files[0];
          if (file) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "myuploadpreset");
    
            fetch("https://api.cloudinary.com/v1_1/dxjeykfd8/image/upload", {
              method: "POST",
              body: formData,
            })
              .then((response) => response.json())
              .then((data) => {
                const imageUrl = data.secure_url;
                const img = document.createElement("img");
                img.src = imageUrl;
                img.style.maxWidth = "100%";
                img.alt = "Inserted Image";
    
                const contentEditableDiv = section.querySelector(".sectionContent");
                contentEditableDiv.appendChild(img);
              })
              .catch((err) => console.error("Error uploading to Cloudinary:", err));
          }
        });
      }
    }
    
    const blogForm = document.getElementById("blogForm");
    const saveButton = document.getElementById("submitForm");
    const uploadContainer = document.querySelector(".pgr-btn");
    const progressBar = document.querySelector(".pgr-bar");
    const progressText = document.querySelector(".pgr-pcnt");

    blogForm.addEventListener("submit", function (e) {
      e.preventDefault();

      saveButton.style.display = "none";
      uploadContainer.style.display = "flex";

      const title = document.getElementById("title").value;
      const description = document.getElementById("description").value;
      const headerImageInput = document.getElementById("headerImage");

      if (headerImageInput.files.length > 0) {
        const formData = new FormData(); 
        formData.append("file", headerImageInput.files[0]);
        formData.append("upload_preset", "myuploadpreset");
      
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", function (event) {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 80);
            progressBar.style.width = percentComplete + "%";
            progressText.textContent = `${percentComplete}%`;
          }
        });

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            const headerImageData = JSON.parse(xhr.responseText);
            const headerImageUrl = headerImageData.secure_url;
            submitBlogContent(headerImageUrl, title, description);
          } else if (xhr.readyState === 4 && xhr.status !== 200) {
            console.error("err uploading image:", xhr.responseText);
            saveButton.style.display = "block";
            uploadContainer.style.display = "none";
          }
        };
        xhr.open("POST", "https://api.cloudinary.com/v1_1/dxjeykfd8/image/upload", true);
        xhr.send(formData);
      } else {
        submitBlogContent(blogData.headerImage, title, description);
      }
    });

    function submitBlogContent(headerImageUrl, title, description) {
      const sections = document.querySelectorAll(".sections .section"); 
      const content = [];

      sections.forEach((section, index) => {
        const sectionTitleInput = section.querySelector(`input[name="sectionTitle[]"]`);
        const sectionContentDiv = section.querySelector(".sectionContent");

        if (sectionTitleInput && sectionContentDiv) {
          const sectionTitle = sectionTitleInput.value;
          const sectionContent = sectionContentDiv.innerHTML;

          content.push({
            type: "heading",
            level: 2,
            text: sectionTitle,
            id: `section-${index + 1}`, 
          });
          content.push({
            type: "text",
            content: sectionContent,
          });
        }
      });

      const updatedBlogData = { 
        title: title,
        description: description,
        headerImage: headerImageUrl,
        sidebarLinks: content
          .filter((item) => item.type === "heading")
          .map((heading) => ({
            href: `#${heading.id}`,
            text: heading.text,
          })),
        content: content,
      };

      console.log("sent blog data:", updatedBlogData);
      
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", function (event) {
        if (event.lengthComputable) {
          const percentComplete = 80 + Math.round((event.loaded / event.total) * 20);
          progressBar.style.width = percentComplete + "%";
          progressText.textContent = `${percentComplete}%`;
        }
      });

      xhr.open("PUT", `/api/blogs/${blogId}`, true);
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 201)) {
          console.log("Blog post updated:", xhr.responseText);
          const responseData = JSON.parse(xhr.responseText); 
          const returnedBlogId = responseData._id;

          if (returnedBlogId) { 
            window.location.href = `/blog/${returnedBlogId}`;
          } else {
            console.error("blogId not found in response.");
          }
          progressBar.style.width = "100%";
        } else if (xhr.readyState === 4 && xhr.status !== 200) {
          console.error("Error updating blog post:", xhr.responseText);
          saveButton.style.display = "block";
          uploadContainer.style.display = "none";
        }
      };
      xhr.send(JSON.stringify(updatedBlogData));
    }
  } catch (error) {
    console.error(error);
    const sectionsContainer = document.querySelector(".sections");
    if(sectionsContainer) sectionsContainer.innerHTML = "<p>Error loading blog editor. Please try refreshing.</p>";
  }
});
