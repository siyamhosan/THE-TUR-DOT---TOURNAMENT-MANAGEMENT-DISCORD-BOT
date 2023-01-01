async function wlcBenner(welData, member, Resooon) {
  const {
    bgURL,
    avatar_border_color,
    welcome_color,
    username_color,
    message__text,
    message__color,
  } = welData;
  const { registerFont, createCanvas, loadImage } = require("canvas");
  registerFont("./src/helpers/tamplates/fonts/BebasNeue-Regular.ttf", {
    family: "Bebas Neue",
    weight: 400,
  });
  registerFont("./src/helpers/tamplates/fonts/Inter-ExtraBold.ttf", {
    family: "Inter",
    weight: 800,
  });
  registerFont("./src/helpers/tamplates/fonts/Panzer.ttf", {
    family: "Penzer",
  });
  const canvas = createCanvas(1024, 500);
  const ctx = canvas.getContext("2d");
  let x = canvas.width / 2;
  ctx.font = `80px "Penzer"`;
  ctx.fillStyle = "#ffffff";
  if (welData.bgURL) {
    let image = await loadImage(bgURL);
    ctx.drawImage(image, 0, 0, 1024, 500);
  }

  if (welcome_color) {
    ctx.fillStyle = welcome_color;
  } else ctx.fillStyle = "#ffffff";
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.shadowBlur = 2;
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.textAlign = "center";
  ctx.fillText(Resooon, x, 360);
  ctx.beginPath();
  ctx.arc(512, 166, 128, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.fill();

  if (username_color) {
    ctx.fillStyle = username_color;
  } else ctx.fillStyle = "#ffffff";

  ctx.font = `42px "Bebas Neue"`;
  ctx.textAlign = "center";
  ctx.fillText(member.user.tag.toUpperCase(), x, 410);

  if (message__color) {
    ctx.fillStyle = message__color;
  } else ctx.fillStyle = "#ffffff";

  ctx.font = `32px "Inter"`;
  ctx.fillText(message__text, x, 455);

  if (avatar_border_color) {
    ctx.fillStyle = avatar_border_color;
  } else ctx.fillStyle = "#11e6fc";

  ctx.beginPath();
  ctx.arc(512, 166, 119, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  await loadImage(
    member.user.displayAvatarURL({ extension: "png", size: 1024 })
  ).then((img) => {
    ctx.drawImage(img, 393, 47, 238, 238);
  });

  return canvas;
}

module.exports = { wlcBenner };
