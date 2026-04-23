import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const LogoSmall = ({ style }) => {
  return (
    <Image
      source={require('../../assets/logo.png')}
      style={[styles.logo, style]}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 32,
    height: 32,
  },
});

export default LogoSmall;
