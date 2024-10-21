# The Donna (the best-friend-secretary)
### Brief description of your project and what inspired you
**Inpiration:** I love sharing my life's events with my best friend... a lot! Over the last decade, I've been through so many things, and my friend (and our chat log) has always been there for me. When I'm happy with a restaurant, I share pics with my friend. When I'm too swamped and worry I'll forget a chore or event later, I count on my friend to remind me. This has gone on so much, that I have a habit of using our chat log history (+search) as a way to figure out when events happened... somewhat like a "blursed" journal. Sure, there are calendar apps and journal apps, but to me, especially for the little events of life, it can feel a lot more grounding to have a human interaction about them.

My demo app seeks to imitate the existence of my friend. Just for fun, I named the app Donna, after the secretary in the show Suits, who "knows about everyone". She anticipates people's needs, gives great advice, and gets excellent schedules arranged.

**The intended project design** is for the user to say anything to Donna (eg. "this croissant I bought today at Costco is too dry", or "I've got a doctor's appointment next thursday", or "I tripped on a rock and ruined my pants") in the top "Tell Donna" box. I call this the "input phrase" in this readme. I intend for the following to happen:
1. _Donna triages your input phrase_. The program sends your input to OpenAI and it decides if what you've said needs to be scheduled to your Google calendar.
2. _Donna schedules your calendar event_. The program would POST the event data to your Google Calendar.
3. _Donna notes what you've said with a timestamp_. I used OpenAI to embed the information and I send the phrase, embedding, and current time to Firestore.

Later on, say you want to get some advice from Donna, you use the "Ask Donna" box to ask, for example, "Should I get Costco croissants?" or "That day I tripped on the rock, did I get a croissant?". I call this "question" or "query" in this readme.
- Using semantic similarity (comparing the embedded vector of your query), Donna pulls similar content from your database and gives you advice based on that.

**Given the timeframe, I wasn't able to finish** the part where Donna schedules your event to Google Calendar. Currently, the program will just display a JSON object for EventName and EventDate - which in theory I'd set up to send to Google Calendar.

### Instructions for running the application locally

Pretty simple setup: clone the GH repo, `npm i`, then `npm run dev`. Email me and ask me for my `.env` file if you want to run it and use my Database and OpenAI. Otherwise, if you want to use your own, make a new Firebase project and grab an API key from your own OpenAI account and setup an `.env` file with the following variables:

`
VITE_API_KEY=123your-key
VITE_AUTH_DOMAIN=123your-key
VITE_PROJECT_ID=123your-key
VITE_STORAGE_BUCKET=123your-key
VITE_MESSAGING_SENDER_ID=123your-key
VITE_APP_ID=123your-key
VITE_MEASUREMENT_ID=123your-key
OPENAI_API_KEY=123your-key
`

### List of implemented features and technologies used
1. SvelteKit (As required)
    - I used the index page to setup the UI
    - The server functions handle outgoing calls to Firebase and OpenAI. The client UI calls these server functions so that the tokens are not exposed to the browser.
2. Firebase (As required)
    - Used to store the user's input phrases and its embeddings
3. OpenAI:
    - embeddings: to make 1536-dimention embedded vectors for the phrases.
    - chat-completion: to talk to the LLM. The chat completion is used for two purposes. Firstly, to triage if the original input phrase is something Donna should schedule, and if so, turn it into a JSON which can be used to send to the Google Calendar API. Secondly, once you ask Donna your question and similar database content is found as context, it constructs the answer.
4. Cosine similarity:
    - To compare the similarity of the vectors so that the we can identify what phrases in the database are similar.

### Explanation of your approach and any challenges you faced
1. I went with a structured programming approach - I first briefly chartered my project and decided what "Black Box" Functions I needed and wrote them down in a descriptive manner to myself ("Triage & Embedding", "Upload to Firestore", "Vector Similarity Search & Question Response") (~15 mins)
2. I setup a simple front end with just the minimum boxes, variables, and buttons I needed to execute my vision. I then made the folders for the server functions I had planned to make. (~45 mins)
3. Vector Embedding: This was the major challenge in this project - I had wanted to use Firebase's Cloud functions and native Vector indexing. I previously used OpenAI embeddings for my personal projects with vector embeddings, so I had hoped that it'd be easy to learn. I spent some time (~30 mins) reading the minimal docs about GenKit (alpha release), Vector indexing KNN documentation, and Gemini resources on Firebase. I was not able to exactly figure out how to execute this, and furthermore, I did not have a paid account with Firebase to use Cloud Functions, and in the interest of time I did not go further. Instead, I defaulted to setting up my vision with OpenAI's embedding and chat completions.
    - I made these functions first run with some dummy input data so that they'd be modular. I developed each function independently of each other (~45 mins)
4. Connecting to Firestore & doing vector similarity: I was somewhat disappointed that I did not get to use Cloud Functions to compute vector similarity. So instead I just uploaded the embedding along with the input phrase to Firstore, and then just used a cosine similarity comparison function I found online to compare my question to all the database pieces of info. Definitely not the way I had hoped this would go, but... oh well. (~45 mins)
5. At this point I had run out of time and was unable to implement the Google Calendar API setup. So instead I just did cleanup and wrote this readme.

### Any future enhancements you would add if given more time
So, so many! I'll note the bigger ones:
-**Security & Authentication:** My firestore is demo mode for quick setup, don't go telling the world, anyway, I would have loved to give each user their own data space, so that you could tell Donna things separately from me telling Donna my things. Users would log-in/authenticate and be able to pull their own data and get customized advice about their life.
-**Input Sanitization:** I did not limit the character count, or query content (please be nice to Donna), nor disallow escape characters or things that might potentially harm my code. Would absolutely need to do this.
-**Error Handling** I was not super consistent with error handling. If things fail I did not make a pretty way to notify the user. Would absolutely also have to add this functionality.
-**Different kind of input data:** I'd love to be able to upload pics or music from my life too.
-**Making that Google Calendar Integration:** This more or less goes hand-in-hand with authentication. You'd be able to connect your Google Calendar, and Donna would schedule the event for you.
-**Cloud Functions, obviously!** I would like to have more time to figure out how to setup the native Vector Indexing that Cloud Functions offers.
