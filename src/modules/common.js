

export function messageConcat(data) {
    let message = '';

    for (let i = 0; i < data.length; i += 1) {
      message = message.concat(`**\`${data[i][0]}:\`** \`${data[i][1]}\`\n`);
    }

    return message
}