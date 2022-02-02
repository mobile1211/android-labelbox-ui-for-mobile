function getUpdateReason(edit, originalPhotoQualityTier) {
  const { updatedDefaultPhotoId, updatedPhotoQuality } = edit;

  const photoQualityTierChanged =
    !!updatedPhotoQuality && updatedPhotoQuality !== originalPhotoQualityTier;

  if (photoQualityTierChanged && updatedPhotoQuality === 'Unacceptable') {
    return 'remove category';
  }

  if (!!updatedDefaultPhotoId && photoQualityTierChanged) {
    return 'update photo + quality';
  }

  if (photoQualityTierChanged) {
    return 'update quality';
  }

  if (!!updatedDefaultPhotoId) {
    return 'update photo';
  }

  return '';
}

export default function formatEditDataForSubmission(
  photoEdits,
  attribute,
  originalPhotoQualityTier
) {
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
      update_reason: getUpdateReason(edit, originalPhotoQualityTier),
    };
    return data;
  });

  return JSON.stringify(formatted);
}
