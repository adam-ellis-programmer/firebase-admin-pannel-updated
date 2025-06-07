// https://firebase.google.com/docs/functions/get-started?_gl=1*1pfhlss*_up*MQ..*_ga*MTQ4Mjk0NDY5Ny4xNzE4OTI3NDIw*_ga_CW55HF8NVT*MTcxODkzMjExMS4yLjAuMTcxODkzMjExMS4wLjAuMA..&gen=1st
// Control Access with Custom Claims and Security Rules
// admin sdk
// const { getAuth } = require('firebase-admin/auth');
const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp() // Assuming you have your configuration
const auth = admin.auth()
const db = admin.firestore() // Initialize Firestore
// try setting up a funca and just use admin.initializeApp();
// instead of getAuth()

// exports.fetch = require('./func/fetch')

exports.getUser = functions.https.onCall(async (data, context) => {
  try {
    const regUser = await auth.getUserByEmail(data.email)
    console.log(regUser)
    return {
      user: regUser,
      msg: 'success',
    }
  } catch (error) {
    throw new functions.https.HttpsError('unknown', 'please use a valid email address', {
      message: error.message,
      msg: 'something went wrong',
    })
  }
})

exports.deleteUser = functions.https.onCall(async (data, context) => {
  try {
    // Get user by email
    const userRecord = await auth.getUserByEmail(data.email)
    console.log(`Successfully fetched user data: ${userRecord.toJSON()}`)

    // Delete the user by UID
    await auth.deleteUser(userRecord.uid)

    // Return success message
    return { msg: 'success', userData: userRecord }
  } catch (error) {
    console.log('Error fetching user data:', error)

    // Throw the error to be caught by Firebase Functions framework
    throw new functions.https.HttpsError('unknown', 'please enter an email address', {
      message: error.message,
      msg: 'something went wrong',
    })
  }
})

exports.makeNewUserAsAdmin = functions.https.onCall((data, context) => {
  return auth
    .createUser({
      email: data.email,
      emailVerified: false,
      phoneNumber: data.phoneNumber,
      password: data.password,
      displayName: data.name,
      photoURL: data.profilePicture,
      disabled: false,
    })
    .then((userRecord) => {
      auth.setCustomUserClaims(userRecord.uid, {
        auth: {
          admin: false,
          premium: false,
          manager: false,
          sales: false,
        },
      })
      return {
        newUser: userRecord,
        msg: 'user successfully created',
      }
    })
    .catch((error) => {
      console.log('Error creating new user:', error)
      throw new functions.https.HttpsError('unknown', 'please fill out all fields', {
        message: error.message,
        msg: 'something went wrong',
      })
    })
})

exports.updateUserClaims = functions.https.onCall((data, context) => {
  return auth
    .setCustomUserClaims(data.uid, {
      auth: {
        admin: data.admin,
        premium: data.premium,
        manager: data.manager,
        sales: data.sales,
      },
    })
    .then((data) => {
      // Return the received data object
      return { msg: 'user claims updated!', data }
    })
    .catch((error) => {
      throw new functions.https.HttpsError(
        'unknown',
        'please use a valid email address to update',
        { message: error.message, msg: 'something went wrong' }
      )
    })
})

exports.deleteUser = functions.https.onCall(async (data, context) => {
  return auth
    .getUserByEmail(data.email)
    .then((userRecord) => {
      console.log(`Successfully fetched user data: ${userRecord.toJSON()}`)
      return userRecord
    })
    .then((data) => {
      return auth.deleteUser(data.uid)
    })
    .then((data) => {
      return { msg: 'success', userData: data }
    })
    .catch((error) => {
      console.log('Error fetching user data:', error)
      throw new functions.https.HttpsError(
        'unknown',
        'please use a valid email address',
        { message: error.message, msg: 'something went wrong' }
      )
    })
})

exports.updateUserProfile = functions.https.onCall((data, context) => {
  return auth
    .updateUser(data.uid, {
      email: data.email,
      displayName: data.name,
      phoneNumber: data.phone,
      emailVerified: data.emailVerified,
      disabled: data.disabled,
      // password: 'newPassword',
      // photoURL: '',
    })
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log('Successfully updated user', userRecord.toJSON())
      return {
        msg: 'success',
        data: userRecord,
      }
    })
    .catch((error) => {
      console.log('Error updating user:', error)
      throw new functions.https.HttpsError(
        'unknown',
        'please use a valid email address',
        { message: error.message, msg: 'something went wrong' }
      )
    })
})

exports.getAllUsers = functions.https.onCall(async (data, context) => {
  const users = []

  // they wrapped this in a fucntion to specifically
  // call nextPageToken
  const listAllUsers = async (nextPageToken) => {
    try {
      const listUsersResult = await auth.listUsers(1000, nextPageToken)
      listUsersResult.users.forEach((userRecord) => {
        users.push(userRecord.toJSON())
      })
      if (listUsersResult.pageToken) {
        await listAllUsers(listUsersResult.pageToken)
      }
    } catch (error) {
      console.log('Error listing users:', error)
      throw new functions.https.HttpsError('internal', 'Error listing users', error)
    }
  }

  // Start listing users from the beginning, 1000 at a time.
  await listAllUsers()
  return { users }
})

// runs automaticly on user creation
exports.updateUserProfilePicture = functions.https.onCall((data, context) => {
  return auth
    .updateUser(data.uid, {
      photoURL: data.profilePicture,
    })
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log('Successfully updated user', userRecord.toJSON())
    })
    .catch((error) => {
      throw new functions.https.HttpsError('internal', 'Error updating profile', error)
    })
})

// prettier-ignore
exports.upDateProfilePicture = functions.https.onCall((data, context) => {
  console.log('ret data', data);
  return auth
    .getUserByEmail(data.email)
    .then((userRecord) => {
      return auth.updateUser(userRecord.uid, {
        photoURL: data.url,
      }).then(() => {
        return data;
      });
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      // call error.details in the client 
      const errorDetails = { msg: 'something went wrong', status: 'error', originalError: error.toString() };
      throw new functions.https.HttpsError('unknown', 'An error occurred while updating the profile picture', errorDetails);
    });
});

// Ensure Promises are Returned: The auth.updateUser call is now returned to ensure the promise chain continues correctly.
exports.updateUserPassword = functions.https.onCall((data, context) => {
  return auth
    .getUserByEmail(data.email)
    .then((userRecord) => {
      return auth.updateUser(userRecord.uid, {
        password: data.password,
      })
    })
    .then((userRecord) => {
      return {
        data: userRecord,
        msg: 'success',
      }
    })
    .catch((error) => {
      throw new functions.https.HttpsError('internal', 'error changing passwords', error)
    })
})

exports.updateUserPassword = functions.https.onCall((data, context) => {
  return auth
    .getUserByEmail(data.email)
    .then((userRecord) => {
      return auth.updateUser(userRecord.uid, {
        password: data.password,
      })
    })
    .then((userRecord) => {
      return {
        data: userRecord,
        msg: 'success',
      }
    })
    .catch((error) => {
      const errorDetails = {
        msg: 'something went wrong',
        status: 'error',
        originalError: error.toString(),
      }
      throw new functions.https.HttpsError(
        'invalid-argument',
        'please enter a correct email and password',
        errorDetails
      )
    })
})

// =============   TESTING FUNCTIONS =============== //

// prettier-ignore
exports.verify = functions.https.onCall(async (data, context) => {
  return auth.verifyIdToken(data.idToken).then((claims) => {
    console.log(claims)
    console.log('is admin ===>', claims.auth['admin']);
    if (claims.auth.premium === false) {
      throw new functions.https.HttpsError('unauthenticated', 'You are not a premium user'); // Specific error code and message
    } 
    if (claims.auth.manager === false) {
      throw new functions.https.HttpsError('unauthenticated', 'You are not a manager user'); // Specific error code and message
    } 
      
    
    return { msg: 'success' , isAdmin: claims.auth['admin'] }
    

  })
})

// userRecord.customClaims.auth.premium === true

exports.verifyByEmail = functions.https.onCall(async (data, context) => {
  return auth
    .getUserByEmail(data.email)
    .then((userRecord) => {
      if (userRecord.customClaims.auth.premium === true) {
        return auth.createUser({
          email: 'user@example.com',
          emailVerified: false,
          phoneNumber: '+11234567890',
          password: 'secretPassword',
          displayName: 'John Doe',
          photoURL: 'http://www.example.com/12345678/photo.png',
          disabled: false,
        })
      } else {
        throw new functions.https.HttpsError('internal', 'not authorized', error)
      }
    })
    .then((data) => {
      return {
        data,
        msg: 'user created',
      }
    })
    .catch((error) => {
      throw new functions.https.HttpsError(
        'internal',
        'not authorized something went wrong',
        error
      )
    })
})
