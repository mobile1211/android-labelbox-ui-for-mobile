function createOptionQuestion({ type, name, options, instructions }, answer) {
  const createOption = ({ value, label }) => {
    return `
    <p value=${value}>
      <label>
        ${
          type == "radio"
            ? `<input class="with-gap" type="radio" name="group-${name}" valuetosubmit="${value}" ${
                answer === value ? "checked" : ""
              } />`
            : `<input type="checkbox" class="filled-in" valuetosubmit="${value}" ${
                (answer || []).indexOf(value) !== -1 ? "checked" : ""
              } />`
        }
        <span>${label}</span>
      </label>
    </p>
  `;
  };
  return `
  <div class="question" id="${name}" questiontype="${type}">
    <div class="label">${instructions}</div>
    <form action="#">
      ${options.map(createOption).join("")}
    </form>
  </div>
`;
}

function createTextInput({ id, label }, answer) {
  return `
  <div class="question" id="${id}" questiontype="text">
    <div class="input-field col s12">
      <div class="label">${label}</div>
      <input class="materialize-textarea" data-length="120" value="${answer || ""}"></input>
    </div>
  </div>
`;
}

function createQuestion(question, answers) {
  const optionalAnswer = (answers || {})[question.name];
  if (question.type === "text") {
    return createTextInput(
      {
        id: question.name,
        label: question.instructions
      },
      optionalAnswer
    );
  }

  if (question.type === "radio" || question.type === "checklist") {
    return createOptionQuestion(question, optionalAnswer);
  }

  console.log("Unknown question type", question);
}

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

function pdpUrl(listingId) {
  return `https://www.airbnb.com/rooms/${listingId}`;
}

function createAdditionalImage(listingImage) {
  return `
    <div class="additional-image">
      <div>Photo ID: ${listingImage.photoId}</div>
      <img src="${listingImage.photoLink}" style="width:100%"/>
    </div>
  `;
}

function createPanelInfo(title, description, location, where, lat, lng) {
  // https://www.google.com/maps/search/?api=1&query={lat}%2C{lng}
  // src="https://maps.google.com/maps?q=${lat},${lng}&hl=es&z=14&amp;output=embed"
  // href="https://maps.google.com/maps?q=${lat},${lng};z=14&amp;output=embed"
  return `
    <div style="display:flex;flex-direction:row;flex-grow:1;align-items:flex-end;padding-bottom:10px">
      <div class="listing-info">
        <b>Title</b>: ${title}
      </div>
    </div>

    <div style="display:flex;flex-direction:row;flex-grow:1;align-items:flex-end;padding-bottom:10px">
      <div class="listing-info">
        <b>Description</b>: ${description}
      </div>
    </div>

    <div style="display:flex;flex-direction:row;flex-grow:1;align-items:flex-end;padding-bottom:10px">
      <div class="listing-info">
        <b>Location</b>: ${location}
      </div>
    </div>

    <div style="display:flex;flex-direction:row;flex-grow:1;align-items:flex-end;padding-bottom:10px">
      <div class="listing-info">
        <b>Where You'll Be</b>: ${where}
      </div>
    </div>

    <div style="display:flex;flex-direction:row;flex-grow:1;align-items:flex-end;padding-bottom:20px">
      <div class="listing-info">
        <iframe width="450" height="450" frameborder="0" scrolling="yes" marginheight="0" marginwidth="0"
          src="https://maps.google.com/maps?q=${lat},${lng}&z=14&amp;output=embed"
        >
        </iframe>
      </div>
    </div>
  `;
}

function clearSelectedMetadata() {
  document.querySelectorAll(".image-container.selected").forEach((node) => {
    node.classList.remove('selected');
  });

  document.querySelector("#selected-id").innerHTML = '';
  document.querySelector("#selected-photo").innerHTML = '';
  document.querySelector("#selected-pdp-link").href = '';
  document.querySelector("#selected-property-type").innerHTML = '';
  document.querySelector("#selected-room-type").innerHTML = '';
  document.querySelector("#panel-info").innerHTML = '';
  document.querySelector("#panel-pictures").innerHTML = '';
}

function safelyClearSelectedMetadata() {
  try {
    clearSelectedMetadata()
  } catch(e) {
    console.warn('could not clear data', e);
  }
}


