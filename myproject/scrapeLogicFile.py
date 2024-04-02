import re
import unicodedata
import requests
import json
from selenium import webdriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import ElementNotInteractableException
from bs4 import BeautifulSoup
def createURL(zipcode, loType):
    url = f"https://www.yelp.com/search?find_desc={loType}&find_loc=Philadelphia%2C+PA+{zipcode}"
    print(loType)
    print (url)
    return url

def doRequest(url):
    
    response = requests.get(url)
    
    parseResult(response)

def parseResult(response): #parse result
    data = BeautifulSoup(response.text, 'html.parser')
    data1 = data.find_all("ul")
    num=0
    for i in data1:
        for li in i.find_all("li"):
            insideURL = ""
            num+=1
            businessArray=[]
            for h3 in li.find_all("h3"):
                if(h3.text!=None):
                    name = h3.text
                    if(h3.find('a')!=None):
                        insideURL= h3.find('a').get('href') #get this business's own URL
                    name = unicodedata.normalize('NFKD', name) #gets rid of html converter issues
                    nameList = name.split(' ')[1:] #uncomment this line if you want to get rid of the numbers on the restaurant title, will affect nearby cities thing
                    name = " ".join(nameList) #put array back together
                    businessArray.append(name)
            if(businessArray == []):
                continue
            for ratingClass in li.find_all(class_="css-gutk1c"):
                if(ratingClass.text != None):
                    rating = ratingClass.text.strip() #get rid of whitespace
                    businessArray.append(rating)
            if(len(businessArray)!= 2):
                businessArray.append("No Rating Found")
            for priceRange in li.find_all(class_="priceRange__09f24__ZgJXy css-blvn7s"):
                if(priceRange.text != None):
                    priceIcon = str(priceRange.text)
                    businessArray.append(priceIcon)
            if(len(businessArray)!= 3):
                businessArray.append("No Price Found")
            #for buzzWordsClass in li.find_all(class_="css-11bijt4"): #everyone should get three please
            #    if(buzzWordsClass.text != None):
             #       buzzWord = str(buzzWordsClass.text)
             #       businessArray.append(buzzWord)
            
            insideResponse = genInsideURL(insideURL)
            insideResults = parseInsideRequest(insideResponse)
            for i in insideResults:
                businessArray.append(i)
            if businessArray!=[] and businessArray[0]!= "cities":
                print(businessArray)
                print()

            #for item in insideResults:
             #   businessArray.append(item) #add them all to the arrays
    
    
    



def parseInsideRequest(response): #returns array of inside info
    data = BeautifulSoup(response, 'html.parser')
    data1 = data.find_all(class_ = "biz-details-page-container-outer__09f24__pZBzx css-1qn0b6x")
    extraInfo = []
    for i in data1:
        for locationOuter in i.find_all(class_ = "arrange-unit__09f24__rqHTg css-1qn0b6x"):
            for strAddress in locationOuter.find_all(class_ = "raw__09f24__T4Ezm"):
                if(strAddress!= None): #gets street and zip
                    extraInfo.append(strAddress.text)
        for hoursOuter in i.find_all(class_ = "arrange-unit__09f24__rqHTg arrange-unit-fill__09f24__CUubG css-1qn0b6x"):
            for table in hoursOuter.find_all(class_="hours-table__09f24__KR8wh css-n604h6"):
               # daysArray=[]
                hoursArray = []
                for row in table.find_all(class_="css-29kerx"):
                    #for day in row.find_all(class_="day-of-the-week__09f24__JJea_ css-ux5mu6"):
                    #    if(day!=None):
                    #        daysArray.append(day.text)
                    for hours in row.find_all(class_="no-wrap__09f24__c3plq css-1p9ibgf"): #working under presumption of Mon-Sun
                        if(hours!=None):
                            hoursArray.append(hours.text) #should come hoursArray and extra Info into one array
               # print(daysArray)
                print(hoursArray)
        #for attributes in i.find_all()
    return extraInfo
            
    #PUT PARSING CODE HERE TO GATHER DATA
    return 



def genInsideURL(insideURL):
    url = f"https://www.yelp.com/{insideURL}"
    driver = webdriver.Chrome()
    driver.get(url)
    driver.implicitly_wait(5)
    try:
        driver.find_element(By.XPATH, '//*[@id="main-content"]/section[3]/div[2]/button').click()
        #WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.XPATH, '//*[@id="main-content"]/section[3]/div[2]/button'))).click()
    except NoSuchElementException:
        try:
            driver.find_element(By.XPATH, '//*[@id="main-content"]/section[4]/div[2]/button').click();
        except NoSuchElementException:
            print("No extra amenities")
        except ElementNotInteractableException:
            print("we're done")
    
    #
    response = driver.page_source
    return response
    



#url = "https://www.yelp.com/search?find_desc=restaurants&find_loc=Philadelphia%2C+PA+19122"
url = createURL(19122, "restaurants")
numb=0
doRequest(url)
numb+=1
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