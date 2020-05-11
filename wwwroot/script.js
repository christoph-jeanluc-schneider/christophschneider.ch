const vw = Math.max( document.documentElement.clientWidth, window.innerWidth || 0 );
const vh = Math.max( document.documentElement.clientHeight, window.innerHeight || 0 );

const anchorGap = 80;

var anchors = [];
var connections = [];

var columns;
var rows;

var mouse;

function setup() {
    createCanvas( vw, vh );
    frameRate( 60 );

    columns = Math.ceil( width / anchorGap ) + 1;
    let Xoffset = ( anchorGap - ( width % anchorGap ) ) * 0.5;

    rows = Math.ceil( height / anchorGap ) + 1;
    let Yoffset = ( anchorGap - ( height % anchorGap ) ) * 0.5;

    for( let r = 0; r < rows; r++ ) {
        for( let c = 0; c < columns; c++ ) {
            let index = ( r * columns ) + c;

            anchors.push( new Anchor( index, c * anchorGap - Xoffset, r * anchorGap - Yoffset ) );

            let index_up = index - columns;
            if( c > 0 && c < columns - 1 && anchors[ index_up ] )
                connections.push( new Connection( anchors[ index ], anchors[ index_up ] ) );

            let index_left = index - 1;
            if( c > 0 && r > 0 && r < rows - 1 && anchors[ index_left ] )
                connections.push( new Connection( anchors[ index ], anchors[ index_left ] ) );
        }
    }
}

const zoom = 1;
function draw() {
    background( 51 );

    let scaled_width = width * zoom;
    let scaled_height = height * zoom;

    let offsetX = ( width - scaled_width ) * 0.5;
    let offsetY = ( height - scaled_height ) * 0.5;

    mouse = createVector(
        map( mouseX, 0, width, ( offsetX * -1 / zoom ), width + ( offsetX / zoom ) ),
        map( mouseY, 0, height, ( offsetY * -1 / zoom ), height + ( offsetY / zoom ) ) );

    translate( offsetX, offsetY );
    scale( zoom );

    // for( let i in anchors ) {
    //     anchors[ i ].draw();
    // }

    for( let i in connections ) {
        connections[ i ].update();
        connections[ i ].draw();
    }
}



class Anchor {
    constructor( id, x, y ) {
        this.id = id;
        this.pos = createVector( x, y );
    }

    draw() {
        fill( 255 );
        noStroke();
        ellipse( this.pos.x, this.pos.y, 7 );
    }
}

class Connection {
    constructor( a1, a2 ) {
        this.a1 = a1;
        this.a2 = a2;
        this.center = createVector( ( a1.pos.x + a2.pos.x ) * 0.5, ( a1.pos.y + a2.pos.y ) * 0.5 );
        this.anchor = createVector( this.center.x, this.center.y );
        this.hooked = false;
        this.velocity = createVector( 0, 0 );
    }

    update() {
        let dist_to_mouse = this.a1.pos.dist( mouse ) + this.a2.pos.dist( mouse ) - anchorGap;

        let dir = p5.Vector.sub( this.center, this.anchor ).normalize();
        let dist_c = this.center.dist( this.anchor );
        this.acc = dir.mult( dist_c ).div( 20 );

        if( dist_to_mouse < 2 )
            this.hooked = true;

        if( this.hooked ) {
            this.anchor.x = mouse.x;
            this.anchor.y = mouse.y;

            if( dist_to_mouse > anchorGap * 0.1 ) this.hooked = false;
        } else {
            this.velocity.add( this.acc );
            this.velocity.mult( 0.92 );
            this.anchor.add( this.velocity );
        }
    }

    draw() {
        noFill();
        stroke( 80 );
        strokeWeight( 2 );
        bezier( this.a1.pos.x, this.a1.pos.y,
            this.anchor.x, this.anchor.y,
            this.anchor.x, this.anchor.y,
            this.a2.pos.x, this.a2.pos.y );
    }
}
