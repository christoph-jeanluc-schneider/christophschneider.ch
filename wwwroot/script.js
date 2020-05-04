const vw = Math.max( document.documentElement.clientWidth, window.innerWidth || 0 );
const vh = Math.max( document.documentElement.clientHeight, window.innerHeight || 0 );

const anchorGap = 220;
const D = 0.2;

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

    for( let i in anchors ) {
        anchors[ i ].draw();
    }

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
        fill( 255, 127 );
        noStroke();
        ellipse( this.pos.x, this.pos.y, 16 );
    }
}

class Connection {
    constructor( a1, a2 ) {
        this.a1 = a1;
        this.a2 = a2;
        this.rest = createVector( ( a1.pos.x + a2.pos.x ) * 0.5, ( a1.pos.y + a2.pos.y ) * 0.5 );
        this.p = createVector( this.rest.x + 40, this.rest.y + 40 );
        // this.p = createVector( this.rest.x, this.rest.y );
        this.acc = createVector( 0, 0 );
    }

    update() {
        let force = createVector( this.rest.x - this.p.x, this.rest.y - this.p.y );

        noFill();
        stroke( 100, 100, 255 );
        line( this.rest.x, this.rest.y, this.rest.x + force.x, this.rest.y + force.y );

        // this.force.add( force.x, force.y );

        // this.p.add( this.acc.x, this.acc.y );
    }

    draw() {
        // let distance = mouse.dist( this.m );

        // let direction = createVector( this.m.x - mouse.x, this.m.y - mouse.y );
        // let force_v = createVector( this.m.x - mouse.x, this.m.y - mouse.y ).normalize();
        // let force_amount = 99999 / ( distance * distance );
        // force_amount = constrain( force_amount, 0, 200 );
        // force_v.setMag( force_amount );

        // let target = createVector( this.m.x + force_v.x, this.m.y + force_v.y );

        // noFill();
        // strokeWeight( 1 );
        // stroke( 255, 100, 100 );
        // line( this.m.x, this.m.y, target.x, target.y );

        // stroke( 100, 100, 255 );
        // line( this.m.x, this.m.y, this.m.x + direction.x, this.m.y + direction.y );

        fill( 255 );
        noStroke();
        ellipse( this.p.x, this.p.y, 16 );


        noFill();
        stroke( 255 );
        strokeWeight( 1 );
        bezier( this.a1.pos.x, this.a1.pos.y,
            this.p.x, this.p.y,
            this.p.x, this.p.y,
            this.a2.pos.x, this.a2.pos.y );
    }
}
