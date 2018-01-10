const subjectConversationIdRegex = /^.*\[#([0-9A-z]+)\].*$/;

export default class MailParser {
  parse(mail) {
    return {
      SenderEmail: this._findSenderEmail(mail),
      ConversationId: this._findConversationId(mail)
    };
  }

  _findSenderEmail(mail) {
    if (mail === undefined || mail.from === undefined || mail.from.value === undefined || mail.from.value.length === 0) {
      return undefined;
    }
    return mail.from.value[0].address;
  }

  _findConversationId(mail) {
    if (mail === undefined || mail.subject === undefined) return undefined;
    var match = subjectConversationIdRegex.exec(mail.subject);
    if (match.length < 2) {
      return undefined;
    }
    return match[1];
  }
}