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
  });

document.addEventListener("DOMContentLoaded", function () {
  const boldBtns = document.querySelectorAll(".boldBtn");
  const italicBtns = document.querySelectorAll(".italicBtn");
  const imageBtns = document.querySelectorAll(".imageBtn");

  // Wrap selected text in HTML tag
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
});

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

document.getElementById("blogForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const headerImageInput = document.getElementById("headerImage");

  const formData = new FormData();
  formData.append("file", headerImageInput.files[0]);
  formData.append("upload_preset", "myuploadpreset");

  // upload header image to Cloudinary
  fetch("https://api.cloudinary.com/v1_1/dxjeykfd8/image/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((headerImageData) => {
      const headerImageUrl = headerImageData.secure_url;

      const sections = document.querySelectorAll(".section");
      const content = [];

      sections.forEach((section, index) => {
        const sectionTitle = section.querySelector(
          `input[name="sectionTitle"]`
        ).value;
        const sectionContent =
          section.querySelector(".sectionContent").innerHTML;

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

      // Build JSON data
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

      fetch("https://www.thebitbytebit.tech/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Blog post created:", data);
        })
        .catch((err) => console.error("Error creating blog post:", err));
    })
    .catch((err) => console.error("Error uploading image to Cloudinary:", err));
});
