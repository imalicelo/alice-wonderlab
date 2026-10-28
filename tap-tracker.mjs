// A drag that returns to its starting point and a two-finger pinch are not taps.
export function createTapTracker(tolerance=8) {
  const pointers=new Set();
  let down=null,multiple=false;
  return {
    start(e){pointers.add(e.pointerId);if(pointers.size>1){multiple=true;down=null;}else{multiple=false;down={id:e.pointerId,x:e.clientX,y:e.clientY,moved:false};}},
    move(e){if(down?.id===e.pointerId&&Math.hypot(e.clientX-down.x,e.clientY-down.y)>tolerance)down.moved=true;},
    end(e){const tap=down;pointers.delete(e.pointerId);down=null;return !multiple&&!!tap&&tap.id===e.pointerId&&!tap.moved&&Math.hypot(e.clientX-tap.x,e.clientY-tap.y)<=tolerance;},
    cancel(e){pointers.delete(e.pointerId);down=null;multiple=true;}
  };
}
