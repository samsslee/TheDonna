import { json } from '@sveltejs/kit';
import { db } from '../../../lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { makeEmbedding } from '../makeEmbedding';

export async function POST({ request }) {
    const { text } = await request.json();

    //there absolutely needs to be error handling here
    const embeddings = await makeEmbedding(text);

    const writeToFirestore = async function(phrase, embeddings) {
        try {
            const docRef = await addDoc(collection(db, "demoDonna"), {
                phrase: phrase,
                embedding: embeddings,
                timestamp: new Date()
            });
            console.log("Document written with ID: ", docRef.id);
            /*really I should be using the vector ID feature but I don't have paid version of firebase
            and I don't have enough time to figure cloud functions out on top of deciding pricing*/

        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }
        //need to actually utilize the error handling.

    await writeToFirestore(text, embeddings);

    return json({ embeddings: embeddings });
}