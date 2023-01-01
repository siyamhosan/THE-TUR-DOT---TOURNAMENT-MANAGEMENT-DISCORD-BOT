async function tamplate1(data, benner_data) {
  const { registerFont, createCanvas, loadImage } = require("canvas");
  registerFont("./src/helpers/tamplates/fonts/BebasNeue-Regular.ttf", {
    family: "Bebas Neue",
    weight: 400,
  });
  const canvas = createCanvas(1280, 720);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#5352ed";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#15ca83";
  if (benner_data) {
    if (benner_data.customBack_link !== undefined) {
      let image = await loadImage(benner_data.customBack_link);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    }
    if (
      benner_data.hadder_text !== undefined &&
      benner_data.hadder_color !== undefined
    ) {
      ctx.font = `60px "Bebas Neue"`;
      ctx.fillStyle = benner_data.hadder_color;
      ctx.textAlign = "center";
      ctx.fillText(benner_data.hadder_text, canvas.width / 2 + 30, 75, 500);
    } else if (benner_data.hadder_text !== undefined) {
      ctx.font = `60px "Bebas Neue"`;
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(benner_data.hadder_text, canvas.width / 2 + 30, 75, 500);
    }
    if (
      benner_data.dis_text !== undefined &&
      benner_data.dis_color !== undefined
    ) {
      ctx.font = `40px "Bebas Neue"`;
      ctx.fillStyle = benner_data.dis_color;
      ctx.textAlign = "center";
      ctx.fillText(benner_data.dis_text, canvas.width / 2 + 30, 125, 500);
    } else if (benner_data.dis_text !== undefined) {
      ctx.font = `40px "Bebas Neue"`;
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(benner_data.dis_text, canvas.width / 2 + 30, 125, 500);
    }
    if (benner_data.topRow_color !== undefined) {
      ctx.fillStyle = benner_data.topRow_color;
    } else {
      ctx.fillStyle = "#15ca83";
    }
  }

  //x + 265 = 290
  ctx.textAlign = "start";
  let rankMarker = { rw: 70, rx: 260, ry: 142 };
  const { rw, rx, ry } = rankMarker;
  let nameMarker = { nw: 250, nx: rw + rx + 15 + 5, ny: ry };
  const { nw, nx, ny } = nameMarker;
  let matchsMarker = { mw: 70, mx: nw + nx + 15 + 5, my: ny };
  const { mw, mx, my } = matchsMarker;
  let boyyahMarker = { bw: 70, bx: mw + mx + 15 + 5, by: ny };
  const { bw, bx, by } = boyyahMarker;
  let killPointMarker = { kw: 70, kx: bw + bx + 15 + 5, ky: ny };
  const { kw, kx, ky } = killPointMarker;
  let positionPointMarker = { pw: 70, px: kw + kx + 15 + 5, py: ny };
  const { pw, px, py } = positionPointMarker;
  let totalPointMarker = { tw: 70, tx: pw + px + 15 + 5, ty: ny };

  function boxMc(x, y, w) {
    ctx.fillRect(x, y, w, 35);
    ctx.beginPath();
    ctx.moveTo(x, y + 35);
    ctx.lineTo(x - 15, y + 35);
    ctx.lineTo(x, y);
    ctx.moveTo(x + w, y);
    ctx.lineTo(x + w + 15, y);
    ctx.lineTo(x + w, y + 35);
    ctx.fill();
  }
  function boxMcShort(x, y, w) {
    ctx.fillRect(x, y, w, 35);
    ctx.beginPath();
    ctx.moveTo(x + w, y);
    ctx.lineTo(x + w + 15, y);
    ctx.lineTo(x + w, y + 35);
    ctx.fill();
  }
  function boxMcShort2(x, y, w) {
    ctx.fillRect(x, y, w, 35);
    ctx.beginPath();
    ctx.moveTo(x, y + 35);
    ctx.lineTo(x - 15, y + 35);
    ctx.lineTo(x, y);
    ctx.fill();
  }

  boxMcShort(rankMarker.rx, rankMarker.ry, rankMarker.rw);
  boxMc(nameMarker.nx, nameMarker.ny, nameMarker.nw);
  boxMc(matchsMarker.mx, matchsMarker.my, matchsMarker.mw);
  boxMc(boyyahMarker.bx, boyyahMarker.by, boyyahMarker.bw);
  boxMc(killPointMarker.kx, killPointMarker.ky, killPointMarker.kw);
  boxMc(positionPointMarker.px, positionPointMarker.py, positionPointMarker.pw);
  boxMcShort2(totalPointMarker.tx, totalPointMarker.ty, totalPointMarker.tw);

  data.forEach(
    ({ name, boyyah, killPoint, positionPoint, total, count }, idx) => {
      if (idx >= 12) {
        return;
      }
      let x = 260;
      let w = 70;
      let y = 199 - 15 + 42 * idx;
      ctx.globalAlpha = 0.7;
      //rank
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x, y, w, 35);
      ctx.beginPath();
      ctx.moveTo(x + w, y);
      ctx.lineTo(x + w + 15, y);
      ctx.lineTo(x + w, y + 35);
      ctx.fill();
      //name
      w = 250;
      x = x + 70 + 20;
      ctx.fillRect(x, y, w, 35);
      ctx.beginPath();
      ctx.moveTo(x, y + 35);
      ctx.lineTo(x - 15, y + 35);
      ctx.lineTo(x, y);
      ctx.moveTo(x + w, y);
      ctx.lineTo(x + w + 15, y);
      ctx.lineTo(x + w, y + 35);
      ctx.fill();
      //matchs
      w = 70;
      x = x + 250 + 20;
      ctx.fillRect(x, y, w, 35);
      ctx.beginPath();
      ctx.moveTo(x, y + 35);
      ctx.lineTo(x - 15, y + 35);
      ctx.lineTo(x, y);
      ctx.moveTo(x + w, y);
      ctx.lineTo(x + w + 15, y);
      ctx.lineTo(x + w, y + 35);
      ctx.fill();
      //boyyah
      w = 70;
      x = x + 70 + 20;
      ctx.fillRect(x, y, w, 35);
      ctx.beginPath();
      ctx.moveTo(x, y + 35);
      ctx.lineTo(x - 15, y + 35);
      ctx.lineTo(x, y);
      ctx.moveTo(x + w, y);
      ctx.lineTo(x + w + 15, y);
      ctx.lineTo(x + w, y + 35);
      ctx.fill();
      //kill
      x = x + 70 + 20;
      ctx.fillRect(x, y, w, 35);
      ctx.beginPath();
      ctx.moveTo(x, y + 35);
      ctx.lineTo(x - 15, y + 35);
      ctx.lineTo(x, y);
      ctx.moveTo(x + w, y);
      ctx.lineTo(x + w + 15, y);
      ctx.lineTo(x + w, y + 35);
      ctx.fill();
      //position
      x = x + 70 + 20;
      ctx.fillRect(x, y, w, 35);
      ctx.beginPath();
      ctx.moveTo(x, y + 35);
      ctx.lineTo(x - 15, y + 35);
      ctx.lineTo(x, y);
      ctx.moveTo(x + w, y);
      ctx.lineTo(x + w + 15, y);
      ctx.lineTo(x + w, y + 35);
      ctx.fill();
      x = x + 70 + 20;
      //total
      ctx.fillRect(x, y, w, 35);
      ctx.beginPath();
      ctx.moveTo(x, y + 35);
      ctx.lineTo(x - 15, y + 35);
      ctx.lineTo(x, y);
      ctx.fill();
      //TExt
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#000000";
      ctx.font = `23px "Bebas Neue"`;
      x = 300;
      y = 224 - 15 + 42 * idx;
      let rank = idx + 1;
      ctx.fillText(rank, x, y, 80);
      if (idx === 0) ctx.fillText("#", x, y - 42, 70);
      x = x + 70;
      let X = x;
      ctx.fillText(name.toUpperCase().replace(/-/g, " ") ?? " ", x, y, 225);
      if (idx === 0) ctx.fillText("NAME", X + 85, y - 42, 70);
      x = x + 280 - count.toString().length * 2;
      X = X + 295;
      if (idx === 0) ctx.fillText("MATCH(s)", X - 40, y - 42, 70);
      ctx.fillText(count ?? " ", x, y, 80);
      x = x + 95 - killPoint.toString().length * 2;
      X = X + 80;
      if (idx === 0) ctx.fillText("WIN", X - 15, y - 42, 70);
      ctx.fillText(boyyah ?? " ", x, y, 80);
      x = x + 90 - killPoint.toString().length * 2;
      X = X + 80;
      if (idx === 0) ctx.fillText("Kill PTS", X - 20, y - 42, 70);
      ctx.fillText(killPoint ?? " ", x, y, 80);
      x = x + 90 - positionPoint.toString().length * 2;
      X = X + 80;
      ctx.fillText(positionPoint ?? " ", x, y, 80);
      if (idx === 0) ctx.fillText("Place PTS", X - 17, y - 42, 70);
      x = x + 90 - total.toString().length * 2;
      X = X + 90;
      if (idx === 0) ctx.fillText("TOTAL", X - 8, y - 42, 70);
      ctx.fillText(total ?? " ", x, y, 80);
      ctx.fillStyle = "##15ca83";
      ctx.closePath();
    }
  );
  let waterImage = await loadImage(
    "https://cdn.discordapp.com/attachments/752414886570623008/1037082474544648262/Picsart_22-11-02_01-14-52-193.png"
  );
  ctx.drawImage(waterImage, 0, 0, canvas.width, canvas.height);
  return canvas;
}

module.exports = { tamplate1 };
