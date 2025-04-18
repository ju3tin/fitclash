export default {
  // ... other configurations ...
  resolve: {
    fallback: {
      dns: false, // Disable dns module
      fs: false, // Disable fs module
      net: false, // Disable net module
      tls: false, // Disable tls module
    },
  },
};
