
// IMPORTS

// CODE

mp.events.add('client.AirDropAudio', (status, obj) => {
    if(status) {
    // let inverval = null;
    let pos = obj.position; // obj.position

    // if(status && inverval === null) {
    //     inverval = setInterval(() => {
            mp.game.audio.playSoundFromCoord(1, "IDLE_BEEP", pos.x, pos.y, pos.z, "EPSILONISM_04_SOUNDSET", false, 20, false);
    //     }, 1000);
    // }

    // if(inverval != null) {
    //     clearInterval(inverval);
    //     inverval = null;
    // }
    }
});




