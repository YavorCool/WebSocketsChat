class SpriteManager:
    __instance = None

    @staticmethod
    def inst():
        if SpriteManager.__instance == None:
            SpriteManager.__instance = SpriteManager()
        return SpriteManager.__instance

    #single call check
    def __init__(self):
        print("Constructor called!")


a = SpriteManager.inst()
b = SpriteManager.inst()
print(a is b)