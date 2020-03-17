const TelegramBot = require(`node-telegram-bot-api`)

const dotenv = require('dotenv')
dotenv.config()

const TOKEN = process.env.TELEGRAM_TOKEN

const bot = new TelegramBot(TOKEN, { polling: true })

const axios = require('axios').default

const URL_API = `https://thevirustracker.com/free-api`


bot.onText(/\/rules/, (msg) => {

    bot.sendMessage(msg.chat.id, `Para pegar as informações em todo o mundo, digite '.'. Para um país em específico, digite o código do país.`)

})

bot.onText(/\/corona (.+)/, (msg, match) => {

    const param = match[1]

    if (param != ".") {
        findOne(msg, param)
    } else {
        findAll(msg)
    }
})

findOne = (msg, id) => {
    axios.get(URL_API + `?countryTotal=${id}`)
        .then((res) => {

            const response = res.data.countrydata[0]

            sendMessage(msg, response, response.info.title)
        })
        .catch((err) => {
            sendError(msg, 'Não foi possível atualizar as informações dos países sobre o vírus!')
        })
}

findAll = (msg) => {
    axios.get(URL_API + '?global=stats')
        .then((res) => {
            const result = res.data.results

            sendMessage(msg, result[0])
        })
        .catch((err) => {
            sendError(msg, 'Não foi possível listar os dados desse país!')
        })
}

sendMessage = (chat, response, country = '') => {

    const name = (country) ? country : 'Todos';

    bot.sendMessage(chat.chat.id, `
País: ${name}
Total de casos: ${response.total_cases},
Total de mortes: ${response.total_deaths},
Novos casos hoje: ${response.total_new_cases_today},
Mortes de hoje: ${response.total_new_deaths_today},
Casos ativos: ${response.total_active_cases},
Casos preocupantes: ${response.total_serious_cases}
    `)
}

sendError = (chat, error) => {
    bot.sendMessage(chat.chat.id, error)
}