import React from 'react'
import { GetStaticProps } from 'next'
import {
  Container,
  Heading,
  Text,
  Box,
  VStack,
  HStack,
  Icon,
  Badge,
  useColorModeValue,
  Flex
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import Lang from '../lib/utils'
import {
  IoGameController,
  IoSchool,
  IoLaptop,
  IoBusiness,
  IoFitness,
  IoHeart,
  IoAirplane,
  IoTrophy,
  IoCode,
  IoBug,
  IoRocket,
  IoPeople,
  IoHome,
  IoPaw
} from 'react-icons/io5'

const MotionBox = motion(Box)

// Function to get translated timeline data
const getTimelineData = (t: any) => [
  {
    year: 1989,
    icon: IoHeart,
    color: 'pink',
    title: t.events[1989].title,
    description: t.events[1989].description
  },
  {
    year: 1995,
    icon: IoGameController,
    color: 'blue',
    title: t.events[1995].title,
    description: t.events[1995].description
  },
  {
    year: 1997,
    icon: IoGameController,
    color: 'green',
    title: t.events[1997].title,
    description: t.events[1997].description
  },
  {
    year: 2003,
    icon: IoLaptop,
    color: 'purple',
    title: t.events[2003].title,
    description: t.events[2003].description
  },
  {
    year: 2005,
    icon: IoCode,
    color: 'orange',
    title: t.events[2005].title,
    description: t.events[2005].description
  },
  {
    year: 2006,
    icon: IoSchool,
    color: 'cyan',
    title: t.events[2006].title,
    description: t.events[2006].description
  },
  {
    year: 2008,
    icon: IoSchool,
    color: 'teal',
    title: t.events[2008].title,
    description: t.events[2008].description
  },
  {
    year: 2011,
    icon: IoBusiness,
    color: 'red',
    title: t.events[2011].title,
    description: t.events[2011].description
  },
  {
    year: 2012,
    icon: IoSchool,
    color: 'yellow',
    title: t.events[2012].title,
    description: t.events[2012].description
  },
  {
    year: 2013,
    icon: IoBusiness,
    color: 'purple',
    title: t.events[2013].title,
    description: t.events[2013].description
  },
  {
    year: 2014,
    icon: IoFitness,
    color: 'green',
    title: t.events[2014].title,
    description: t.events[2014].description
  },
  {
    year: 2015,
    icon: IoHeart,
    color: 'pink',
    title: t.events[2015].title,
    description: t.events[2015].description
  },
  {
    year: 2016,
    icon: IoFitness,
    color: 'orange',
    title: t.events[2016].title,
    description: t.events[2016].description
  },
  {
    year: 2017,
    icon: IoFitness,
    color: 'red',
    title: t.events[2017].title,
    description: t.events[2017].description
  },
  {
    year: 2018,
    icon: IoAirplane,
    color: 'blue',
    title: t.events[2018].title,
    description: t.events[2018].description
  },
  {
    year: 2019,
    icon: IoTrophy,
    color: 'yellow',
    title: t.events[2019].title,
    description: t.events[2019].description
  },
  {
    year: 2020,
    icon: IoBug,
    color: 'teal',
    title: t.events[2020].title,
    description: t.events[2020].description
  },
  {
    year: 2021,
    icon: IoRocket,
    color: 'purple',
    title: t.events[2021].title,
    description: t.events[2021].description
  },
  {
    year: 2022,
    icon: IoPeople,
    color: 'blue',
    title: t.events[2022].title,
    description: t.events[2022].description
  },
  {
    year: 2023,
    icon: IoAirplane,
    color: 'cyan',
    title: t.events[2023].title,
    description: t.events[2023].description
  },
  {
    year: 2024,
    icon: IoHome,
    color: 'green',
    title: t.events[2024].title,
    description: t.events[2024].description
  },
  {
    year: 2025,
    icon: IoPaw,
    color: 'pink',
    title: t.events[2025].title,
    description: t.events[2025].description
  }
]

interface TimelineProps {
  // Puedes agregar props específicas aquí si las necesitas
}

const Timeline: React.FC<TimelineProps> = () => {
  const t = Lang('timeline')
  const timelineData = getTimelineData(t)

  const glassBg = useColorModeValue(
    'rgba(255, 255, 255, 0.1)',
    'rgba(255, 255, 255, 0.05)'
  )

  const glassBorder = useColorModeValue(
    'rgba(255, 255, 255, 0.2)',
    'rgba(255, 255, 255, 0.1)'
  )

  return (
    <Layout title="Timeline">
      <Container maxW="4xl" py={8}>
        <Section delay={0.1}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            textAlign="center"
            mb={12}
          >
            <Heading
              as="h1"
              size="2xl"
              mb={4}
              bgGradient="linear(to-r, purple.400, blue.400)"
              bgClip="text"
            >
              {t.title}
            </Heading>
            <Text fontSize="lg" color="gray.400" maxW="2xl" mx="auto">
              {t.subtitle}
            </Text>
          </MotionBox>
        </Section>

        <Section delay={0.3}>
          <VStack spacing={8} align="stretch">
            {timelineData.map((item, index) => (
              <MotionBox
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Flex
                  direction={{
                    base: 'column',
                    md: index % 2 === 0 ? 'row' : 'row-reverse'
                  }}
                  align="center"
                  gap={8}
                  position="relative"
                >
                  {/* Timeline line */}
                  <Box
                    position="absolute"
                    left="50%"
                    top="0"
                    bottom="0"
                    width="2px"
                    bg="purple.300"
                    display={{ base: 'none', md: 'block' }}
                    transform="translateX(-50%)"
                    zIndex={0}
                  />

                  {/* Year badge */}
                  <Box
                    position={{ base: 'static', md: 'absolute' }}
                    left="50%"
                    top="20px"
                    transform={{ base: 'none', md: 'translateX(-50%)' }}
                    zIndex={2}
                    mb={{ base: 4, md: 0 }}
                  >
                    <Badge
                      colorScheme={item.color}
                      fontSize="lg"
                      px={4}
                      py={2}
                      borderRadius="full"
                      bg={glassBg}
                      backdropFilter="blur(20px)"
                      border="1px solid"
                      borderColor={glassBorder}
                      boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
                    >
                      {item.year}
                    </Badge>
                  </Box>

                  {/* Content card */}
                  <Box
                    flex={1}
                    maxW={{ base: 'full', md: 'calc(50% - 60px)' }}
                    ml={{ base: 0, md: index % 2 === 0 ? 0 : 'auto' }}
                  >
                    <MotionBox
                      bg={glassBg}
                      backdropFilter="blur(20px)"
                      border="1px solid"
                      borderColor={glassBorder}
                      borderRadius="xl"
                      p={6}
                      boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
                      _hover={{
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.5)'
                      }}
                      transition="all 0.3s ease"
                    >
                      <HStack spacing={3} mb={3}>
                        <Icon
                          as={item.icon}
                          boxSize={6}
                          color={`${item.color}.400`}
                        />
                        <Heading size="md" color="gray.100">
                          {item.title}
                        </Heading>
                      </HStack>
                      <Text
                        color="gray.300"
                        lineHeight="tall"
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      />
                    </MotionBox>
                  </Box>
                </Flex>
              </MotionBox>
            ))}
          </VStack>
        </Section>

        <Section delay={0.8}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            textAlign="center"
            mt={16}
            p={8}
            bg={glassBg}
            backdropFilter="blur(20px)"
            border="1px solid"
            borderColor={glassBorder}
            borderRadius="xl"
            boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
          >
            <Heading size="lg" mb={4} color="purple.300">
              {t.whatNext} 🚀
            </Heading>
            <Text color="gray.300" fontSize="lg">
              {t.continues}
            </Text>
          </MotionBox>
        </Section>
      </Container>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {}
  }
}

export default Timeline
