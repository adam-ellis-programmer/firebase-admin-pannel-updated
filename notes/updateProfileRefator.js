const fetchUser = async (email) => {
  try {
    const functions = getFunctions()
    const getUser = httpsCallable(functions, 'getUser')
    const user = await getUser({ email })
    return user.data.user
  } catch (error) {
    throw new Error('Error fetching user: ' + error.message)
  }
}

const uploadImage = async (file, userUID) => {
  try {
    const url = await uploadFileImage(file, userUID)
    return url
  } catch (error) {
    throw new Error('Error uploading image: ' + error.message)
  }
}

const updateProfilePicture = async (email, url) => {
  try {
    const functions = getFunctions()
    const upDateProfilePicture = httpsCallable(functions, 'upDateProfilePicture')
    const result = await upDateProfilePicture({ email, url })
    return result
  } catch (error) {
    throw new Error('Error updating profile picture: ' + error.message)
  }
}

const onSubmit = async (e) => {
  e.preventDefault()
  console.log(email)

  try {
    const user = await fetchUser(email)
    const userUID = user.uid
    const userName = user.displayName
    console.log(userName)

    let url = ''
    if (file) {
      url = await uploadImage(file, userUID)
      console.log('new url', url)
    }

    const result = await updateProfilePicture(email, url)
    console.log(result)
    // Uncomment and update these lines if you want to show a success alert
    // setAlert(true);
    // setAlertSuccess(true);
    // setAlertText('Successfully updated profile image');
    // resetAlertState(3000);
    // resetState();
  } catch (error) {
    console.error(error.message)
    setAlert(true)
    setAlertText(error.message)
    resetAlertState(3000)
  }
}
