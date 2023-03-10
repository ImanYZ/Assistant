import * as functions from "firebase-functions";
import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";

const app = initializeApp();
const db = getFirestore(app);

exports.assistantVotesCreatedListener = functions.firestore
    .document("assistantVotes/{assistantVoteId}")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .onCreate(async (doc) => {
      const batch = db.batch();
      let assistantStatRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
      const assistantStats = await db.collection("assistantStats").get();
      let likes = 0;
      let dislikes = 0;
      if (assistantStats.docs.length) {
        assistantStatRef = db.collection("assistantStats").doc(assistantStats.docs[0].id);
        likes = assistantStats.docs[0].data()?.likes || 0;
        dislikes = assistantStats.docs[0].data()?.dislikes || 0;
      } else {
        assistantStatRef = db.collection("assistantStats").doc();
      }
      const assistantVote = doc.data();
      const vote: null | boolean = typeof assistantVote?.vote === "boolean" ? assistantVote?.vote : null;
      if (vote === true) {
        likes += 1;
      } else if (vote === false) {
        dislikes += 1;
      }

      if (assistantStats.docs.length) {
        batch.update(assistantStatRef, {
          likes,
          dislikes,
        });
      } else {
        batch.set(assistantStatRef, {
          likes,
          dislikes,
        });
      }

      await batch.commit();
    });

exports.assistantVotesUpdatedListener = functions.firestore
    .document("assistantVotes/{assistantVoteId}")
// eslint-disable-next-line @typescript-eslint/no-unused-vars
    .onUpdate(async (change) => {
      const batch = db.batch();
      let assistantStatRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
      const assistantStats = await db.collection("assistantStats").get();
      let likes = 0;
      let dislikes = 0;
      if (assistantStats.docs.length) {
        assistantStatRef = db.collection("assistantStats").doc(assistantStats.docs[0].id);
        likes = assistantStats.docs[0].data()?.likes || 0;
        dislikes = assistantStats.docs[0].data()?.dislikes || 0;
      } else {
        assistantStatRef = db.collection("assistantStats").doc();
      }

      const assistantVote = change.after.data();
      const vote: null | boolean = typeof assistantVote?.vote === "boolean" ? assistantVote?.vote : null;
      if (vote === true) {
        likes += 1;
      } else if (vote === false) {
        dislikes += 1;
      }

      const pAssistantVote = change.before.data();
      const _vote: null | boolean = typeof pAssistantVote?.vote === "boolean" ? pAssistantVote?.vote : null;
      if (_vote === true) {
        likes -= 1;
      } if (_vote === false) {
        dislikes -= 1;
      }

      if (assistantStats.docs.length) {
        batch.update(assistantStatRef, {
          likes,
          dislikes,
        });
      } else {
        batch.set(assistantStatRef, {
          likes,
          dislikes,
        });
      }

      await batch.commit();
    });
