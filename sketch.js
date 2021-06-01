let analyser;
let data;
let audioCtx;

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

    audioCtx = new AudioContext ();
    let stream = await navigator.mediaDevices.getUserMedia ( c );

    let mic = audioCtx.createMediaStreamSource ( stream );


    analyser = audioCtx.createAnalyser ();
    analyser.fftSize = 2048;
    mic.connect ( analyser );

    data = new Uint8Array ( analyser.frequencyBinCount );
}

function draw ()
{
    if ( analyser == null )
        return;

    analyser.getByteFrequencyData ( data );

    let peak = Math.max ( ...data );

    let t = millis()/1000;
    let a = TWO_PI * t/2;

    background ( 50 );
    
    stroke ( 255 );
    noFill ();

    rectMode ( CENTER );
    push ();

    translate ( width/2, height/2 );
    rotate ( a );

    rect ( 0, 0, peak, width/10 );

    pop ();
}

