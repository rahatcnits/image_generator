const generateForm = document.querySelector(".generate_form");
const imgGallery = document.querySelector(".image_gallery");

let isImageGenerating = false;

const OPENAI_API_KEY = "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";

const updateImageCard = (imgDataArray) => {
  imgDataArray.forEach((imgObject, index) => {
    const imgCard = imgGallery.querySelectorAll(".image_card")[index];
    const imgElement = imgCard.querySelector("img");
    const downloadBtn = imgCard.querySelector(".download_btn");

    const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
    imgElement.src = aiGeneratedImg;

    imgElement.onload = () => {
      imgCard.classList.remove("loading");
      downloadBtn.setAttribute("href", aiGeneratedImg);
      downloadBtn.setAttribute("download", `${new Date().getTime()}.png`);
    };
  });
};

const generateAiImages = async (userPrompt, userImgQuantity) => {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: userPrompt,
          n: parseInt(userImgQuantity),
          size: "512x512",
          response_format: "b64_json",
        }),
      }
    );

    if (!response.ok)
      throw new Error("Failed to generate images! Please try again.");

    const { data } = await response.json();

    updateImageCard([...data]);
  } catch (err) {
    alert(err.message);
  } finally {
    isImageGenerating = false;
  }
};

const handleFormSubmission = (e) => {
  e.preventDefault();

  if (isImageGenerating) return;
  isImageGenerating = true;

  // get user input and image quantity values from the form
  const userPrompt = e.srcElement[0].value;
  const userImgQuantity = e.srcElement[1].value;

  // creating html markup for image cards with loading state
  const imgCardMarkup = Array.from(
    { length: userImgQuantity },
    () =>
      `<div class="image_card loading">
        <img src="./images/loader.svg" alt="image">
        <a href="#" class="download_btn">
            <img src="./images/download.svg" alt="download icon">
        </a>
      </div>`
  ).join("");

  imgGallery.innerHTML = imgCardMarkup;
  generateAiImages(userPrompt, userImgQuantity);
};

generateForm.addEventListener("submit", handleFormSubmission);
