let user_speaker;

function setup ()
{
    createCanvas ( 800, 600 );

    let button = createButton ( 'Listen' );
    button.position ( 0, 0 );
    button.mousePressed ( async () => get_user_speakers () );
}

async function get_user_speakers ()
{
    user_speaker = new MediaStream ();
    let c = {
        video : false,
        audio : true
    };

    let stream = await navigator.mediaDevices.getDisplayMedia ( c );

    let tracks = stream.getTracks ();
    console.log ( tracks );
    let audio_track = tracks [0];
    user_speaker.addTrack ( audio_track.clone ());

    let video_track = stream.getVideoTracks ()[0];
    video_track.stop ();
    stream.removeTrack ( video_track );

}

function draw ()
{
    let t = millis()/1000;
    let a = TWO_PI * t/2;

    background ( 50 );
    
    stroke ( 255 );
    noFill ();

    rectMode ( CENTER );
    push ();

    translate ( width/2, height/2 );
    rotate ( a );

    rect ( 0, 0, width/10, width/10 );

    pop ();
}

