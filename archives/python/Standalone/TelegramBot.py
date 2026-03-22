import os
import telebot

# Get the Telegram bot token from environment variable
TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
if not TELEGRAM_BOT_TOKEN:
    raise ValueError("Please set the TELEGRAM_BOT_TOKEN environment variable.")

# Get document and image paths from environment variables
DOCUMENT_PATH = os.getenv('TELEGRAM_BOT_DOCUMENT_PATH')
IMAGE_PATH = os.getenv('TELEGRAM_BOT_IMAGE_PATH')

if not DOCUMENT_PATH or not IMAGE_PATH:
    raise ValueError("Please set the TELEGRAM_BOT_DOCUMENT_PATH and TELEGRAM_BOT_IMAGE_PATH environment variables.")

bot = telebot.TeleBot(TELEGRAM_BOT_TOKEN)

@bot.message_handler(commands=['start'])
def send_welcome(message):
    bot.reply_to(message, "Hello, how can I assist you?")

@bot.message_handler(func=lambda message: True)
def echo_all(message):
    bot.send_message(message.chat.id, "Here's what I think about you:")

    # Send a document
    with open(DOCUMENT_PATH, 'rb') as doc:
        bot.send_document(message.chat.id, doc)

    # Send an image
    with open(IMAGE_PATH, 'rb') as img:
        bot.send_photo(message.chat.id, img)

print("Bot is online!")
bot.polling()