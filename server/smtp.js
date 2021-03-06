'use strict'

const SMTPServer = require('smtp-server').SMTPServer
const smtpMessageToJson = require('./helpers/smtpMessageToJson')
const config = require('../config')

const smtpHost = config.smtp.host

module.exports = params => {
  const onEmail = params.onEmail

  const smtp = new SMTPServer({
    disabledCommands: ['AUTH', 'STARTTLS'],
    name: smtpHost,
    onData: (stream, session, cb) => {
      let message = ''
      stream.on('data', chunk => (message += chunk))
      stream.on('end', () => {
        const email = smtpMessageToJson(message)
        onEmail(email)

        cb()
      })
    }
  })

  return smtp
}
