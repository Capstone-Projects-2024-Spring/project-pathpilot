import unicodedata
import requests
import json
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
            num+=1
            businessArray=[]
            for h3 in li.find_all("h3"):
                if(h3.text!=None):
                    name = h3.text
                    name = unicodedata.normalize('NFKD', name) #gets rid of html converter issues
                    #name = name.split(' ')[-1] uncomment this line if you want to get rid of the numbers on the restaurant title, will affect nearby cities thing
                    businessArray.append(name)
            if(businessArray == []):
                continue
            for ratingClass in li.find_all(class_="css-gutk1c"):
                if(ratingClass.text != None):
                    rating = ratingClass.text
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
            if businessArray!=[] and businessArray!=['Nearby cities', 'Neighborhoods', 'No Price Found']:
                print(businessArray)
    
    
    
    #businesses = []
    #for item in soup.find_all("h4", class_="css-1qn0b6x"):
     #   name = item.text.strip()
      #  businesses.append(name)
    #else:
    #    print("Failed to fetch data")
    #print(businesses)
    #for restaurant in businesses:
     #   print("Name:", name)
      #  print("-"*50)

#url = "https://www.yelp.com/search?find_desc=restaurants&find_loc=Philadelphia%2C+PA+19122"
url = createURL(19122, "restaurants")
numb=0
doRequest(url)
numb+=1
while(numb<=30 and numb>=1): #cap at 300 to be safe, unlikely beyond that, program just stops when it cant reach site anymore
    val = numb*10
    tempUrl= url + f"&start={val}"
    doRequest(tempUrl)
    numb+=1

#&start=10