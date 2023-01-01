const { ButtonStyle } = require("discord.js");
const { Schema, model } = require("mongoose");

const tournamentSchema = new Schema({
  _id: Schema.Types.ObjectId,
  tur_id: String,
  guildID: String,
  guildname: String,
  tur_name: String,
  tur_benner: String,
  tur_mod: String,
  tur_pretent: String,
  tur_cretaed: String,
  tur_log: String,
  tur_manage: String,
  reg_logo: Boolean,
  reg_Text_Base: {
    status: Boolean,
    requirements: Array,
    template: String,
  },
  reg_limit: Number,
  reg_status: String,
  reg_channel: String,
  reg_payment: Boolean,
  reg_payment_check: String,
  reg_payment_list: [
    {
      delete_message_id: String,
      trx_id: String,
      name: String,
      list: String,
      logo: String,
      user: String,
      time: String,
    },
  ],
  reg_system: String,
  group_status: Boolean,
  group_channel: String,
  groups_list: [{ group_name: String, group_roleId: String }],
  sched_start: String,
  sched_end: String,
  result_benner: {
    hadder_text: String,
    hadder_color: String,
    dis_text: String,
    dis_color: String,
    topRow_color: String,
    customBack_link: String,
  },
  pay_info: [
    {
      title: String,
      info: String,
      emoji: String,
      payString: String,
    },
  ],
  result_pointSystem: Array,
  result_matchs: [
    {
      match: [
        {
          name: { type: String, required: true },
          boyyah: { type: Number, required: true },
          positionPoint: { type: Number, required: true },
          killPoint: { type: Number, required: true },
        },
      ],
      map: String,
      date: String,
    },
  ],
  reg_list: Array,
});

module.exports = model("tur", tournamentSchema, "Tournament");
