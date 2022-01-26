export default function getEffectiveGridImages(
  assetData,
  selectedImageIdx,
  newDefaultPhotoId
) {
  if (!assetData) return [];

  if (typeof selectedImageIdx === 'number' && !!newDefaultPhotoId) {
    return [
      ...assetData.gridImages.slice(0, selectedImageIdx),
      Object.assign({}, assetData.gridImages[selectedImageIdx], {
        photoLink: assetData.gridImages[selectedImageIdx].listingImages.find(
          (photo) => photo.photoId === newDefaultPhotoId
        )?.photoLink,
      }),
      ...assetData.gridImages.slice(selectedImageIdx + 1),
    ];
  }
  return [...assetData.gridImages];
}
