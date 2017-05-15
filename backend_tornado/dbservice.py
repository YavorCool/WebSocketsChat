from pymongo import MongoClient
from json_keys import *


DB_URI = 'mongodb://localhost:27017/'


class DBService:
    __instance = None

    @staticmethod
    def inst():
        if DBService.__instance is None:
            DBService.__instance = DBService()
        return DBService.__instance

    def __init__(self):
        self.client = MongoClient(DB_URI)
        self.db = self.client.chat_db
        self.users = self.db.users

    def update_user(self, user):
        self.users.update({USER_TOKEN_FIELD: user[USER_TOKEN_FIELD]}, user)

    def insert_user(self, user):
        self.users.insert(user)

    def remove_user(self, token):
        self.users.remove({USER_TOKEN_FIELD: token})

    def get_user(self, token):
        return self.users.find_one({USER_TOKEN_FIELD: token}, {"_id": 0})

    def get_all_users(self):
        users = list()
        for user in self.users.find({}, {"_id": 0}):
            users.append(user)
        return users

    def clear_db(self):
        self.users.remove({}, {"justOne": False})


# Testing
if __name__ == "__main__":

    users = [{
        "token": "sometoken_1",
        "username": "user_1",
        "message_queue": [
            {'sender': "sender_token",
             'text': 'message text'}
        ]
    },

        {
            "token": "sometoken_2",
            "username": "user_2",
            "message_queue": [
                {'sender': "sender_token",
                 'text': 'message text'},
                {'sender': "sender_token",
                 'text': 'message text'}
            ]
        },
    ]

    dbService = DBService.inst()
    dbService.insert_user(users[0])
    dbService.insert_user(users[1])

    print(dbService.get_user('sometoken_1'))
    print(dbService.get_user('sometoken_2'))

    print(dbService.get_all_users())

    dbService.update_user({"token": "sometoken_1",
        "username": "user_1",
        "message_queue": [
            {'sender': "sender_token",
             'text': 'update messageText'},
            {'sender': "sender_token",
             'text': 'and second message'},
        ]})
    print(dbService.get_user('sometoken_1'))

    dbService.remove_user('sometoken_1')
    print(dbService.get_all_users())

    dbService.remove_user('sometoken_2')
    print(dbService.get_all_users())

    dbService.clear_db()





