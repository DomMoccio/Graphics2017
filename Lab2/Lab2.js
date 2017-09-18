/*
 * Computer Graphics - Lab #2
 * Surface Shading
 *
 */

function lineToAngle(ctx, p, length, angle)
{
    ctx.beginPath();

    angle *= Math.PI / 180;

    var x2 = p[0] + length * Math.cos(angle),
        y2 = p[1] + length * Math.sin(angle);

    ctx.moveTo(p[0], p[1]);
    ctx.lineTo(x2, y2);

    ctx.lineWidth = 10;
    ctx.stroke();

    return {x: x2, y: y2};
}

function normalize(vec) {
	var vector_length = Math.sqrt(vec[0]^2 + vec[1]^2)
    vectorX = vec[0] / vector_length
	vectorY = vec[1] / vector_length
	normalVec = [vectorX, vectorY]
	return(normalVec)
}

function render(){
  var canvas = document.getElementById("viewport-main");
  var ctx = canvas.getContext('2d');

  var refPos = [ 400, 480 ];
  var lightPos = [ 0, 0 ];
  var eyePos = [ 0, 0 ];

  var normalVec = [ 0, 1 ];
  var lightVec = [ 0, 0 ];
  var eyeVec = [ 0, 0 ];

  var param = document.querySelector("input[name='params']:checked").value;
  
  // Use conditional to change either light or eye position.
  switch (param) {
	// e selected - Move eye vector
	case "e":
	
	// l selected - Move light vector
	case "l":
	
	default: break;
  }
  
  var theta = 30;
  var phi = -45;

  var color = document.getElementById("reflectance").value;
  var ambientColor = document.getElementById("ambient").value;
  // TODO implement Phong illumination model to compute shaded color
  var diffuseColor = color;
  var specularColor = color;
  var totalColor = color;  
  
  ctx.fillStyle = color;
  ctx.fillRect(80, 480, 640, 40);

  ctx.fillStyle = diffuseColor;
  ctx.fillRect(1024, 120, 120, 120);
  ctx.fillStyle = specularColor;
  ctx.fillRect(1024, 120, 120, 120);

  lineToAngle(ctx, refPos, 150, -90);
  lineToAngle(ctx, refPos, 150, -90 - theta);
  lineToAngle(ctx, refPos, 150, -90 - phi);

}

window.onload = render;

