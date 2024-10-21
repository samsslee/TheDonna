<script>
    let phrase = '';
    let question = '';
    let responseDonna = '';
    let embeddings = '';
    let scheduleEvent = '{If you tell Donna to schedule something then it will say so here, otherwise it will be blank}';


    //I should really have reset the input boxes neatly after the question is sent
    //all of this needs actual error handling and input sanitization.
    async function handleTellDonna() {

        //not the prettiest function, would rather pull out separately into modules instead.
        if (phrase == ''){return}
        
        const res = await fetch('/api/embeddings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: phrase })
        });

        const data = await res.json();
        embeddings = data.embeddings;

        const sched = await fetch('/api/triage', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ text: phrase })
        })
        const schedData = await sched.json();
        scheduleEvent = schedData.data.choices[0].message.content
        console.log(schedData) //This part is supposed to be cleaned up, then the JSON is to be sent to Google Calendar API
    }

    async function handleAskDonna(){
        if (question == ''){return}

        const res = await fetch('/api/response', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text:  `question: ${question}` })
        });
        const {data} = await res.json()
        responseDonna = JSON.stringify(data.choices[0].message.content)
        console.log(data)

    }
    

</script>

<style>
    h1 {
        color: #a75300; /* Dark orange */
        margin-bottom: 10px;
    }

    h2 {
        color: #ff8c00;
        margin-bottom: 20px;
    }

    input {
        width: 90%;
        max-width: 500px;
        padding: 15px;
        margin: 10px 0;
        font-size: 1.2em;
        border: 2px solid #ff8c00;
        border-radius: 8px;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
    }

    input:focus {
        outline: none;
        border-color: #ff4500; /* Brighter orange on focus */
    }

    button {
        background-color: #ff8c00; /* Dark orange */
        color: white;
        font-size: 1.2em;
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
        margin-left: 10px;
    }

    button:hover {
        background-color: #ff4500; /* Brighter orange on hover */
    }

    button:active {
        background-color: #cc3700; /* Darker orange on click */
    }

    p {
        font-size: 1em;
        color: #555;
        margin-bottom: 30px;
    }

    .rounded-box {
        border: 2px solid #ff8c00; /* Dark orange border */
        border-radius: 12px;
        padding: 20px;
        margin: 20px 0;
        background-color: #fff;
        box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
        max-width: 600px;
        width: 100%;
        text-align: center;
    }

    br {
        margin-bottom: 20px;
    }

</style>

<h1>Welcome to The Donna</h1>

<div class="rounded-box">
    <h2>Tell Donna about your life or schedule in natural language</h2>
    <input bind:value={phrase} placeholder="'Coffee today was really good' or 'Went to dentist today'" />
    <button on:click={handleTellDonna}>Tell</button>
    <p>This is information you want her to note.</p>
    <p>{scheduleEvent}</p>
</div>

<br>

<div class="rounded-box">
    <h2>Ask Donna about your schedule or for her opinion</h2>
    <input bind:value={question} placeholder="'What appointment did I have that day I got great coffee?'" />
    <button on:click={handleAskDonna}>Ask</button>
    <p>For when you want to know what's best for you.</p>
    <h2>Donna's Response:</h2>
    <div>
        <p>{responseDonna}</p>
    </div>
</div>
