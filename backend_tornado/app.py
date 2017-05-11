import tornado.ioloop
import tornado.web
import tornado.websocket
from tornado.escape import json_encode
import hashlib
from dbservice import DBService
from json_keys import *
from tornado.options import define, options, parse_command_line
import json

define('port', default=8000, help='run on the given port', type=int)

clients_online = dict()
i = 0

db_service = DBService.inst()


class UsersHandler(tornado.web.RequestHandler):
    def __init__(self, application, request, **kwargs):
        super().__init__(application, request, **kwargs)

    def data_received(self, chunk):
        return

    def get(self):
        print("GET all users")
        self.write(json_encode(db_service.get_all_users()))


class IndexHandler(tornado.web.RequestHandler):
    def data_received(self, chunk):
        pass

    def get(self, *args, **kwargs):
        print('get index')
        print(self.get_cookie(USER_TOKEN_FIELD))
        if not self.get_cookie(USER_TOKEN_FIELD):
            username = 'user_' + db_service.get_all_users().__len__().__str__()
            token = hashlib.sha256(username.encode()).hexdigest()
            user = {
                USER_TOKEN_FIELD: token,
                USER_USERNAME_FIELD: username,
                USER_MESSAGES_LIST: [],
                USER_CHATS_LIST: []
            }
            db_service.insert_user(user)
            self.set_cookie(USER_TOKEN_FIELD, token)
            print("New user: username = {}".format(username))
            self.write("OK")


class ChatsHandler(tornado.web.RequestHandler):
    def __init__(self, application, request, **kwargs):
        super().__init__(application, request, **kwargs)

    def data_received(self, chunk):
        return

    def get(self):
        users_to_chat_with = []
        user = self.get_cookie(USER_TOKEN_FIELD)
        for chat in user[USER_CHATS_LIST]:
            users_to_chat_with.append(db_service.get_user(chat[CHAT_RECIPIENT_TOKEN_FIELD]))
        self.write(json_encode(users_to_chat_with))

    def post(self, *args, **kwargs):
        recipient = self.get_argument(CHAT_RECIPIENT_TOKEN_FIELD, '')
        if recipient:
            sender = db_service.get_user(self.get_cookie(USER_TOKEN_FIELD))
            if sender and {CHAT_RECIPIENT_TOKEN_FIELD: recipient} not in sender[USER_CHATS_LIST]:
                sender[USER_CHATS_LIST].append({CHAT_RECIPIENT_TOKEN_FIELD: recipient})


class WebSocketChatHandler(tornado.websocket.WebSocketHandler):
    def __init__(self, application, request, **kwargs):
        super().__init__(application, request, **kwargs)

    def open(self, *args):
        user = db_service.get_user(self.get_cookie(USER_TOKEN_FIELD))
        if user:
            if user[USER_TOKEN_FIELD] not in clients_online.keys():
                clients_online[user[USER_TOKEN_FIELD]] = self
                for msg in user[USER_MESSAGES_LIST]:
                    self.write_message(json.dumps(msg))

    def on_message(self, message):
        msg = json.loads(message)
        recipient_token = msg[MSG_RECIPIENT_TOKEN_FIELD]

        if recipient_token in clients_online.keys():
            clients_online[msg[MSG_RECIPIENT_TOKEN_FIELD]].write_message(message)
        else:
            recipient = db_service.get_user(recipient_token)

            if recipient:
                recipient[USER_MESSAGES_LIST].append(msg)
                db_service.update_user(recipient)

    def on_close(self):
        del clients_online[self.get_cookie(USER_TOKEN_FIELD)]


app = tornado.web.Application([
    (r'/', IndexHandler),
    (r'/users', UsersHandler),
    (r'/chat', WebSocketChatHandler),
    (r'/chats', ChatsHandler),
])

if __name__ == '__main__':
    parse_command_line()
    app.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
