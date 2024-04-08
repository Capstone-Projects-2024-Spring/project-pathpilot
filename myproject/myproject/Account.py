class Account:

    def __init__(self, username, hashedPassword, email, id) -> None:
        """Constructor defining username, hashed password, email, and id of an Account object"""
        self.username = username
        self.hashedPassword = hashedPassword
        self.email = email
        self.id = id

    def getUsername(self):
        """Returns value of username."""
        return self.username

    def setUsername(self,username):
        """Sets username to what is defined."""
        self.username = username
    
    def getHashedPassword(self):
        """Returns value of hashed password."""
        return self.hashedPassword

    def setHashedPassword(self,password):
        """Sets hashed password to what is defined."""
        self.hashedPassword = password

    def getEmail(self):
        """Returns value of email."""
        return self.email

    def setEmail(self,email):
        """Sets email to what is defined."""
        self.email = email
    
    def getId(self):
        """Returns value of id."""
        return self.id

    def setId(self,id):
        """Sets id to what is defined."""
        self.id = id