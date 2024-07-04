import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      Orange: "#ff5733",
      Green: "#33431f",
      Yellow: "#ffcc00",
      Red: "#ff3333",
      BoxBase: "#90a4c2",
    },
  },
   components: {
    Input: {
      // Customize input component
      defaultProps: {
        focusBorderColor: "teal.500",
      },
    },
    
  },

});

export default theme;
