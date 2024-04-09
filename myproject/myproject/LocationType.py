class LocationType:
    def __init__(self,locationType,id) -> None:
        self.locationType = locationType
        self.id = id

    def getLocationType(self):
        return self.locationType
    
    def getId(self):
        return self.id