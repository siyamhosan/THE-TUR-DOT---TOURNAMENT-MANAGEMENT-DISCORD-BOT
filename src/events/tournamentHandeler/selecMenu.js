const { SelectMenuBuilder } = require("discord.js");

const tourSelectMenuReg = new SelectMenuBuilder()
  .setCustomId("tourManagerReg")
  .setPlaceholder(
    "Tournament registration manager <:users:1043145827599790130>"
  )
  .addOptions(
    {
      label:
        "Registration start/end (toggle) <a:toggledesktop:1043406154757320734>",
      description:
        "One click will start registration and another click end registration",
      value: "reg_status_toggle",
    },
    {
      label: "Registration slots",
      description: "Change registration slots",
      value: "reg_slot_change",
    },
    {
      label: "Registration link",
      description: "Registration form link generator",
      value: "reg_link_web",
    },
    {
      label: "Registration schedeule",
      description: "Registration form link generator",
      value: "reg_sced",
    },
    {
      label:
        "Text based registration (toggle)  <a:toggledesktop:1043406154757320734>",
      description:
        "One click will on text registration and another click off text registration",
      value: "reg_textbase_toggle",
    },
    {
      label:
        "Slash command based registration (toggle)  <a:toggledesktop:1043406154757320734>",
      description:
        "One click will on slash command registration and another click off slash command registration",
      value: "reg_slashcmd_toggle",
    }
  );
