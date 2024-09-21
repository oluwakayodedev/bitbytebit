document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("authToken");

  if (!token) {
    window.location.href = "/signin";
    return;
  }

  fetch("/api/auth/verifyToken", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ token }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data.valid) {
        console.log("Invalid Token, redirecting to /signin");
        window.location.href = "/signin";
      }
    })
    .catch((error) => {
      console.error("Token verification err:", error);
      window.location.href = "/signin";
    });
});

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
let sectionCount = 2;

document
  .getElementById("addSectionButton")
  .addEventListener("click", function () {
    if (sectionCount > numberWords.length) {
      // Disable button if limit reached
      document.getElementById("addSectionButton").disabled = true;
      return;
    }

    const sectionsContainer = document.querySelector(".sections");
    const newSection = document.createElement("div");
    newSection.className = "section";

    const sectionNumber = numberWords[sectionCount - 1];
    newSection.innerHTML = `
      <details>
          <summary>Section ${sectionNumber}:</summary>
          <label for="sectionTitle">Section Title:</label>
          <input type="text" id="sectionTitle" name="sectionTitle">
          
          <div class="editor-toolbar">
              <button type="button" class="boldBtn"><img src="./assets/images/bold.svg" alt="Bold"></button>
              <button type="button" class="italicBtn"><img src="./assets/images/italic.svg" alt="Italic" class="italic"></button>
              <button type="button" class="quoteBtn"><img src="./assets/images/quote.svg" alt="Quote"></button>
              <button type="button" class="imageBtn"><img src="./assets/images/image.svg" alt="Add Image" class="pic"></button>
              <input type="file" class="imageUpload" accept="image/*" style="display: none;">
          </div>                            
          
          <div class="sectionContent" contenteditable="true" placeholder="Write your content here..."></div>
      </details>
    `;

    sectionsContainer.appendChild(newSection);
    sectionCount++;

    attachImageUploadListener(newSection);
    attachEditorToolbarListeners(newSection);
  });

document.addEventListener("DOMContentLoaded", function () {
  attachEditorToolbarListeners(document);
});

function attachEditorToolbarListeners(container) {
  const boldBtns = container.querySelectorAll(".boldBtn");
  const italicBtns = container.querySelectorAll(".italicBtn");
  const imageBtns = container.querySelectorAll(".imageBtn");

  // wrap selected text in HTML tag
  function wrapSelection(tag) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.extractContents();
    const span = document.createElement("span");

    if (tag === "bold") {
      span.style.fontWeight = "bold";
    } else if (tag === "italic") {
      span.style.fontStyle = "italic";
    }

    span.appendChild(selectedText);
    range.insertNode(span);
    selection.removeAllRanges();
  }

  boldBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      wrapSelection("bold");
    });
  });

  italicBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      wrapSelection("italic");
    });
  });

  imageBtns.forEach((btn) => {
    attachImageUploadListener(btn.closest(".section"));
  });
}

// attach image
function attachImageUploadListener(section) {
  const imageBtn = section.querySelector(".imageBtn");
  const imageUpload = section.querySelector(".imageUpload");

  imageBtn.addEventListener("click", function () {
    imageUpload.click();
  });

  imageUpload.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "myuploadpreset");

      // upload image to Cloudinary
      fetch("https://api.cloudinary.com/v1_1/dxjeykfd8/image/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          // retrieve img url
          const imageUrl = data.secure_url;

          // insert image into the contenteditable area
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

document.addEventListener("DOMContentLoaded", function () {
  const blogForm = document.getElementById("blogForm");
  const publishButton = document.getElementById("submitForm");
  const uploadContainer = document.querySelector(".pgr-btn");
  const progressBar = document.querySelector(".pgr-bar");
  const progressText = document.querySelector(".pgr-pcnt");

  blogForm.addEventListener("submit", function (e) {
    e.preventDefault();

    publishButton.style.display = "none";
    uploadContainer.style.display = "flex";

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const headerImageInput = document.getElementById("headerImage");

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

        // handle blog content submission after the image upload
        submitBlogContent(headerImageUrl, title, description);
      } else if (xhr.readyState === 4 && xhr.status !== 200) {
        console.error("Error during the image upload:", xhr.responseText);
        // show publish btn again in case of err
        publishButton.style.display = "block";
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
  });

  function submitBlogContent(headerImageUrl, title, description) {
    const sections = document.querySelectorAll(".section");
    const content = [];

    sections.forEach((section, index) => {
      const sectionTitle = section.querySelector(
        `input[name="sectionTitle"]`
      ).value;
      const sectionContent = section.querySelector(".sectionContent").innerHTML;

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

    xhr.open("POST", "https://www.thebitbytebit.tech/api/blogs", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 201)) {
        console.log("Blog post created:", xhr.responseText);
        // get blog id from the response and redirect to the blog
        const response = JSON.parse(xhr.responseText);
        const blogId = response._id;

        if (blogId) {
          window.location.href = `https://www.thebitbytebit.tech/blog/${blogId}`;
        } else {
          console.error("blogId not found in response.");
        }

        progressBar.style.width = "100%";
      } else if (xhr.readyState === 4 && xhr.status !== 200) {
        console.error("Error submitting blog post:", xhr.responseText);
        // show publish btn in case of error
        publishButton.style.display = "block";
        uploadContainer.style.display = "none";
      }
    };

    xhr.send(JSON.stringify(blogData));
  }
});
