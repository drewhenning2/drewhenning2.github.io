from splinter import Browser
from bs4 import BeautifulSoup
from webdriver_manager.chrome import ChromeDriverManager
import pandas as pd

def scrape_info():
    # Set up Splinter
    executable_path = {'executable_path': ChromeDriverManager().install()}
    browser = Browser('chrome', **executable_path, headless=False)



    # Mars News
    mars_news_url = 'https://redplanetscience.com/'
    browser.visit(mars_news_url)
    mars_news_html = browser.html
    mars_news_soup = BeautifulSoup(mars_news_html, 'html.parser')
    news_title = mars_news_soup.find('div', class_='content_title').text
    paragraph_text = mars_news_soup.find('div', class_='article_teaser_body').text



    # Mars Image
    mars_img_url = 'https://spaceimages-mars.com/'
    browser.visit(mars_img_url)
    mars_img_html = browser.html
    mars_img_soup = BeautifulSoup(mars_img_html, 'html.parser')
    featured_image_url = mars_img_url + mars_img_soup.find('a', class_='showimg fancybox-thumbs')['href']
    print(featured_image_url)
    


    # Mars Facts
    mars_facts_url = 'https://galaxyfacts-mars.com'
    mars_facts = pd.read_html(mars_facts_url)
    mars_facts = pd.read_html(mars_facts_url)[0]
    mars_facts.columns = ['Description', 'Mars', 'Earth']
    mars_facts = mars_facts.set_index('Description')
    mars_table = mars_facts.to_html()
    print(mars_table)
    


    # Mars Hemisphere Titles
    mars_hem_url = 'https://marshemispheres.com/'
    browser.visit(mars_hem_url)
    mars_hem_html = browser.html
    mars_hem_soup = BeautifulSoup(mars_hem_html, 'html.parser')
    title = mars_hem_soup.find_all('div', class_='description')

    titles = []
    for title in title:
        titles.append(title.find('h3').text.strip())
    print(titles)



    # Mars Hemisphere URLs
    hemisphere_urls = []

    # Cerberus url
    cerberus_base_url = 'https://marshemispheres.com/'
    cerberus_url = 'https://marshemispheres.com/cerberus.html'
    browser.visit(cerberus_url)
    cerberus_html = browser.html
    cerberus_soup = BeautifulSoup(cerberus_html, 'html.parser')
    cerberus_img_url = cerberus_base_url + cerberus_soup.find('div', class_='downloads').a['href']
    hemisphere_urls.append(cerberus_img_url)

    # Schiaparelli url
    schiaparelli_base_url = 'https://marshemispheres.com/'
    schiaparelli_url = 'https://marshemispheres.com/schiaparelli.html'
    browser.visit(schiaparelli_url)
    schiaparelli_html = browser.html
    schiaparelli_soup = BeautifulSoup(schiaparelli_html, 'html.parser')
    schiaparelli_img_url = schiaparelli_base_url + schiaparelli_soup.find('div', class_='downloads').a['href']
    hemisphere_urls.append(schiaparelli_img_url)

    # Syrtis url
    syrtis_base_url = 'https://marshemispheres.com/'
    syrtis_url = 'https://marshemispheres.com/syrtis.html'
    browser.visit(syrtis_url)
    syrtis_html = browser.html
    syrtis_soup = BeautifulSoup(syrtis_html, 'html.parser')
    syrtis_img_url = syrtis_base_url + syrtis_soup.find('div', class_='downloads').a['href']
    hemisphere_urls.append(syrtis_img_url)

    # Valles url
    valles_base_url = 'https://marshemispheres.com/'
    valles_url = 'https://marshemispheres.com/valles.html'
    browser.visit(valles_url)
    valles_html = browser.html
    valles_soup = BeautifulSoup(valles_html, 'html.parser')
    valles_img_url = valles_base_url + valles_soup.find('div', class_='downloads').a['href']
    hemisphere_urls.append(valles_img_url)

    # dictionary
    hemisphere_image_urls = [
    {"titles": titles[0], "hemisphere_urls": hemisphere_urls[0]},
    {"titles": titles[1], "hemisphere_urls": hemisphere_urls[1]},
    {"titles": titles[2], "hemisphere_urls": hemisphere_urls[2]},
    {"titles": titles[3], "hemisphere_urls": hemisphere_urls[3]},
    ]



    # store data in a dictionary
    mars_dict = {
        "news_title": news_title,
        "paragraph_text": paragraph_text,
        "featured_image_url": featured_image_url,
        "mars_table": mars_table,
        "hemisphere_image_urls": hemisphere_image_urls,
    }



    # quit the browser after scraping
    browser.quit()



    # return results
    return mars_dict