'use client';
import Link from 'next/link';
import React from 'react';
import { useState } from "react";

interface FormProps {
  setOverlayVisible: (visible: boolean) => void; // Define the prop type
}

const Form: React.FC<FormProps> = ({ setOverlayVisible }) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic here

    // Optionally hide the overlay after submission
    setOverlayVisible(false);
  };
  return (
    
    <>

    
    <div id="overlay" onClick={handleSubmit}>
<div id="text">What Game Do You Want To Play</div>
</div>


</>
      );
    };
    
    export default Form;
    