import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import "@fontsource/inter";
import "@fontsource/inter/800.css";

const HeroSection = () => {
  const navigate = useNavigate()
  return (
    <div>
      <Flex flexWrap={"wrap"} gap={["100","200", "300" ]}  p={100}>
        <Box fontFamily={"inter"} >
          <Box fontWeight="800" fontSize={"50"} >
          <Box
            as="span"
            bgGradient="linear-gradient(147deg, #73DFE7 6.95%, #0063F7 93.05%), linear-gradient(0deg, #FFFFFF, #FFFFFF)"
            backgroundClip="text"
            WebkitBackgroundClip="text"
            color="transparent"
          >
            Khata ShopeFI
          </Box>{" "}
          Get <Text> Your Yudhro </Text>
          </Box>
           <Button onClick={()=>navigate("/login")}  size={"2xl"} fontSize={"larger"} className='button-50' mt={5} >  Get Started</Button>
        </Box>
        
      <Box>
        <Box
          transform={"skew(10deg)"}
          transition={"all 2s ease-in-out"}
          // border={"1px solid red"}
          
        >
        </Box>
      </Box>
      </Flex>
     
    </div>
  );
};

export default HeroSection;
