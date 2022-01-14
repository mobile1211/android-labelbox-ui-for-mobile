// on submit
function getLabel() {
  const getAnswer = node => {
    const key = node.getAttribute("id");
    const type = node.getAttribute("questiontype");
    if (type === "text") {
      return {
        [key]: node.querySelector("input").value
      };
    }

    if (type === "radio") {
      const inputs = Array.from(node.querySelectorAll("input"));
      const selected = inputs.find(child => child.checked);
      return {
        [key]: selected && selected.getAttribute("valuetosubmit")
      };
    }

    if (type === "checklist") {
      const inputs = Array.from(node.querySelectorAll("input"));
      const value = inputs
        .filter(child => child.checked)
        .map(child => child.getAttribute("valuetosubmit"));
      return {
        [key]: value
      };
    }

    console.log("Unable to find type for", node);
  };

  const answers = Array.from(
    document.querySelector("#questions").children
  ).map(getAnswer);

  return Object.assign({}, ...answers);
}

function createAdditionalImage(listingImage) {
  return `
    <div class="additional-image">
      <div>Photo ID: ${listingImage.photoId}</div>
      <img src="${listingImage.photoLink}" style="width:100%"/>
    </div>
  `;
}
