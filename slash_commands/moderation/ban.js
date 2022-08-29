const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Zezwala administratorowi lub właścicielowi na zablokowanie członka.")
    .addUserOption((option) => option.setName('user').setDescription('The person who you want to ban').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason to ban member').setRequired(true)),
    run: async (client, interaction) => {

       if(!interaction.member.permissions.has("BAN_MEMBERS")) return interaction.followUp({ content: "You do not have enough permissions to use this command.", ephemeral: true })

        const user = interaction.options.getUser('user')
        const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id).catch(err => {})

        if(!member) return interaction.followUp("😅 | Nie można uzyskać szczegółów związanych z danym członkiem.");
        const reason = interaction.options.getString('reason')

        if(!member.bannable || member.user.id === client.user.id) 
        return interaction.followUp("😅 | Nie mogę zablokować tego użytkownika");
        
        if(interaction.member.roles.highest.position <= member.roles.highest.position) 
        return interaction.followUp('Dany członek mają wyższą lub równą rangę jak ty więc nie mogę ich zbanować.')
        
        const embed = new MessageEmbed()
        .setDescription(`**${member.user.tag}** jest zbanowany z serwera za \`${reason}\``)
        .setColor("RED")
        .setFooter("Ban Member")
        .setTimestamp()

        await member.user.send(`Masz zakaz **\`${interaction.guild.name}\`** za \`${reason}\``).catch(err => {})
        member.ban({ reason })

        return interaction.followUp({ embeds: [ embed ]})

    },
    
};
