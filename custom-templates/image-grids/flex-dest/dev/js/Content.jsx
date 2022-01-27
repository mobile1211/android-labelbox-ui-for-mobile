import React, { useCallback } from 'react';
import ListingDetailsHeader from './ListingDetailsHeader';
import ImageGrid from './ImageGrid';

export default function Content({
  assetData,
  currentAsset,
  gridImages,
  isLoading,
  onClickImage,
  photoEdits,
  selectedListing,
  selectedImageIdx,
  setIsLoading,
  setSelectedListing,
  setSelectedImageIdx,
}) {
  const handleSkip = useCallback(() => {
    setSelectedListing();
    setSelectedImageIdx();
    setIsLoading(true);
    Labelbox.skip().then(() => {
      Labelbox.fetchNextAssetToLabel();
    });
  }, []);

  const handleSubmit = useCallback(() => {
    setSelectedListing();
    setSelectedImageIdx();
    const jumpToNext = !currentAsset?.label;

    if (jumpToNext) {
      setIsLoading(true);
    }
    Labelbox.setLabelForAsset(label, 'ANY').then(() => {
      if (jumpToNext) {
        Labelbox.fetchNextAssetToLabel();
      }
    });
  }, []);

  return (
    <div className="content">
      <div id="asset">
        {isLoading ? (
          'loading...'
        ) : (
          <>
            <ListingDetailsHeader
              attribute={assetData?.attribute}
              photoEdits={photoEdits}
              qualityTier={assetData?.qualityTier}
              selectedListing={selectedListing}
            />
            <ImageGrid
              images={gridImages}
              onClickImage={onClickImage}
              photoEdits={photoEdits}
              qualityTier={assetData?.qualityTier}
              selectedImageIdx={selectedImageIdx}
            />
          </>
        )}
      </div>
      <div className="cta-container">
        <a className="cta skip-cta" onClick={handleSkip}>
          Skip
        </a>
        <a className="cta submit-cta" onClick={handleSubmit}>
          Submit
        </a>
      </div>
    </div>
  );
}
