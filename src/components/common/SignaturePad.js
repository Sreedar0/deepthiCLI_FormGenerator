import React, { useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Signature from 'react-native-signature-canvas';

const SignaturePad = ({ onOK, value }) => {
  const ref = useRef();

  const handleSignature = (signature) => {
    console.log("Signature captured:", signature ? "Yes" : "No");
    if (signature) {
      onOK(signature);
    }
  };

  const handleClear = () => {
    console.log("Signature cleared");
    onOK(''); // Clear the signature
  };

  const handleEnd = () => {
    console.log("Signature drawing ended - saving automatically");
    // Automatically save when user finishes drawing
    setTimeout(() => {
      ref.current.readSignature();
    }, 100);
  };

  return (
    <View style={styles.container}>
      <Signature
        ref={ref}
        onOK={handleSignature}
        onClear={handleClear}
        onEnd={handleEnd}
        nestedScrollEnabled={Platform.OS === 'android'}
        descriptionText="Sign above - signature saves automatically"
        clearText="Clear Signature"
        confirmText="Save" // We'll hide this with CSS
        webStyle={`
          .m-signature-pad {
            box-shadow: none;
            border: 1px solid #ccc;
            height: 200px;
          }
          .m-signature-pad--footer { 
            display: flex; 
            justify-content: center;
            margin: 10px 20px;
          }
          .m-signature-pad--footer .button-save {
            display: none !important;
          }
          .m-signature-pad--footer .button-clear {
            background-color: #FF3B30;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 14px;
            width: 120px;
          }
        `}
        androidHardwareAccelerationDisabled={false}
        autoClear={false}
        imageType="image/png"
        penColor="black"
        backgroundColor="white"
        dataURL={value} // Pre-populate if value exists
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    height: 280, 
    backgroundColor: '#fff', 
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4
  }
});

export default SignaturePad;