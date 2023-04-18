import { NextApiRequest, NextApiResponse } from "next";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";

async function loadWebPage(url: string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { timeout: 60000 });
    await page.waitForNavigation({ waitUntil: 'networkidle0' }); // wait for page to finish loading
    const html = await page.content(); // get HTML content of page
    await browser.close();
    return html;
}


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
        const html = await loadWebPage("https://www.zaap.ai/learn/getting-started-on-zaap");

        const response = await cheerio.load(html);

        const htmlString = response.html();

        const bodyString = response("body");

        res.status(200).json({
            html: bodyString,
        });
    }
}

export default handler;