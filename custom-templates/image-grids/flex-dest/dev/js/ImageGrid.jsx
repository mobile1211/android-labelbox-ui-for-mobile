import React from 'react';
import DefaultImage from './DefaultImage';

export default function ImageGrid({
  images,
  onClickImage,
  photoEdits,
  selectedImageIdx,
}) {
  return (
    <div className="photo-grid">
      {images.map((imgObj, idx) => {
        const isEdited = photoEdits.find(
          (edit) => edit.listingId === imgObj.listingId
        );

        return (
          <DefaultImage
            imgObj={imgObj}
            idx={idx}
            isEdited={isEdited}
            isSelected={selectedImageIdx === idx}
            key={imgObj.photoId}
            onClickImage={(photoIdx) => onClickImage(photoIdx)}
          />
        );
      })}
    </div>
  );
}
