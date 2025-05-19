'use client'

import React, { useEffect } from 'react';

const ConvertKitEmbedForm = () => {
  useEffect(() => {
    // Load the ConvertKit script
    const script = document.createElement('script');
    script.src = "https://f.convertkit.com/ckjs/ck.5.js";
    script.async = true;
    document.body.appendChild(script);
    
    // Load the form-specific script
    const formScript = document.createElement('script');
    formScript.src = "https://hedgepayments.kit.com/ffa594d5e7/index.js";
    formScript.async = true;
    formScript.setAttribute('data-uid', 'ffa594d5e7');
    document.body.appendChild(formScript);

    return () => {
      // Clean up scripts when component unmounts
      if (document.body.contains(script)) document.body.removeChild(script);
      if (document.body.contains(formScript)) document.body.removeChild(formScript);
    };
  }, []);

  return (
    <div className="convertkit-embed-form">
      {/* This div will be populated by the ConvertKit scripts */}
      <script src="https://f.convertkit.com/ckjs/ck.5.js"></script>
      <form
        action="https://app.kit.com/forms/8047084/subscriptions"
        className="seva-form formkit-form"
        method="post"
        data-sv-form="8047084"
        data-uid="ffa594d5e7"
        data-format="modal"
        data-version="5"
        style={{ backgroundColor: 'rgb(255, 255, 255)', borderRadius: '6px' }}
      >
        {/* This will be populated by the ConvertKit script */}
      </form>
    </div>
  );
};

export default ConvertKitEmbedForm; 