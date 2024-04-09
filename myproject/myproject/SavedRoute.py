class SavedRoute:
    def __init__(self,zipCode,locations,id) -> None:
        self.zipCode = zipCode
        self.locations = locations
        self.id = id

    def getZipCode(self):
        return self.zipCode
    
    def setZipCode(self,zipCode):
        self.zipCode = zipCode

    def getLocations(self):
        return self.locations
    
    def setLocations(self,locations):
        self.locations =  locations

    def getId(self):
        return self.id
    
    def setId(self,id):
        self.id = id
