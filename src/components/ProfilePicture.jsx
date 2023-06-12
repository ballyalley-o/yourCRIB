import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { getAuth } from 'firebase/auth'

const ProfilePicture = () => {
  const auth = getAuth()
  const [imageUrl, setImageUrl] = useState('')

  const user = auth.currentUser

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `https://robohash.org/${Math.random()}.png`
      )
      setImageUrl(response.request.responseURL)

      if (user) {
        const response = await axios.get(`https://robohash.org/${user.uid}.png`)
        setImageUrl(response.request.responseURL)
      } else {
        const response = await axios.get(
          `https://robohash.org/${Math.random()}.png`
        )
        setImageUrl(response.request.responseURL)
      }
    }
    fetchData()
  }, [user])

  return (
    <img
      src={imageUrl}
      className='rounded-xl border-white'
      alt='yourCrib ai_gen_image'
    />
  )
}

export default ProfilePicture
