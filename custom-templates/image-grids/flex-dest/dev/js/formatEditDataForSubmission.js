function getUpdateReason(edit) {
  const { updatedDefaultPhotoId, updatedPhotoQuality } = edit;

  if (!!updatedDefaultPhotoId && !!updatedPhotoQuality) {
    return 'update photo + quality';
  }

  if (!!updatedPhotoQuality) {
    return 'update quality';
  }

  if (!!updatedDefaultPhotoId) {
    return 'update photo';
  }

  return '';
}

export default function formatEditDataForSubmission(photoEdits, attribute) {
  console.log('photoEdits', photoEdits);
  const formatted = photoEdits.map((edit) => {
    const { listingId, updatedDefaultPhotoId, updatedPhotoQuality } = edit;
    const data = {
      id_listing: listingId,
      listing_category: attribute,
      ...(updatedDefaultPhotoId
        ? { photo_id: updatedDefaultPhotoId }
        : undefined),
      ...(updatedPhotoQuality
        ? { photo_quality: updatedPhotoQuality }
        : undefined),
      update_reason: getUpdateReason(edit),
    };
    return data;
  });

  return JSON.stringify(formatted);
}
