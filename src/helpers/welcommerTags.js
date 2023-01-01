function ordinal_suffix_of(i) {
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
}
function tags(content, int) {
 let data = content
    .replace("<server>", int.guild.name)
    .replace("<server.name>", int.guild.name)
    .replace("<user>", int.user.username)
    .replace("<server.name>", int.guild.name)
    .replace("<user.tag>", int.user.tag)
    .replace("<user.username>", int.user.username)
    .replace("<user.mention>", `<@${int.user.id}>`)
    .replace("<user.discriminator>", int.user.discriminator)
    .replace("<user.id>", int.user.id)
    .replace("<membercount>", int.guild.memberCount)
    .replace("<membercount.ordinal>", ordinal_suffix_of(int.guild.memberCount));
  return data
}

function replaceR(data, int) {
  if (data.content) data.content = tags(data.content, int);
  if (data.embed_des) data.embed_des = tags(data.embed_des, int);
  if (data.embed_title) data.embed_title = tags(data.embed_title, int);
  if (data.message__text) data.message__text = tags(data.message__text, int);
  return data
}

module.exports = { replaceR, tags };
