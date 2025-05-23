document.addEventListener("DOMContentLoaded", async function () {
  const numberWords = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
  // extract id from URL
  const url = window.location.href;
  const blogId = url.split("/editBlog/")[1];

  // fetch blog data using the blogId
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
          blogData.headerImage = newImageUrl;
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
        }
      }
    });

    const sectionsContainer = document.querySelector(".sections");
    sectionsContainer.innerHTML = "";

    // add both heading and content into a section
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

    // redundant empty section check
    if (
      currentSection.heading !== "Untitled Section" ||
      currentSection.content !== ""
    ) {
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
    });

    function attachEditorToolbarListeners(container) {
      const boldBtns = container.querySelectorAll(".boldBtn");
      const italicBtns = container.querySelectorAll(".italicBtn");
      const quoteBtns = container.querySelectorAll(".quoteBtn");
      const imageBtns = container.querySelectorAll(".imageBtn");
    
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
          const selection = window.getSelection();
          if (!selection.rangeCount) return;

          const range = selection.getRangeAt(0);
          const blockquote = document.createElement("blockquote");
          const paragraph = document.createElement("p");
          const span = document.createElement("span");
          span.textContent = " — Author Name";

          // existing text selection
          if (!range.collapsed) {
            const quoteText = range.toString();
            paragraph.textContent = quoteText;
            paragraph.appendChild(span);
            blockquote.appendChild(paragraph);
            range.deleteContents();
          } else {
            paragraph.innerHTML = `“Enter your quote here.”`;
            paragraph.appendChild(span);
            blockquote.appendChild(paragraph);
          }

          range.insertNode(blockquote);

          range.setStartAfter(blockquote);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        });
      });

      imageBtns.forEach((btn) => {
        const section = btn.closest(".section");
        attachImageUploadListener(section);
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
    
    // edited form submission
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

      const formData = new FormData();
      formData.append("file", headerImageInput.files[0]);
      formData.append("upload_preset", "myuploadpreset");

      // check if a new headerImage is uploaded
      if (headerImageInput.files.length > 0) {
        const formData = new FormData();
        formData.append("file", headerImageInput.files[0]);
        formData.append("upload_preset", "myuploadpreset");
      
        const xhr = new XMLHttpRequest();

        // track image upload progress using 80% of the progress bar
        xhr.upload.addEventListener("progress", function (event) {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 80);
            progressBar.style.width = percentComplete + "%";
            progressText.textContent = `${percentComplete}%`;
          }
        });

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            // get uploaded image URL
            const headerImageData = JSON.parse(xhr.responseText);
            const headerImageUrl = headerImageData.secure_url;
            submitBlogContent(headerImageUrl, title, description);
          } else if (xhr.readyState === 4 && xhr.status !== 200) {
            console.error("err uploading image:", xhr.responseText);
            saveButton.style.display = "block";
            uploadContainer.style.display = "none";
          }
        };

        // upload image request
        xhr.open(
          "POST",
          "https://api.cloudinary.com/v1_1/dxjeykfd8/image/upload",
          true
        );
        xhr.send(formData);
      } else {
        // use existing headerImage if no new image is uploadeded
        submitBlogContent(blogData.headerImage, title, description);
      }
    });

    function submitBlogContent(headerImageUrl, title, description) {
      const sections = document.querySelectorAll(".section");
      const content = [];

      sections.forEach((section, index) => {
        const sectionTitleInput = section.querySelector(
          `input[name="sectionTitle[]"]`
        );
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

      const blogData = {
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

      console.log("sent blog data:", blogData);
      
      const xhr = new XMLHttpRequest();

      // track blog submission progress using the remaining 20% of the progress bar
      xhr.upload.addEventListener("progress", function (event) {
        if (event.lengthComputable) {
          const percentComplete =
            80 + Math.round((event.loaded / event.total) * 20);
          progressBar.style.width = percentComplete + "%";
          progressText.textContent = `${percentComplete}%`;
        }
      });

      xhr.open("PUT", `/api/blogs/${blogId}`, true);
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 201)) {
          console.log("Blog post updated:", xhr.responseText);
          // get blog id from the response and redirect to the blog
          const response = JSON.parse(xhr.responseText);
          const blogId = response._id;

          if (blogId) {
            window.location.href = `/blog/${blogId}`;
          } else {
            console.error("blogId not found in response.");
          }

          progressBar.style.width = "100%";
        } else if (xhr.readyState === 4 && xhr.status !== 200) {
          console.error("Error updating blog post:", xhr.responseText);
          // show save btn again in case of error
          saveButton.style.display = "block";
          uploadContainer.style.display = "none";
        }
      };

      xhr.send(JSON.stringify(blogData));
    }
  } catch (error) {
    console.error(error);
  }
});