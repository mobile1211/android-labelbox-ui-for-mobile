export default function getUpdatedDefaultPhotoId(photoEdits, listing) {
  return photoEdits.find((edit) => edit.listingId === listing.listingId)
    ?.updatedDefaultPhotoId;
}
