export const fetchUserFemale = async () => {
  const res = await fetch('https://randomuser.me/api/?gender=female')
  const data = await res.json()
  console.log(data.results[0].picture.medium)
  return data.results[0].picture.medium
}

// fetchUserFemale()


// 
const getStorageItem = (item) => {
  let storageItem = localStorage.getItem(item)
  if (storageItem) {
    storageItem = JSON.parse(localStorage.getItem(item))
  } else {
    // if item is not in local storage
    storageItem = []
  }

  
  return storageItem
}

// this is for  a one time store setup where an array of obj are looppd in 
const setStorageItem = (name, item) => {
  localStorage.setItem(name, JSON.stringify(item))
}

const defaultProfileURL = ''

export { getStorageItem, setStorageItem, defaultProfileURL }
