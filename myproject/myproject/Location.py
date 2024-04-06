class Location:
    def __init__(self,name,zipCode,lat,lon,addr,hoursOfOp,review,avgStar,id) -> None:
        self.name = name
        self.zipCode = zipCode
        self.lat = lat
        self.lon = lon
        self.addr = addr
        self.hoursOfOp = hoursOfOp
        self.review = review
        self.avgStar = avgStar
        self.id = id 

    def getName(self):
        return self.name
    
    def getZipCode(self):
        return self.zipCode
    
    def getLatitude(self):
        return self.lat
    
    def getLongitude(self):
        return self.lon
    
    def getAddress(self):
        return self.addr
    
    def getHoursOfOperation(self):
        return self.hoursOfOp
    
    def getAllStarReviews(self):
        return self.review
    
    def getAverageStar(self):
        return self.avgStar
    
    def getId(self):
        return self.id