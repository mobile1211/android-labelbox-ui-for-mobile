let state = {
    projectId: new URL(window.location.href).searchParams.get("project"),
    currentAsset: undefined
  };
  const defaultConfiguration = {
    classifications: [
      {
        name: "image_grid_update",
        instructions: "Done updating image grid?",
        type: "radio",
        options: [
          {
            "label": "Yes",
            "value": "yes"
          },
          {
            "label": "No",
            "value": "no"
          }
        ]
      }
    ]
  };

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

  let classifications = [];
  let markQuestionsAsLoaded;
  new Promise(resolve => {
    markQuestionsAsLoaded = resolve;
  }).then(() => {
    Labelbox.currentAsset().subscribe(asset => {
      if (asset) {
        drawAsset(asset);
      }
    });
  });

  function drawQuestions(classifications, answers) {
    document.querySelector("#questions").innerHTML = classifications
      .map(classification => createQuestion(classification, answers))
      .join("");
  }

  Labelbox.getTemplateCustomization().subscribe(customization => {
    classifications =
      (customization && customization.classifications) || defaultConfiguration.classifications;
    drawQuestions(classifications);
    markQuestionsAsLoaded();
  });

  function goHome() {
    window.location.href =
      "https://app.labelbox.com/projects/" + state.projectId;
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

  function showLoadingAssets() {
    document.querySelector("#asset").innerHTML = "loading...";
    document.querySelector('.content').scrollTo(0,0);
  }

  function submit() {
    safelyClearSelectedMetadata();

    const label = JSON.stringify(getLabel());
    const jumpToNext = Boolean(!state.currentAsset.label);
    console.log("jumpToNext:", jumpToNext)
    // Progress if this asset is new
    if (jumpToNext) {
      showLoadingAssets();
    }
    Labelbox.setLabelForAsset(label, 'ANY').then(() => {
      if (jumpToNext) {
        Labelbox.fetchNextAssetToLabel();
      }
    });
  }

  function skip() {
    safelyClearSelectedMetadata();
    showLoadingAssets();
    Labelbox.skip().then(() => {
      Labelbox.fetchNextAssetToLabel();
    });
  }

  function goBack() {
    safelyClearSelectedMetadata();
    showLoadingAssets();
    if (state.currentAsset.previous) {
      Labelbox.setLabelAsCurrentAsset(state.currentAsset.previous);
    }
  }

  function goNext() {
    safelyClearSelectedMetadata();
    showLoadingAssets();
    if (state.currentAsset.next) {
      Labelbox.setLabelAsCurrentAsset(state.currentAsset.next);
    } else {
      Labelbox.fetchNextAssetToLabel();
    }
  }

  function pdpUrl(listingId) {
    return `https://www.airbnb.com/rooms/${listingId}`;
  }

  function gsheetUrl(listingId, photoId) {
    const gsheetUrlMain = "https://docs.google.com/forms/d/e/1FAIpQLSdZuDncKFE3pSUd_vMTkKIrnA3PDOY2x7uupe_RzAERSc6wVQ/viewform?usp=pp_url";
    const paramListingId = `entry.1673408678=${listingId}`;
    const paramAttribute = `entry.1331702945=${state.currentAssetData.attribute}`;
    const paramPhotoLink = `entry.709101333=https://www.airbnb.com/rooms/${listingId}/photos/${photoId}`;
    const paramQuality = `entry.1305733443=${state.currentAssetData.qualityTier}`;

    // Param ordering apparently matters!!!
    return `${gsheetUrlMain}&${paramListingId}&${paramAttribute}&${paramPhotoLink}&${paramQuality}`;
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
    document.querySelector("#selected-gsheet-link").href = '';
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

  function displayInfo(itemIdx) {
    console.log("Image state:", state.currentAssetData.gridImages[itemIdx]);
    const {
      listingId: listingId,
      photoId: photoId,
      propertyType: propertyType,
      roomType: roomType,
      listingImages: listingImages,
      listingTitle: title,
      listingDescription: description,
      listingLocation: location,
      listingNeighborhood: neighborhood,
      lat: lat,
      lng: lng,
    } = state.currentAssetData.gridImages[itemIdx];

    clearSelectedMetadata();

    document.querySelector(`#image-container-${listingId}`).classList.add('selected');
    document.querySelector("#selected-id").innerHTML = listingId;
    document.querySelector("#selected-photo").innerHTML = photoId;
    document.querySelector("#selected-pdp-link").href = pdpUrl(listingId);
    document.querySelector("#selected-gsheet-link").href = gsheetUrl(listingId, photoId);
    document.querySelector("#selected-property-type").innerHTML = propertyType;
    document.querySelector("#selected-room-type").innerHTML = roomType;
    document.querySelector("div.flex-column.side-panel").scrollTo(0,0);
    document.querySelector("#panel-info").innerHTML = createPanelInfo(title, description, location, neighborhood, lat, lng);
    document.querySelector("#panel-pictures").innerHTML = listingImages.map(createAdditionalImage).join("\n");
  }

  function createImage(imageObj, idx) {
    const photoLink = imageObj.photoLink?.includes("?")
      ? `${imageObj.photoLink}`
      : `${imageObj.photoLink}?img_w=720`;
    const listingId = imageObj.listingId;

    return `
      <div
        class="image-container"
        onclick="{displayInfo(${idx})}"
        tabindex="${idx}"
        id="image-container-${listingId}"
      >
        <img src="${photoLink}" listingId="${listingId}" class="image" />
      </div>
    `;
  }

  function getHtmlForAsset(parsedData) {
    console.log(parsedData);
    return `
      <div class="header sticky">
        <div style="display:flex;flex-direction:column;">
          <h3>${parsedData.attribute} - ${parsedData.qualityTier}</h3>

          <div style="display:flex;flex-direction:row;flex-grow:1;align-items:flex-end;padding-bottom:10px">
            <div class="listing-info">
              Listing ID: <span id="selected-id"></span>
            </div>
            <div class="listing-info">
              Photo ID: <span id="selected-photo"></span>
            </div>
            <div class="listing-info">
              Property type: <span id="selected-property-type"></span>
            </div>
            <div class="listing-info">
              Room type: <span id="selected-room-type"></span>
            </div>
            <div class="listing-info">
              <a href="" id="selected-pdp-link" target="_blank">Link to PDP</a>
            </div>
            <div class="listing-info">
              <a href="" id="selected-gsheet-link" target="_blank">Link to GSheet</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Photo Grid -->
      <div class="photo-grid">
        ${parsedData.gridImages.map(createImage).join("\n")}
      </div>
    `;
  }

  async function downloadObjectAsync(url) {
    try {
      const fetchResponse = await fetch(url);
      return await fetchResponse.json();
    } catch (err) {
      console.error('Error: ', err);
    }
  }

  const successCb = (resp) => {
      console.log(resp);
  };

  const errorCb = (err) => {
      console.error('Error - ', err);
  };

  function downloadObject(url, successCb, errorCb) {
      fetch(url)
        .then(response => response.json())
        .then(successCb)
        .catch(errorCb);
  }

  function get(url){
    var Httpreq = new XMLHttpRequest();
    Httpreq.open("GET", url, false);
    Httpreq.send(null);
    return Httpreq.responseText;
  }

  function drawAsset(asset) {
    const backButton = document.querySelector("#back");
    backButton.style.opacity = asset.previous ? 1 : 0.2;
    backButton.style.cursor = asset.previous ? "pointer" : "inherit";
    const hasNext = Boolean(asset.next || asset.label);
    const nextButton = document.querySelector("#next");
    nextButton.style.opacity = hasNext ? 1 : 0.2;
    nextButton.style.cursor = hasNext ? "pointer" : "inherit";

    console.log("Asset", asset);

    console.log("S3 asset link", asset.data);
    const assetDataStr = get(asset.data).replace(/NaN/g, "null");
    const assetData = JSON.parse(assetDataStr);
    if ((state.currentAsset && state.currentAsset.data) !== asset.data) {
      document.querySelector("#asset").innerHTML = getHtmlForAsset(assetData);
    }
    if ((state.currentAsset && state.currentAsset.id) !== asset.id) {
      if (asset.label) {
        try {
          const label = JSON.parse(asset.label);
          drawQuestions(classifications, label);
        } catch (e) {
          console.log("failed to read label", e);
        }
      } else {
        drawQuestions(classifications);
      }
    }
    state = {
      ...state,
      currentAsset: asset,
      currentAssetData: assetData,
    };
  }