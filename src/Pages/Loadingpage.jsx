import React from "react";
import { Box, Flex, VStack } from "@chakra-ui/react";
import { ProgressCircle } from "@chakra-ui/react";
import { useContext } from "react";
import { ThemeContext } from "../components/Theme/ThemeContext";

const LoadingPage = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div style={{ backgroundColor: theme.surface }}>
      <Box>
        <Flex height="100vh" alignItems="center" justifyContent="center">
          <ProgressCircle.Root
            value={null}
            size="lg"
            colorPalette="orange"
            variant="soft"
          >
            <VStack>
              <ProgressCircle.Circle css={{ "--thickness": "2px" }}>
                <ProgressCircle.Track />
                <ProgressCircle.Range />
              </ProgressCircle.Circle>
              <ProgressCircle.Label color="orange.solid">
                Carregando...
              </ProgressCircle.Label>
            </VStack>
          </ProgressCircle.Root>
        </Flex>
      </Box>
    </div>
  );
};

export default LoadingPage;
