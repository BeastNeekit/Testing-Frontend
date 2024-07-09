import React, { useState } from "react";
import {
  Box,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  Flex,
  HStack,
  IconButton,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Link, NavLink } from "react-router-dom";
import '../css/header.css';

const avatars = [
  { id: 1, src: '/assets/avatars/rashmi.jpg', alt: 'Shop Owner 2', name: 'Rashmi' },
  { id: 2, src: '/assets/avatars/neekit.jpg', alt: 'Shop Owner 1', name: 'Neekit', hasCrown: true },
  { id: 3, src: '/assets/default-avatar.jpg', alt: 'Shop Owner 3', name: 'Shop Owner 3' },
  { id: 4, src: '/assets/default-avatar.jpg', alt: 'Shop Owner 4', name: 'Shop Owner 4' }
];

const NavbarSignUp = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const [hoveredAvatar, setHoveredAvatar] = useState(null);

  const handleMouseEnter = (id) => {
    setHoveredAvatar(id);
  };

  const handleMouseLeave = () => {
    setHoveredAvatar(null);
  };

  return (
      <Box>
        <Flex
            w="100%"
            align="center"
            justify="space-between"
            border={"1px solid #1f2a37"}
            bgColor={"#3c3f40"}
            color={"rgb(235, 235, 235)"}
        >
          <Link to={"/"}>
            <div className="logo-placeholder">
              <img src="/assets/logo.png" alt="Logo" className="logo-image" />
            </div>
          </Link>

          <div className="avatar-container">
            {avatars.map((avatar) => (
                <div
                    key={avatar.id}
                    className="avatar-wrapper"
                    onMouseEnter={() => handleMouseEnter(avatar.id)}
                    onMouseLeave={handleMouseLeave}
                >
                  <img src={avatar.src} alt={avatar.alt} className="avatar" />
                  {hoveredAvatar === avatar.id && (
                      <div className="tooltip">
                        {avatar.hasCrown && <span className="crown-icon">👑</span>}
                        {avatar.name}
                      </div>
                  )}
                </div>
            ))}
          </div>
          <Box marginRight={"1%"}>
            <IconButton
                aria-label="Open menu"
                display={{ base: "block", md: "none" }}
                onClick={onOpen}
                icon={<HamburgerIcon margin={"auto"} />}
                ref={btnRef}
                color={"black"}
            />
          </Box>
          <HStack
              as="nav"
              spacing={8}
              display={{ base: "none", md: "flex" }}
              justifyContent="flex-end"
              paddingRight={"10"}
          >
            <Link to={"/"}>
              <Text
                  _hover={{
                    color: "#ff6733",
                  }}
                  fontSize={"1.2rem"}
                  fontWeight={"semibold"}
              >
                Home
              </Text>
            </Link>

            <Link to={"/login"}>
              <Text
                  _hover={{
                    color: "#ff6733",
                  }}
                  fontSize={"1.2rem"}
                  fontWeight={"semibold"}
              >
                LogIn
              </Text>
            </Link>

            <NavLink to={"/rate"}>
              <Text
                  _hover={{
                    color: "#ff6733",
                  }}
                  fontSize={"1.2rem"}
                  fontWeight={"semibold"}
              >
                मूल्या
              </Text>
            </NavLink>

            <Link to={"/add"}>
              <Text
                  _hover={{
                    color: "#ff6733",
                  }}
                  fontSize={"1.2rem"}
                  fontWeight={"semibold"}
              >
                AddDetail
              </Text>
            </Link>

            <Link to={"/statement"}>
              <Text
                  _hover={{
                    color: "#ff6733",
                  }}
                  fontSize={"1.2rem"}
                  fontWeight={"semibold"}
              >
                Statement
              </Text>
            </Link>
          </HStack>
        </Flex>
        {isOpen && (
            <Drawer isOpen={isOpen} placement="top" onClose={onClose} finalFocusRef={btnRef}>
              <DrawerContent border={"1px solid #1f2a37"} bgColor={"#1f2a37"} color={"rgb(235, 235, 235)"}>
                <DrawerCloseButton />
                <VStack m={8} align={"stretch"} spacing={8}>
                  <Link to={"/"} onClick={onClose}>
                    <Text
                        _hover={{
                          color: "#ff6733",
                        }}
                        fontSize={"1.2rem"}
                        fontWeight={"semibold"}
                    >
                      Home
                    </Text>
                  </Link>

                  <Link to={"/login"} onClick={onClose}>
                    <Text
                        _hover={{
                          color: "#ff6733",
                        }}
                        fontSize={"1.2rem"}
                        fontWeight={"semibold"}
                    >
                      LogIn
                    </Text>
                  </Link>

                  <NavLink to={"/rate"} onClick={onClose}>
                    <Text
                        _hover={{
                          color: "#ff6733",
                        }}
                        fontSize={"1.2rem"}
                        fontWeight={"semibold"}
                    >
                      मूल्या
                    </Text>
                  </NavLink>

                  <Link to={"/add"} onClick={onClose}>
                    <Text
                        _hover={{
                          color: "#ff6733",
                        }}
                        fontSize={"1.2rem"}
                        fontWeight={"semibold"}
                    >
                      Add Detail
                    </Text>
                  </Link>

                  <Link to={"/statement"} onClick={onClose}>
                    <Text
                        _hover={{
                          color: "#ff6733",
                        }}
                        fontSize={"1.2rem"}
                        fontWeight={"semibold"}
                    >
                      Statement
                    </Text>
                  </Link>
                </VStack>
              </DrawerContent>
            </Drawer>
        )}
      </Box>
  );
};

export default NavbarSignUp;
