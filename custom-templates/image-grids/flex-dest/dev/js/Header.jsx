import React, { useCallback } from 'react';

export default function Header({
  currentAsset,
  hasPrev,
  hasNext,
  projectId,
  setIsLoading,
  setSelectedListing,
  setSelectedImageIdx,
}) {
  const handleGoHome = useCallback(() => {
    window.location.href = 'https://app.labelbox.com/projects/' + projectId;
  }, [projectId]);

  const handleGoBack = useCallback(() => {
    setSelectedListing();
    setSelectedImageIdx();
    setIsLoading(true);

    if (currentAsset?.previous) {
      Labelbox.setLabelAsCurrentAsset(currentAsset.previous);
    }
  }, [currentAsset]);

  const handleGoNext = useCallback(() => {
    setSelectedListing();
    setSelectedImageIdx();
    setIsLoading(true);

    if (currentAsset?.next) {
      Labelbox.setLabelAsCurrentAsset(currentAsset.next);
    } else {
      Labelbox.fetchNextAssetToLabel();
    }
  }, [currentAsset]);

  return (
    <div className="header-container">
      <i className="material-icons home-icon" onClick={handleGoHome}>
        home
      </i>
      <i
        id="back"
        className={`material-icons back-icon ${
          hasPrev ? 'button-default' : ''
        }`}
        onClick={handleGoBack}
      >
        keyboard_arrow_left
      </i>
      <div className="header-title" id="externalid">
        Label this asset
      </div>
      <i
        id="next"
        className={`material-icons next-icon ${
          hasNext ? 'button-default' : ''
        }`}
        onClick={handleGoNext}
      >
        keyboard_arrow_right
      </i>
    </div>
  );
}
