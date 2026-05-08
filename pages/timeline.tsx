import React, { useState } from 'react'
import { GetStaticProps } from 'next'
import {
  Container,
  Heading,
  Text,
  Box,
  VStack,
  HStack,
  Icon,
  Flex
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { useTranslations } from 'next-intl'
import { useColorModeValue } from '../lib/color-mode'
import { accentGradient, gradientTextStyle } from '../lib/brand'
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
const getTimelineData = (t: ReturnType<typeof useTranslations<'timeline'>>) => [
  {
    year: 1989,
    icon: IoHeart,
    color: 'pink',
    title: t('events.1989.title'),
    description: t('events.1989.description')
  },
  {
    year: 1995,
    icon: IoGameController,
    color: 'blue',
    title: t('events.1995.title'),
    description: t('events.1995.description')
  },
  {
    year: 1997,
    icon: IoGameController,
    color: 'green',
    title: t('events.1997.title'),
    description: t('events.1997.description')
  },
  {
    year: 2003,
    icon: IoLaptop,
    color: 'purple',
    title: t('events.2003.title'),
    description: t('events.2003.description')
  },
  {
    year: 2005,
    icon: IoCode,
    color: 'orange',
    title: t('events.2005.title'),
    description: t('events.2005.description')
  },
  {
    year: 2006,
    icon: IoSchool,
    color: 'cyan',
    title: t('events.2006.title'),
    description: t('events.2006.description')
  },
  {
    year: 2008,
    icon: IoSchool,
    color: 'teal',
    title: t('events.2008.title'),
    description: t('events.2008.description')
  },
  {
    year: 2011,
    icon: IoBusiness,
    color: 'red',
    title: t('events.2011.title'),
    description: t('events.2011.description')
  },
  {
    year: 2012,
    icon: IoSchool,
    color: 'yellow',
    title: t('events.2012.title'),
    description: t('events.2012.description')
  },
  {
    year: 2013,
    icon: IoBusiness,
    color: 'purple',
    title: t('events.2013.title'),
    description: t('events.2013.description')
  },
  {
    year: 2014,
    icon: IoFitness,
    color: 'green',
    title: t('events.2014.title'),
    description: t('events.2014.description')
  },
  {
    year: 2015,
    icon: IoHeart,
    color: 'pink',
    title: t('events.2015.title'),
    description: t('events.2015.description')
  },
  {
    year: 2016,
    icon: IoFitness,
    color: 'orange',
    title: t('events.2016.title'),
    description: t('events.2016.description')
  },
  {
    year: 2017,
    icon: IoFitness,
    color: 'red',
    title: t('events.2017.title'),
    description: t('events.2017.description')
  },
  {
    year: 2018,
    icon: IoAirplane,
    color: 'blue',
    title: t('events.2018.title'),
    description: t('events.2018.description')
  },
  {
    year: 2019,
    icon: IoTrophy,
    color: 'yellow',
    title: t('events.2019.title'),
    description: t('events.2019.description')
  },
  {
    year: 2020,
    icon: IoBug,
    color: 'teal',
    title: t('events.2020.title'),
    description: t('events.2020.description')
  },
  {
    year: 2021,
    icon: IoRocket,
    color: 'purple',
    title: t('events.2021.title'),
    description: t('events.2021.description')
  },
  {
    year: 2022,
    icon: IoPeople,
    color: 'blue',
    title: t('events.2022.title'),
    description: t('events.2022.description')
  },
  {
    year: 2023,
    icon: IoAirplane,
    color: 'cyan',
    title: t('events.2023.title'),
    description: t('events.2023.description')
  },
  {
    year: 2024,
    icon: IoHome,
    color: 'green',
    title: t('events.2024.title'),
    description: t('events.2024.description')
  },
  {
    year: 2025,
    icon: IoPaw,
    color: 'pink',
    title: t('events.2025.title'),
    description: t('events.2025.description')
  }
]

interface TimelineProps {
  // Puedes agregar props específicas aquí si las necesitas
}

const Timeline: React.FC<TimelineProps> = () => {
  const t = useTranslations('timeline')
  const timelineData = getTimelineData(t)
  const [expanded, setExpanded] = useState<number | null>(null)

  const toggle = (year: number) =>
    setExpanded(prev => (prev === year ? null : year))

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
            >
              <span style={{ background: accentGradient, ...gradientTextStyle }}>
                {t('title')}
              </span>
            </Heading>
            <Text fontSize="lg" color="gray.400" maxW="2xl" mx="auto">
              {t('subtitle')}
            </Text>
          </MotionBox>
        </Section>

        <Section delay={0.3}>
          <VStack gap={0} align="stretch">
            {timelineData.map((item, index) => {
              const plainText = item.description.replace(/<[^>]*>/g, '')
              const preview = plainText.length > 90 ? plainText.slice(0, 90) + '…' : plainText
              const isExpanded = expanded === item.year

              return (
                <MotionBox
                  key={item.year}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.04 * index }}
                >
                  <Flex gap={0} position="relative" align="flex-start" minW={0} w="full" overflow="hidden">
                    {/* Left: year label */}
                    <Box
                      w="52px"
                      flexShrink={0}
                      textAlign="right"
                      pr={3}
                      pt="15px"
                    >
                      <Text
                        fontSize="11px"
                        fontWeight="bold"
                        color={`${item.color}.400`}
                        fontFamily="mono"
                        lineHeight="1"
                        opacity={isExpanded ? 1 : 0.7}
                        transition="opacity 0.2s"
                      >
                        {item.year}
                      </Text>
                    </Box>

                    {/* Center: dot + vertical line */}
                    <Flex direction="column" align="center" flexShrink={0} w="20px">
                      <Box w="2px" h={index === 0 ? '16px' : '0'} bg="rgba(139,92,246,0.3)" />
                      <Box
                        w="14px"
                        h="14px"
                        borderRadius="full"
                        bg={`${item.color}.500`}
                        border="2px solid"
                        borderColor={isExpanded ? `${item.color}.300` : `${item.color}.700`}
                        boxShadow={isExpanded
                          ? `0 0 14px currentColor, 0 0 4px currentColor`
                          : `0 0 6px rgba(0,0,0,0.4)`}
                        flexShrink={0}
                        transition="all 0.25s ease"
                      />
                      {index < timelineData.length - 1 && (
                        <Box flex={1} w="2px" bg="rgba(139,92,246,0.25)" minH="24px" />
                      )}
                    </Flex>

                    {/* Right: card */}
                    <Box flex={1} minW={0} pb={2} pl={3}>
                      <Box
                        bg={isExpanded ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.06)'}
                        border="1px solid"
                        borderColor={isExpanded ? `${item.color}.500` : 'rgba(255,255,255,0.12)'}
                        borderLeftWidth="3px"
                        borderLeftColor={`${item.color}.500`}
                        borderRadius="lg"
                        overflow="hidden"
                        cursor="pointer"
                        onClick={() => toggle(item.year)}
                        transition="all 0.2s ease"
                        _hover={{
                          bg: 'rgba(255,255,255,0.06)',
                          borderColor: `${item.color}.400`,
                          transform: 'translateX(2px)',
                        }}
                      >
                        <HStack px={3} py={3} gap={3} justify="space-between" align="flex-start">
                          <HStack gap={3} align="flex-start" flex={1} minW={0}>
                            <Box
                              bg={`${item.color}.900`}
                              border="1px solid"
                              borderColor={`${item.color}.700`}
                              p="6px"
                              borderRadius="md"
                              flexShrink={0}
                            >
                              <Icon as={item.icon} boxSize={4} color={`${item.color}.400`} />
                            </Box>
                            <Box flex={1} minW={0}>
                              <Text fontWeight="semibold" fontSize="sm" color="gray.100" lineHeight="short" mb={0.5}>
                                {item.title}
                              </Text>
                              {!isExpanded && (
                                <Text
                                  fontSize="xs"
                                  color="gray.600"
                                  lineHeight="short"
                                  style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                                >
                                  {preview}
                                </Text>
                              )}
                            </Box>
                          </HStack>
                          <Text
                            fontSize="10px"
                            color={isExpanded ? `${item.color}.400` : 'gray.600'}
                            flexShrink={0}
                            transition="transform 0.2s, color 0.2s"
                            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                            mt="2px"
                          >
                            ▾
                          </Text>
                        </HStack>
                        {isExpanded && (
                          <Box px={3} pb={4} pt={0}>
                            <Box h="1px" bg={`${item.color}.800`} mb={3} mx={0} opacity={0.6} />
                            <Text
                              color="gray.300"
                              lineHeight="tall"
                              fontSize="sm"
                              dangerouslySetInnerHTML={{ __html: item.description }}
                            />
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Flex>
                </MotionBox>
              )
            })}
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
              {t('whatNext')} 🚀
            </Heading>
            <Text color="gray.300" fontSize="lg">
              {t('continues')}
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
