import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const FirebaseContext = React.createContext();

export const FirebaseProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [starredPoll, setStarredPoll] = useState([]);
  const [polls, setPolls] = useState([]);
  const [myPolls, setMyPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth().onAuthStateChanged(setUser);
  }, []);

  useEffect(() => {
    if (user !== null) {
      const sub = firestore()
        .collection('polls')
        .where('privacy', '==', 'Public')
        .orderBy('createdAt', 'desc')
        .onSnapshot({
          error: e => console.log(e),
          next: querySnapshot => {
            const polls = [];
            querySnapshot.forEach(snapshot => {
              polls.push({
                ...snapshot.data(),
                id: snapshot.id,
              });
            });

            setPolls(polls);
            setLoading(false);
          },
        });

      return () => sub();
    }
  }, [user]);

  useEffect(() => {
    if (user !== null) {
      const sub = firestore()
        .collection('starred')
        .doc(user.uid)
        .onSnapshot(querySnapshot => {
          if (querySnapshot.exists) {
            const snap = querySnapshot.data();
            setStarredPoll(snap.starredPoll);
          }
        });

      return () => sub();
    }
  }, [user]);

  useEffect(() => {
    if (user !== null) {
      const sub = firestore()
        .collection('polls')
        .where('createdBy', '==', user.uid)
        .orderBy('createdAt', 'desc')
        .onSnapshot({
          error: er => console.log(er),
          next: querySnapshot => {
            const polls = [];

            querySnapshot.forEach(snapshot => {
              polls.push({
                ...snapshot.data(),
                id: snapshot.id,
              });
            });

            setMyPolls(polls);
          },
        });

      return () => sub();
    }
  }, [user]);

  return (
    <FirebaseContext.Provider
      value={{user, polls, loading, starredPoll, myPolls}}>
      {children}
    </FirebaseContext.Provider>
  );
};
