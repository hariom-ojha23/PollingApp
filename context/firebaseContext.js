import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const FirebaseContext = React.createContext();

export const FirebaseProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [starredPoll, setStarredPoll] = useState([]);

  useEffect(() => {
    auth().onAuthStateChanged(setUser);
  }, []);

  useEffect(() => {
    if (user !== null) {
      firestore()
        .collection('starred')
        .doc(user.uid)
        .onSnapshot(querySnapshot => {
          if (querySnapshot.exists) {
            const snap = querySnapshot.data();
            setStarredPoll(snap.starredPoll);
          }
        });
    }
  }, [user]);

  return (
    <FirebaseContext.Provider value={{user, starredPoll}}>
      {children}
    </FirebaseContext.Provider>
  );
};
