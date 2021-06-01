let analyser;
let data;
let audioCtx;

const num_boxes = 64;
const fftSize = 2048;

function setup ()
{
    createCanvas ( 600, 600 );

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
    analyser.fftSize = fftSize;
    mic.connect ( analyser );

    data = new Uint8Array ( analyser.frequencyBinCount );

}

function amps ( data )
{
    let a = [];

    let chunk = Math.floor(data.length * 0.5);

    data = data.slice ( 0, chunk );

    let span = data.length / num_boxes;

    for ( let i = 0; i < num_boxes; i++ ) {
        let x = 0;
        
        let start = span * i;
        let end = start + span;

        for ( let j = start; j < end; j++ )
            x += data [ start + j ];

        a.push ( x / span );
    }

    return a;
}

function draw ()
{
    background ( 16, 23, 17, 120 );

    let rect_sizes;

    if ( analyser == null ) {
        rect_sizes = [];

        for ( let i = 0; i<num_boxes; i++ )
            rect_sizes.push ( 0.25 );
    }
    else {
        analyser.getByteFrequencyData ( data );
        rect_sizes = amps ( data ).map ( a => map ( a, 0, 255, 0, 1 ) );
    }

    let grid_w = width/sqrt(num_boxes);
    let grid_h = height/sqrt(num_boxes);
    
    stroke ( 255 );
    noFill ();

    let t = millis()/60;

    let idx_offset = Math.floor ( t ) % num_boxes;

    for ( let i = 0; i<sqrt(num_boxes); i++ )
    {
        for ( let j = 0; j<sqrt(num_boxes); j++ )
        {
            let idx = (sqrt(num_boxes) * i + j + idx_offset)%num_boxes;
            let s = rect_sizes [ idx ];
            let w = grid_w * s;
            let h = grid_h * s;

            let x = ( grid_w * i ) + ( grid_w / 2 ) - w/2;
            let y = ( grid_h * j ) + ( grid_h / 2 ) - h/2;
            rect ( x, y, w, h );
        }
    }
}

