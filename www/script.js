async function getToken(u, p) {
  //const token = await fetch('https://192.168.1.2/identity-manager/api/v2/auth/token?dryrun=false', {
  const token = await fetch('/identity-manager/api/v2/auth/token?dryrun=false', {
      method: "POST",
      headers: {
          "Content-Type" : "application/json",
          "accept": "application/json"
      },
      body: JSON.stringify({
          "password": p,
          "name": u
      })
  }).then(response => response.json())
  .then(response => {
      t = response.access_token
      getCoords(t);
      setInterval(() => {
          readPosition(t);
      }, 2000);
  }) 
}

function genHeaders(token) {
  return headers = {
    "Authorization" : "Bearer " + token,
    "Content-Type" : "application/json"
  }
}

async function getCoords(token) {
  //const points = await fetch('https://192.168.1.2/solutions/files/DefaultSolution/configurations/appdata/amr-map%2FHMI_Map.txt', {
  const points = await fetch('/solutions/files/DefaultSolution/configurations/appdata/amr-map%2FHMI_Map.txt', {
    method: "GET",
    headers : genHeaders(token)
  })
  .then(response => response.text())
  .then(data => {
    let lines = data.split('\n')
    let coords = [];
    lines.forEach(el => {
      coords.push(el.split(" ")); 
    });

    console.log(coords)

    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    ctx.translate(-22840, 9620);
    ctx.rotate(-90*(Math.PI / 180));

    coords.forEach(el => {
      ctx.beginPath();
      ctx.arc(el[0], el[1], 10, 0, 2*Math.PI);
      ctx.fillStyle = "black";
      ctx.fill(); 
      ctx.stroke();
    });

    // Visualize min/max data points
    // ctx.fillStyle = 'red';
    // ctx.fillRect(-860, 22840, 100, 100);
    // ctx.fillRect(-860, 40620, 100, 100);
    // ctx.fillRect(9520, 40620, 100, 100);
    // ctx.fillRect(9520, 22840, 100, 100);
    
  })
}

function animate(x, y) {
    ctx2.clearRect(-860, 22840, canvas2.width, canvas2.height);
    ctx2.fillStyle = "Red";
    ctx2.fillRect(x, y, 300, 300);
}

function applyValue() {
    console.log("in the applyValue function")
    const xInput = document.getElementById("X");
    const xVal = xInput.value;

    const yInput = document.getElementById("Y");
    const yVal = yInput.value;

    console.log("xVal: " + xVal + " and yVal: " + yVal)

    animate(xVal, yVal);
}

async function readPosition(token) {
    //const readX = await fetch('https://192.168.1.2/automation/api/v2/nodes/amr-map%2Fx', {
    const readX = await fetch('/automation/api/v2/nodes/amr-map%2Fx', {
      method: "GET",
      headers: genHeaders(token)
    })
    .then(response => response.json())
    xVal = readX.value;

    //const readY = await fetch('https://192.168.1.2/automation/api/v2/nodes/amr-map%2Fy', {
    const readY = await fetch('/automation/api/v2/nodes/amr-map%2Fy', {
      method: "GET",
      headers: genHeaders(token)
    })
    .then(response => response.json())
    yVal = readY.value;

    console.log("X: " + xVal + "      Y: " + yVal)
    animate(xVal, yVal);
}

// Adjust object canvas
const canvas2 = document.getElementById("myCanvas2");
const ctx2 = canvas2.getContext("2d");
ctx2.translate(-22840, 9620);
ctx2.rotate(-90*(Math.PI / 180));

getToken("boschrexroth", "boschrexroth");