import React, { useState, useRef } from 'react';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';

export default function ImageInput({ valueUpdated }) {
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const validateFile = (file) => {
    return file && (file.type === 'image/jpeg' || file.type === 'image/png');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (validateFile(file)) {
      setError('');
      readAndConvertToBase64(file, (base64) => {
        valueUpdated(base64); // Pass the complete Data URL to the parent component
      });
    } else {
      setError('Please upload a valid JPEG or PNG image.');
      setImage(null);
    }
  };

  const readAndConvertToBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result); // Set image URL for preview
      callback(reader.result); // Invoke callback with the full Data URL
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (validateFile(file)) {
      setError('');
      readAndConvertToBase64(file, (base64) => {
        valueUpdated(base64); // Pass the complete Data URL to the parent component
      });
    } else {
      setError('Please upload a valid JPEG or PNG image.');
      setImage(null);
    }
  };

  return (
    <Stack spacing={1.5} sx={{ minWidth: 300 }}>
      <Input
        type="file"
        accept=".jpg,.jpeg,.png"
        inputRef={inputRef}
        onChange={handleImageChange}
      />
      <div
        style={{
          border: '2px dashed gray',
          padding: '10px',
          textAlign: 'center',
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        Drag and drop an image here
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {image && <img src={image} alt="Uploaded preview" width="200" />}
    </Stack>
  );
}