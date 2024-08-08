import React from 'react'
import Navbar from '../components/Navbar'
import PelabuhanForm from '../components/PelabuhanForm'
import Footer from '../components/Footer'
import { Box, Flex } from '@chakra-ui/react'

function Pelabuhan() {
  return (
    <>
<Navbar/>
<Flex p={10}>
<PelabuhanForm/>
</Flex>
<Footer/>
    </>
  )
}

export default Pelabuhan