// photoEdits data structure
// [{
//   listingId: 123,
//   updatedDefaultPhotoId: 345,
//   updatedPhotoQuality: 'High',
// }]

export default function convertLabelToPhotoEdit(labels) {
  return labels.map((label) => {
    const { id_listing, photo_id, photo_quality } = label;

    return {
      listingId: id_listing,
      ...(photo_id ? { updatedDefaultPhotoId: photo_id } : undefined),
      ...(photo_quality ? { updatedPhotoQuality: photo_quality } : undefined),
    };
  });
}
