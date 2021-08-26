import bs4
from lxml import html
import requests
import sys
import re

blog_info = {}
tag = {
    "primary_tag": "",
    "primary_tag_url": ""
}


def scrape(url):
    global tag, blog_info

    resp = requests.get(
        url=url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36"}
    )
    content = str(resp.content, "utf-8")
    tree = html.fromstring(html=content)

    blog_title = tree.xpath(
        '//h1[contains(@class,"dm-contentHero__title")]/text()')[0]
    blog_title = blog_title.replace("|", "-")

    blog_likes = tree.xpath(
        '//span[contains(@id,"dm-contentHero__metadata--likes")]/text()')[0]

    blog_category = tree.xpath(
        './/div[contains(@class,"dm-contentHero__category")]//child::span[contains(@class,"dm-contentHero__category-item")]/text()')[0]

    blog_postdt = tree.xpath(
        '//div[contains(@class,"dm-contentHero__metadata")]/span/text()')[1]
    author = tree.xpath(
        '//div[contains(@class,"dm-author__heading")]/a/text()')[0]

    doc_el = bs4.BeautifulSoup(resp.text, 'xml')
    for el in doc_el.findAll('script'):
        res = re.findall('"([^"]*)"', el.text)
        if "data" in res:
            data_index = res.index("data")
            try:
                primary_tag = res[data_index + 1]
                primary_tag_url = res[data_index + 2]
            except IndexError:
                primary_tag = ""
                primary_tag_url = ""
            tag = {
                "primary_tag": primary_tag,
                "primary_tag_url": primary_tag_url
            }
            break

    blog_info = f'| [{blog_title.strip()}]({url}) | {blog_likes.strip()} | {blog_category} | {blog_postdt.strip()} | {author.strip()} | New | [{tag["primary_tag"]}]({tag["primary_tag_url"]})'

    print(blog_info)
    sys.stdout.flush()


def main():
    url = sys.argv[1]
    scrape(url)


main()
