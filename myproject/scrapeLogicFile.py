from time import sleep
from random import randint
import cProfile
import logging
import multiprocessing
import re
import unicodedata
import geopy
import requests
import json
import sqlite3
from selenium import webdriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import ElementNotInteractableException
from bs4 import BeautifulSoup
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError

PLACETYPE = "restaurants"
ZIPCODEINPUT = 19147
insideURLArray = []
finalRestaurantList = [None] * 10
#restaurantList = []
def createURL(zipcode, loType):
    url = f"https://www.yelp.com/search?find_desc={loType}&find_loc=Philadelphia%2C+PA+{zipcode}"
    print(loType)
    return url

def doRequest(url): #raise exceptions if request doesn't work and continue to next page
    try:
        response = requests.get(url)
        parseResult(response)
    except requests.exceptions.HTTPError as errh:
        #print ("Http Error:",errh)
        print ("Http Error:")
    except requests.exceptions.ConnectionError as errc:
        #print ("Error Connecting:",errc)
        print ("Error Connecting:")
    except requests.exceptions.Timeout as errt:
        #print ("Timeout Error:",errt)
        print ("Timeout Error:")
    except requests.exceptions.RequestException as err:
        #print ("OOps: Something Else",err)
        print ("OOps: Something Else")

def parseResult(response): #parse result
    data = BeautifulSoup(response.text, 'html.parser')
    data1 = data.find_all("ul")
    for i in data1:
        for li in i.find_all("li"):
            insideURL = ""
            businessArray=[]
            for h3 in li.find_all("h3"):
                if(h3.text!=None):
                    if(h3.find('a')!=None):
                        insideURL= h3.find('a').get('href') 
                        global insideURLArray
                        insideURLArray.append(insideURL) 
                        #get this business's own URL
    #MULTIPROCESSING PART
    processes = [] 
    manager = multiprocessing.Manager()
    restaurantList = manager.dict() #needed to create a shared variable so everyone didnt write on top of each other
    print(insideURLArray)
    for url in insideURLArray: 
        p = multiprocessing.Process(target=insideProcess, args=(url,restaurantList, insideURLArray.index(url))) #i dont think we're multiprocessing the right thing
        p.start() 
        processes.append(p) 
    for p in processes: 
        p.join()
    global finalRestaurantList 
    insideURLArray = [] #clear the array so we dont rerun businneses, only ten at a time
    finalRestaurantList = restaurantList #resets the list

            #for item in insideResults:
             #   businessArray.append(item) #add them all to the arrays
#multiprocessing function
def insideProcess(url, restaurantList, numOrder):
    insideResponse = genInsideURL(url)
    restaurantDict = parseInsideRequest(insideResponse)
    if(len(restaurantDict)!=0):
        restaurantList[numOrder]= restaurantDict.copy() #super list
        print(restaurantDict)
        print()
    #print(len(restaurantList))
    



def parseInsideRequest(response): #returns all information, from business's own page
    informationDict = {}
    data = BeautifulSoup(response, 'html.parser')
    data1 = data.find_all(class_ = "biz-details-page-container-outer__09f24__pZBzx css-1qn0b6x")
    extraInfo = []
    for header in data.find_all(class_="photo-header-content-container__09f24__jDLBB css-1qn0b6x"):
        for name in header.find_all(class_="css-hnttcw"):
            if(name.text!=None):
                name = name.text
                name = unicodedata.normalize('NFKD', name) #gets rid of html converter issues
                extraInfo.append(name)
        for ratingSect in header.find_all(class_="arrange-unit__09f24__rqHTg arrange-unit-fill__09f24__CUubG css-v3nuob"):
            for rating in ratingSect.find_all(class_="css-1fdy0l5"):
                if(rating!=None and rating.text!="Unclaimed "): #idk who had the unclaimed issue so both are here to be safe
                    extraInfo.append(rating.text)
        for price in header.find_all(class_="css-14r9eb"):
            if(price!=None and price.text!="Unclaimed "):
                extraInfo.append(price.text) #search database for $ to find out if its there idk, clean up later
    for i in data1:
        addressArray = []
        for locationOuter in i.find_all(class_ = "arrange-unit__09f24__rqHTg css-1qn0b6x"):
            for strAddress in locationOuter.find_all(class_ = "raw__09f24__T4Ezm"):
                if(strAddress!= None): #gets street and zip
                    addressArray.append(strAddress.text)
        for hoursOuter in i.find_all(class_ = "arrange-unit__09f24__rqHTg arrange-unit-fill__09f24__CUubG css-1qn0b6x"):
            for table in hoursOuter.find_all(class_="hours-table__09f24__KR8wh css-n604h6"):
               # daysArray=[]
                hoursArray = []
                for row in table.find_all(class_="css-29kerx"):
                    for day in row.find_all(class_=["day-of-the-week__09f24__JJea_ css-1p9ibgf", "day-of-the-week__09f24__JJea_ css-ux5mu6"]): #day-of-the-week__09f24__JJea_ css-1p9ibgf
                        if(day!=None):
                            hoursArray.append(day.text)
                    for hours in row.find_all(class_="no-wrap__09f24__c3plq css-1p9ibgf"): #working under presumption of Mon-Sun
                        if(hours.text!=None):
                            hoursArray.append(hours.text) #should come hoursArray and extra Info into one array
               # print(daysArray)
                #print(hoursArray)
        numTraits=0
        for attributesTable in i.find_all(class_= "css-ufd2i"):
            attributeArray = []
            for attributesSection in attributesTable.find_all(class_="arrange-unit__09f24__rqHTg css-1qn0b6x"):
                for trait in attributesSection.find_all(class_="arrange-unit__09f24__rqHTg arrange-unit-fill__09f24__CUubG css-1qn0b6x"):
                    if(trait!=None):
                        numTraits+=1
                        attribute = trait.text
                        #we were skipping ones that had no matching attributes, fix that by putting -1 in everybody
                        if(numTraits==1):
                            attributeArray.append(-1) #add it anyway
                        match attribute:
                            case "Not Good For Kids": #if this is on a park, it means that park is for dogs
                                attributeArray.append(attribute)
                            case "Good For Kids":
                                attributeArray.append(attribute)
                            case "Dogs Allowed": #added for parks
                                attributeArray.append(attribute)
                            case "Happy Hour Specials":
                                attributeArray.append(attribute)
                            case "Good for Groups":
                                attributeArray.append(attribute)
                            case "Outdoor Seating":
                                attributeArray.append(attribute)
                            case "No Outdoor Seating":
                                attributeArray.append(attribute)
                            case "Dairy-Free Options": #added for ice cream shops
                                attributeArray.append(attribute)
                            case "Free Wi-Fi": #added for coffee shops
                                attributeArray.append(attribute)
                            case "Quiet" | "Loud" | "Moderate Noise": #added for coffee shops
                                attributeArray.append(attribute)
                            case attribute if "Classy" in attribute and "Classy" not in attributeArray:
                                attributeArray.append("Classy")
                            case attribute if "Casual" in attribute and "Casual" not in attributeArray:
                                attributeArray.append("Casual")
                            case attribute if "Romantic" in attribute:
                                attributeArray.append("Romantic")
                            case attribute if "Intimate" in attribute and "Romantic" not in attributeArray:
                                attributeArray.append("Romantic")
                            case attribute if "Hipster" in attribute:
                                attributeArray.append("Trendy")
                            case attribute if "Trendy" in attribute and "Trendy" not in attributeArray:
                                attributeArray.append("Trendy")
                            #case attribute if "Estimated Health Score" in attribute:
                            #    attributeArray.append("Trendy")
                            case "Accepts Credit Cards":
                                attributeArray.append(attribute)
                
    
                            
            
            if(attributeArray!=[]):
                informationDict = {
                "information": extraInfo,
                "address": addressArray,
                "attributes": attributeArray,
                "hours": hoursArray
                } 
             
            #start of database
            #locationArray = []
            #for value in informationDict.values():
             #   for item in value:
             #       locationArray.append(item)
            


                
    
    
    #if(attributeArray!=[]):
    #    informationDict[2] = attributeArray
                            

                        
    return informationDict
            
    #PUT PARSING CODE HERE TO GATHER DATA 



def genInsideURL(insideURL):
    url = f"https://www.yelp.com/{insideURL}"
    driver = webdriver.Chrome()
    driver.get(url)
    #driver.implicitly_wait(5) #omitting this line saves 10 seconds on 10 locations
    try:
        driver.find_element(By.XPATH, '//*[@id="main-content"]/section[3]/div[2]/button').click()
        #WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.XPATH, '//*[@id="main-content"]/section[3]/div[2]/button'))).click()
    except NoSuchElementException:
        try: #sometimes the button is in different spots
            driver.find_element(By.XPATH, '//*[@id="main-content"]/section[4]/div[2]/button').click()
        except NoSuchElementException:
            try:
                print("found it")
                driver.find_element(By.XPATH, '//*[@id="main-content"]/section[2]/div[2]/button').click() #book stores for some reason
            except NoSuchElementException:
                print("no button")
            except ElementNotInteractableException:
                print("no clicky")
        except ElementNotInteractableException:
            print("no clicky")
    except ElementNotInteractableException:
            print("no clicky")
    
    response = driver.page_source
    return response



def do_geocode(address,attempt=1, max_attempts=5): #recursive so it keeps trying
    geolocator = Nominatim(user_agent="Geopy Library")
    try:
        return geolocator.geocode(address, timeout=10000) #timeout lets it keep looking
    except GeocoderTimedOut:
        if attempt <= max_attempts:
            return do_geocode(address, attempt=attempt+1)
        raise
        
        #fullAddress = ""
        #for part in i.get("address"): #should return list in address key
        #    fullAddress.append(part)
        #print(fullAddress)
        # do something here

def addtoDatabase(infoDict):
    databaseArray = []
    if(len(infoDict["information"])!=0): # penitentary (if no picture)
        name = infoDict["information"][0]
    else:
        name = -1
    if(len(infoDict["information"])>1): #if there is more than one item there, we will assume its a rating. No rating likely means also no price
        rating = infoDict["information"][1] #catch if the only info is 
    else:
        rating = -1 #set rating to -1 if there isn't one
    if(len(infoDict["information"])==3):
        priceValue = infoDict["information"][2]
    else:
        priceValue = -1
    if(infoDict["address"][0] != -1 and infoDict["address"][1]!= -1):
        if(len(infoDict["address"])==3): #example: ['Philadelphia, PA 19122', 39.9527237, -75.1635262] it's a fake lat and long so we don't want it
            address = infoDict["address"][0]
            latitude = -1
            longitude = -1
        if(len(infoDict["address"])==4):
            address = infoDict["address"][0]  + " " + infoDict["address"][1]
            latitude = infoDict["address"][2]
            longitude = infoDict["address"][3]
        elif(len(infoDict["address"])==5):
            address = infoDict["address"][0]  + " " + infoDict["address"][1] + " " + infoDict["address"][2]
            latitude = infoDict["address"][3]
            longitude = infoDict["address"][4]
        elif(len(infoDict["address"])==6): #example: ['1800 Arch St', 'Fl 2', 'Comcast Technology Center', 'Philadelphia, PA 19103', -1, -1]
            address = infoDict["address"][0]  + " " + infoDict["address"][1] + " " + infoDict["address"][2] + " " + infoDict["address"][3]
            latitude = infoDict["address"][4]
            longitude = infoDict["address"][5]
    else:
        address=-1
        latitude = infoDict["address"][0]
        longitude = infoDict["address"][1]
    if(len(infoDict["attributes"])!=0):
        attributes = infoDict["attributes"] #convert to json when putting it in there
    else:
        attributes = -1
    if(address!=-1):
        zipcode = address[-5:]
    else:
        zipcode = -1
    hours = infoDict["hours"] #convert to json later
    match PLACETYPE: #expand as wanted
        case "restaurants":
            loTypeID = 1
        case "coffee+shops":
            loTypeID = 2
        case "museums":
            loTypeID = 3
        case "book+stores":
            loTypeID = 4
        case "ice+cream":
            loTypeID = 5
        case "playgrounds":
            loTypeID = 6
        case "parks":
            loTypeID = 7
    #databaseArray = ["idk", name, zipcode, latitude, longitude, address, json.dumps(hours), rating, 1, json.dumps(attributes), priceValue]
    #print(databaseArray)
    conn = sqlite3.connect('myproject/db.sqlite3')
    print("opened database successfully")
    cursor = conn.cursor()
    cursor.execute("INSERT OR IGNORE INTO myapi_locationtype (location_type) VALUES (?)", (PLACETYPE,)) #put in the location type thing, ignores duplicates
    
    cursor.execute("SELECT * FROM myapi_location WHERE location_name = ? AND street_address = ?", (name, address,)) #grab the name if its in there already
    existing_row = cursor.fetchone()
    if(existing_row == None): #if it isnt in the database already, add it
        cursor.execute("INSERT INTO myapi_location (location_name, zip_code, latitude, longitude, street_address, hours_of_op, average_star_rating, location_type_id, attributes, cost) VALUES (?,?,?,?,?,?,?,?,?,?)", (name, zipcode, latitude, longitude, address, json.dumps(hours) , rating, loTypeID, json.dumps(attributes), priceValue))
        conn.commit()
        print("Added to database successfully")
    else: #if it is in there, continue on
        print("data already exists in database")
    #structure:
    # (id, location_name, zip_code, latitude, longitude, street_address, hours_of_op, average_star_rating, location_type_id, attributes, cost)
    #just put json() around it within the insert line
    
    conn.close() #is it okay to reopen and clsoe for each readdtion or would it be better to open once before running addToDatabase

#url = "https://www.yelp.com/search?find_desc=restaurants&find_loc=Philadelphia%2C+PA+19122"
def main():
    url = createURL(ZIPCODEINPUT, PLACETYPE)
    #numb=0
    #doRequest(url)
    #numb+=1
    #url = createURL(19122, "restaurants")
    numb=0
    doRequest(url)
    numb+=1
    for key, value in finalRestaurantList.items(): #don't fully get how this works but it works, don't skip first ten!
            address = ', '.join(value['address'])
            print(f"Address for key {key}: {address}")
            adrStuff = do_geocode(address)
            if(adrStuff!=None): #safety check
                latitude = adrStuff.latitude
                longitude = adrStuff.longitude
            else:
                latitude = -1
                longitude = -1
            #add them back into dictionary in list
            value['address'].append(latitude)
            value['address'].append(longitude)
            print(value['address'])
            print("Latitude: " + str(latitude))
            print("Longitude: " + str(longitude))
            addtoDatabase(value)
    print('Here we go')
    numb==9 #remember to delete
    while(numb<=30 and numb>=1): #cap at 300 to be safe, unlikely beyond that, program just stops when it cant reach site anymore
        #change up to number based on needs
        val = numb*10
        tempUrl= url + f"&start={val}"
        doRequest(tempUrl) #each of these is a big guy (outer and 10 inner), so we should add to database after
        print('Here we go')
        geolocator = Nominatim(user_agent="Geopy Library")
        #do this per request run
        for key, value in finalRestaurantList.items(): #don't fully get how this works but it works
            address = ', '.join(value['address'])
            print(f"Address for key {key}: {address}")
            adrStuff = do_geocode(address)
            if(adrStuff!=None): #safety check
                latitude = adrStuff.latitude
                longitude = adrStuff.longitude
            else:
                latitude = -1
                longitude = -1
            #add them back into dictionary in list
            value['address'].append(latitude)
            value['address'].append(longitude)
            print(value['address'])
            print("Latitude: " + str(latitude))
            print("Longitude: " + str(longitude))
            addtoDatabase(value)
        numb+=1
    #print(len(finalRestaurantList)) #YAY
    #print(restaurantList)
    
    #geolocator = Nominatim(user_agent="Geopy Library")
    #for key, value in finalRestaurantList.items(): #don't fully get how this works but it works
    #    address = ', '.join(value['address'])
    #    print(f"Address for key {key}: {address}")
    #    adrStuff = do_geocode(address)
    #    latitude = adrStuff.latitude
    #    longitude = adrStuff.longitude
    #    #add them back into dictionary in list
    #    value['address'].append(latitude)
    #    value['address'].append(longitude)
    #    print(value['address'])
    #    print("Latitude: " + str(latitude))
    #    print("Longitude: " + str(longitude))
    #    addtoDatabase(value) #value is the dictioanry, key is those weird numbers
        #practice this function by adding things to a 

        #put it back into dictionary list here
        #send list item (dict) to go to another function that send it into database
        

if __name__ == '__main__':
   #cProfile.run('main()', sort='ncalls')
    main()
    


#url = createURL(19122, "restaurants")
#numb=0
#doRequest(url)
#numb+=1
#while(numb<=30 and numb>=1): #cap at 300 to be safe, unlikely beyond that, program just stops when it cant reach site anymore
 #   val = numb*10
#    tempUrl= url + f"&start={val}"
#    doRequest(tempUrl)
#    numb+=1
#genInsideURL("Maggie's place")
#&start=10
    


#https://www.yelp.com/biz/barbuzzo-philadelphia?osq=restaurants
#https://www.yelp.com/biz/the-fabric-workshop-and-museum-philadelphia
#https://www.yelp.com/biz/talulas-garden-philadelphia?osq=restaurants
#https://www.yelp.com/biz/suraya-philadelphia-2?osq=restaurants

#url = https://www.yelp.com/biz/PLACENAMEWITHDASHESANDNNOAPOSTROPHES-philadelphia