export default function getEffectiveGridImages(
  assetData,
  photoEdits,
  selectedImageIdx,
  newDefaultPhotoId
) {
  if (!assetData) return [];
  let gridImagesCopy = [...assetData.gridImages];

  if (photoEdits.length) {
    const listingIdsWithUpdatedDefaultPhoto = photoEdits.map(
      (e) => !!e.updatedDefaultPhotoId && e.listingId
    );
    gridImagesCopy = gridImagesCopy.map((imgObj) => {
      if (listingIdsWithUpdatedDefaultPhoto.includes(imgObj.listingId)) {
        const updatedPhotoId = photoEdits.find(
          (edit) => edit.listingId === imgObj.listingId
        ).updatedDefaultPhotoId;
        const updatedPhotoLink = imgObj.listingImages.find(
          (photo) => photo.photoId === updatedPhotoId
        ).photoLink;

        return Object.assign({}, imgObj, {
          photoLink: updatedPhotoLink,
        });
      }
      return imgObj;
    });
  }

  if (typeof selectedImageIdx === 'number' && !!newDefaultPhotoId) {
    return [
      ...gridImagesCopy.slice(0, selectedImageIdx),
      Object.assign({}, gridImagesCopy[selectedImageIdx], {
        photoLink: assetData.gridImages[selectedImageIdx].listingImages.find(
          (photo) => photo.photoId === newDefaultPhotoId
        )?.photoLink,
      }),
      ...gridImagesCopy.slice(selectedImageIdx + 1),
    ];
  }

  return gridImagesCopy;
}
