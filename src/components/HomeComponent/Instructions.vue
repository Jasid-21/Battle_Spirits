<template>
    <div class="instructions_container">
        <div class="instructions">
            <div class="title">For deck building</div>
            <div class="content">
                Use an online deck builder and copy the built deck in tts format (Tabletop Simulator).
                Like this: 
                <br><br>
                [ST01-016,ST01-016,ST01-016,ST01-015,ST01-015,ST01-015,ST01-015,ST01-014,
                ST01-014,ST01-014,ST01-014,ST01-013,ST01-013,ST01-013,ST01-013,...]
                <br><br>
                Then paste the copied deck into the "import" box in the Deck Builder section and click "Import" button.
                <br>
                You can move between pages using the navigation bar above.
                <br>
                <b>Important: </b> From now, this app doesn't support side deck. So, in order to avoid issues,
                just import main decks.
                <br><br>
                You can use the buttons in the Deck Builder section to save the imported deck or load a
                previous saved deck.
            </div>
        </div>

        <div class="instructions">
            <div class="title">For Battle</div>
            <div class="content">
                Move to the Multiplayer page. There you'll see an "Username" and "Select Deck" inputs.
                <br>
                Username by defauls is Player but you can change it.
                <br><br>
                Chose a previously saved deck and host a room by clicking the "Host" button or 
                send a request to an open room.
                <br>
                To see the available rooms click the refresh button.
                <br><br>
                If you are hosting a room, you can see the request sent to you. Just chose one and accept it.
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'InstructionsContainer'
}
</script>

<style scoped>
.instructions_container {
  width: 100%;
  height: 400px;

  display: flex;
  justify-content: space-around;
  align-items: center;
}

.instructions {
    width: 400px;
    height: calc(100% - 20px);
    padding: 10px;

    border: 2px solid gray;
    border-radius: 15px;
    background-color: rgba(128, 128, 128, 0.6);
}

.title {
    font-size: 18px;
    font-weight: 700;
    text-align: center;
}

.content {
    font-size: 15px;
    text-align: left;
    font-style: italic;
}
</style>
