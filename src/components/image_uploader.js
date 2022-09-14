import {
    AspectRatio,
    Box,
    BoxProps,
    Container,
    forwardRef,
    Heading,
    Input,
    Stack,
    Text
  } from "@chakra-ui/react";
  import axios from 'axios';
  import { motion, useAnimation } from "framer-motion";

  import { useState,useRef } from "react"
  const first = {
    rest: {
      rotate: "-15deg",
      scale: 0.95,
      x: "-50%",
      filter: "grayscale(80%)",
      transition: {
        duration: 0.5,
        type: "tween",
        ease: "easeIn"
      }
    },
    hover: {
      x: "-70%",
      scale: 1.1,
      rotate: "-20deg",
      filter: "grayscale(0%)",
      transition: {
        duration: 0.4,
        type: "tween",
        ease: "easeOut"
      }
    }
  };
  
  const second = {
    rest: {
      rotate: "15deg",
      scale: 0.95,
      x: "50%",
      filter: "grayscale(80%)",
      transition: {
        duration: 0.5,
        type: "tween",
        ease: "easeIn"
      }
    },
    hover: {
      x: "70%",
      scale: 1.1,
      rotate: "20deg",
      filter: "grayscale(0%)",
      transition: {
        duration: 0.4,
        type: "tween",
        ease: "easeOut"
      }
    }
  };
  
  const third = {
    rest: {
      scale: 1.1,
      filter: "grayscale(80%)",
      transition: {
        duration: 0.5,
        type: "tween",
        ease: "easeIn"
      }
    },
    hover: {
      scale: 1.3,
      filter: "grayscale(0%)",
      transition: {
        duration: 0.4,
        type: "tween",
        ease: "easeOut"
      }
    }
  };

  const PreviewImage = (props, ref) => {
    return (
      <Box
        bg="white"
        top="0"
        height="100%"
        width="100%"
        position="absolute"
        borderWidth="1px"
        borderStyle="solid"
        rounded="sm"
        borderColor="gray.400"
        as={motion.div}
        backgroundSize="cover"
        backgroundRepeat="no-repeat"
        backgroundPosition="center"
        backgroundImage={`url("https://images.unsplash.com/photo-1559563362-c667ba5f5480?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60")`}
        {...props}
        ref={ref}
      />
    );
  }

  function ImageUpload () {
    const controls = useAnimation();
    const startAnimation = () => controls.start("hover");
    const stopAnimation = () => controls.stop();
    const [selectedFile,setState]= useState([]);
    const [className, setClass] = useState('None');
    const [accuracy, setAccuracy] = useState('0%')
    const onFileChange = async (e) => {
      setState(e.target.files[0])
      console.log(e.target.files[0])
      const formData = new FormData();
      formData.append(
        "file",
        selectedFile,
        selectedFile.name
      );
      // const requestOptions ={
      //   method: 'POST',
      //   body: formData
      // };
      try{ 
        const resp = await axios.post("http://127.0.0.1:8000/prediction/", formData)
        setClass(resp.data.class)
        setAccuracy(resp.data.confidence)
        console.log(resp.data.class)
        console.log(resp.data)
    }
      catch(err){
        console.error(err)
      }
    };

    return (
      <Container my="12" align='middle' padding='10'>
        <Text fontSize='20px' width="64" align='center' fontWeight='bold'>
         Flower Recognizer App
        </Text>
        <AspectRatio width="64" ratio={1}>
          <Box
            borderColor="gray.300"
            borderStyle="dashed"
            borderWidth="2px"
            rounded="md"
            shadow="sm"
            role="group"
            transition="all 150ms ease-in-out"
            _hover={{
              shadow: "md"
            }}
            as={motion.div}
            initial="rest"
            animate="rest"
            whileHover="hover"
          >
            <Box position="relative" height="100%" width="100%">
              <Box
                position="absolute"
                top="0"
                left="0"
                height="100%"
                width="100%"
                display="flex"
                flexDirection="column"
              >
                <Stack
                  height="100%"
                  width="100%"
                  display="flex"
                  alignItems="center"
                  justify="center"
                  spacing="4"
                >
                  <Box height="16" width="12" position="relative">
                    <PreviewImage
                      variants={first}
                      backgroundImage="url('https://i.guim.co.uk/img/media/aa36897836981a77792b1a628219ccd8ac9bdabb/0_485_3367_4288/master/3367.jpg?width=620&quality=85&auto=format&fit=max&s=58e3df3bbf8d8f272ed709e631f7377b')"
                    />
                    <PreviewImage
                      variants={second}
                      backgroundImage="url('https://images.unsplash.com/photo-1559563362-c667ba5f5480?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60')"
                    />
                    <PreviewImage
                      variants={third}
                      backgroundImage={"url('https://images.unsplash.com/photo-1518943701174-17e4aff936d4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80')"}
                    />
                  </Box>
                  <Stack p="8" textAlign="center" spacing="1">
                    <Heading fontSize="lg" color="gray.700" fontWeight="bold">
                      Drop images here
                    </Heading>
                    <Text fontWeight="light">or click to upload</Text>
                  </Stack>
                </Stack>
              </Box>
              <Input 
                type="file"
                height="100%"
                width="100%"
                position="absolute"
                top="0"
                left="0"
                opacity="0"
                aria-hidden="true"
                accept="image/*"
                onDragEnter={startAnimation}
                onDragLeave={stopAnimation}
                onChange={onFileChange}
                onSelect={onFileChange}
                onDrop={onFileChange}
              />
            </Box>
          </Box>
        </AspectRatio>
        <Text>Class: {className}, Accuracy: {accuracy}</Text>
      </Container>
    );
  }
  export default ImageUpload;