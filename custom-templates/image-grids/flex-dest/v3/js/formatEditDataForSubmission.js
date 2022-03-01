function getUpdateReason(edit, originalPhotoQualityTier) {
  const { defaultPhotoId, photoQualityTier } = edit;

  const photoQualityTierChanged =
    !!photoQualityTier && photoQualityTier !== originalPhotoQualityTier;

  if (photoQualityTierChanged && photoQualityTier === 'Remove') {
    return 'remove category';
  }

  if (!!defaultPhotoId && photoQualityTierChanged) {
    return 'update photo + quality';
  }

  if (photoQualityTierChanged) {
    return 'update quality';
  }

  if (!!defaultPhotoId) {
    return 'update photo';
  }

  return '';
}

export default function formatEditDataForSubmission(
  photoEdits,
  attribute,
  originalPhotoQualityTier
) {
  const formatted = photoEdits.map((edit) => {
    const { listingId, defaultPhotoId, photoQualityTier } = edit;
    const data = {
      id_listing: listingId,
      listing_category: attribute,
      ...(defaultPhotoId ? { photo_id: defaultPhotoId } : undefined),
      ...(photoQualityTier ? { photo_quality: photoQualityTier } : undefined),
      update_reason: getUpdateReason(edit, originalPhotoQualityTier),
    };
    return data;
  });

  return JSON.stringify(formatted);
}
