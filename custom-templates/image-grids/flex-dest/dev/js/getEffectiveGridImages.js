function overrideGridImages(changes, gridImages) {
  const listingIdsWithUpdatedDefaultPhoto = changes.map(
    (e) => !!e.defaultPhotoId && e.listingId
  );
  const updatedGridImages = gridImages.map((imgObj) => {
    if (listingIdsWithUpdatedDefaultPhoto.includes(imgObj.listingId)) {
      const updatedPhotoId = changes.find(
        (edit) => edit.listingId === imgObj.listingId
      ).defaultPhotoId;
      const updatedPhotoLink = imgObj.listingImages.find(
        (photo) => photo.photoId === updatedPhotoId
      ).photoLink;

      return Object.assign({}, imgObj, {
        photoLink: updatedPhotoLink,
      });
    }
    return imgObj;
  });
  return updatedGridImages;
}

export default function getEffectiveGridImages(
  assetData,
  photoEdits,
  selectedImageIdx,
  newDefaultPhotoId
) {
  if (!assetData) return [];
  const { gridImages } = assetData;

  if (photoEdits.length) {
    gridImages = overrideGridImages(photoEdits, gridImages);
  }

  if (typeof selectedImageIdx === 'number' && !!newDefaultPhotoId) {
    return [
      ...gridImages.slice(0, selectedImageIdx),
      Object.assign({}, gridImages[selectedImageIdx], {
        photoLink: gridImages[selectedImageIdx].listingImages.find(
          (photo) => photo.photoId === newDefaultPhotoId
        )?.photoLink,
      }),
      ...gridImages.slice(selectedImageIdx + 1),
    ];
  }

  return gridImages;
}
