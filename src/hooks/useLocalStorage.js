import { useState } from 'react'

const useLocalStorage = (key, initialValue) => {
  const [localStorageValue, setlocalStorageValue] = useState()

  const setValue = (value) => {
    console.log(value)
  }
  return [localStorageValue, setValue]
}

export default useLocalStorage
