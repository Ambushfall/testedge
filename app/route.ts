import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

export const dynamic = 'force-dynamic'

export async function GET () {
  const res = {
    _response: new NextResponse(),
    get response (): NextResponse {
      return this._response
    },
    set response (value: NextResponse) {
      this._response = value
    }
  }

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://example.com')
  const div = await page.waitForSelector('body > div')
  if ((await div?.$eval('h1', node => node.innerText)) === 'Example Domain') {
    res.response = NextResponse.json({
      result: await div?.$$eval('p', node => node.map(e => e.innerText))
    })

    await browser.close()
    // await page.screenshot({ path: 'screenshot.png' })
  } else {
    await browser.close()
    res.response = NextResponse.json({
      result: 'failure'
    })
  }

  return res.response
}
