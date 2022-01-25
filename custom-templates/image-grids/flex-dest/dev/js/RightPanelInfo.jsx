import React, { useEffect } from 'react';

export default function RightPanelInfo({
  title,
  description,
  location,
  where,
  lat,
  lng,
}) {
  useEffect(() => {
    document.querySelector('div.flex-column.right-side-panel').scrollTo(0, 0);
  }, [lat, lng]);

  // https://www.google.com/maps/search/?api=1&query={lat}%2C{lng}
  // src="https://maps.google.com/maps?q=${lat},${lng}&hl=es&z=14&amp;output=embed"
  // href="https://maps.google.com/maps?q=${lat},${lng};z=14&amp;output=embed"
  return (
    <>
      <div className="listing-info-container">
        <div className="listing-info">
          <b>Title</b>: {title}
        </div>
      </div>

      <div className="listing-info-container">
        <div className="listing-info">
          <b>Description</b>: {description}
        </div>
      </div>

      <div className="listing-info-container">
        <div className="listing-info">
          <b>Location</b>: {location}
        </div>
      </div>

      <div className="listing-info-container">
        <div className="listing-info">
          <b>Where You'll Be</b>: {where}
        </div>
      </div>

      <div className="listing-info-container">
        <div className="listing-info">
          <iframe
            width="450"
            height="450"
            frameBorder="0"
            scrolling="yes"
            marginHeight="0"
            marginWidth="0"
            src={`https://maps.google.com/maps?q=${lat},${lng}&z=14&output=embed`}
          ></iframe>
        </div>
      </div>
    </>
  );
}
