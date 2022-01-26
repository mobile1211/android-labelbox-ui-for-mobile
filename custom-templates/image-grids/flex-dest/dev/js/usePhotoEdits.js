import { useState } from 'react';

export default function usePhotoEdits() {
  // photoEdits data structure
  // [{
  //   listingId: 123,
  //   updatedDefaultPhotoId: 345,
  //   updatedPhotoQuality: 'High',
  // }]
  const [photoEdits, setPhotoEdits] = useState([]);

  return {
    photoEdits,
    setPhotoEdits,
  };
}
