import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase.config'

export async function getAllUsers(collectionName, params) {
  const users = []
  const q = query(collection(db, 'cities'), where('name', '==', 'lisa'))

  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((doc) => {
    users.push(doc.data())
    console.log(doc.id, ' => ', doc.data())
  })

  return users
}
let manager
let region
const qManager = query(
  collection(db, 'users'),
  where('reports-to', '==', manager),
  where('region', '===', region),
  where('region', '===', region),

  where('height', '>', 60),
  where('height', '<', 70),
  where('age', '<', 70)
)
