import telebot

bot = telebot.TeleBot('6599034334:AAEn_o_KMSkHfM2WcKOqnPEumXeQf0KWBYY')

@bot.message_handler(commands=['start'])
def send_welcome(message):
    bot.reply_to(message, "Hello, how can I assist you?")

@bot.message_handler(func=lambda message: True)
def echo_all(message):
    bot.send_message(message.chat.id, "Here's what I think about you:")

    # Send a document
    document_path = r'I:\My Drive\Học Kỳ 1\Giải Tích\Bai Giang Giai Tich 1\c2-3-ung dung tp xac dinh-VKU.pdf'
    with open(document_path, 'rb') as doc:
        bot.send_document(message.chat.id, doc)

    # Send an image
    image_path = r'G:\My Drive\Avatars\fuckyoufb.jpg'
    with open(image_path, 'rb') as img:
        bot.send_photo(message.chat.id, img)

print("Bot is online!")
bot.polling()