function showLoadingAssets() {
    document.querySelector("#asset").innerHTML = "loading...";
    document.querySelector('.content').scrollTo(0,0);
}

function goHome() {
    window.location.href =
      "https://app.labelbox.com/projects/" + state.projectId;
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

function skip() {
    safelyClearSelectedMetadata();
    showLoadingAssets();
    Labelbox.skip().then(() => {
      Labelbox.fetchNextAssetToLabel();
    });
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