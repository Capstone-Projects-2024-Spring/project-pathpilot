import cProfile
import multiprocessing
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

insideURLArray = []
def createURL(zipcode, loType):
    url = f"https://www.yelp.com/search?find_desc={loType}&find_loc=Philadelphia%2C+PA+{zipcode}"
    print(loType)
    #print (url)
    return url

def doRequest(url):
    response = requests.get(url)
    parseResult(response)

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
    for url in insideURLArray: 
        p = multiprocessing.Process(target=insideProcess, args=(url,)) #i dont think we're multiprocessing the right thing
        p.start() 
        processes.append(p) 
    for p in processes: 
        p.join()
            #for item in insideResults:
             #   businessArray.append(item) #add them all to the arrays
#multiprocessing function
def insideProcess(url):
    insideResponse = genInsideURL(url)
    insideResults = parseInsideRequest(insideResponse)
    print(insideResults)
    print()
    



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
        for locationOuter in i.find_all(class_ = "arrange-unit__09f24__rqHTg css-1qn0b6x"):
            for strAddress in locationOuter.find_all(class_ = "raw__09f24__T4Ezm"):
                if(strAddress!= None): #gets street and zip
                    extraInfo.append(strAddress.text)
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
        for attributesTable in i.find_all(class_= "css-ufd2i"):
            attributeArray = []
            for attributesSection in attributesTable.find_all(class_="arrange-unit__09f24__rqHTg css-1qn0b6x"):
                for trait in attributesSection.find_all(class_="arrange-unit__09f24__rqHTg arrange-unit-fill__09f24__CUubG css-1qn0b6x"):
                    if(trait!=None):
                        attribute = trait.text
                        match attribute:
                            case "Not Good For Kids":
                                attributeArray.append(attribute)
                            case "Good For Kids":
                                attributeArray.append(attribute)
                            case "Happy Hour Specials":
                                attributeArray.append(attribute)
                            case "Good for Groups":
                                attributeArray.append(attribute)
                            case "Outdoor Seating":
                                attributeArray.append(attribute)
                            case "No Outdoor Seating":
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
               
            if(attributeArray!=[]):
                informationDict = {
                "information": extraInfo,
                "attributes": attributeArray,
                "hours": hoursArray
            } 
    
    
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
            driver.find_element(By.XPATH, '//*[@id="main-content"]/section[4]/div[2]/button').click();
        except NoSuchElementException:
            print("No extra amenities")
        except ElementNotInteractableException:
            print("we're done")
    
    #
    response = driver.page_source
    return response
    



#url = "https://www.yelp.com/search?find_desc=restaurants&find_loc=Philadelphia%2C+PA+19122"
def main():
    url = createURL(19122, "restaurants")
    numb=0
    doRequest(url)
    numb+=1
        # do something here

if __name__ == '__main__':
   cProfile.run('main()', sort='ncalls')
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