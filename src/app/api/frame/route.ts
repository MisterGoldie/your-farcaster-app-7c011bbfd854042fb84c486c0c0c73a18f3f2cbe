import { NextRequest } from 'next/server'
import { validateWithNeynar } from '@/app/helpers/frames'
import puppeteer from 'puppeteer'

export async function GET() {
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setViewport({ width: 600, height: 800 })
    
    await page.goto(`${process.env.NEXT_PUBLIC_URL}/howtoplay`, { waitUntil: 'networkidle0' })
    const screenshot = await page.screenshot({ encoding: 'base64' })
    
    await browser.close()

    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>POD Play</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="data:image/png;base64,${screenshot}" />
          <meta property="fc:frame:button:1" content="Select Game" />
          <meta property="fc:frame:button:1:action" content="post" />
        </head>
      </html>`,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    )
  } catch (error) {
    console.error('Error generating frame:', error)
    return new Response('Error generating frame', { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { trustedData } = body
    
    const validationResult = await validateWithNeynar(trustedData.messageBytes)
    if (!validationResult.valid) {
      return new Response('Invalid frame message', { status: 400 })
    }

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setViewport({ width: 600, height: 800 })
    
    await page.goto(`${process.env.NEXT_PUBLIC_URL}/howtoplay`, { waitUntil: 'networkidle0' })
    const screenshot = await page.screenshot({ encoding: 'base64' })
    
    await browser.close()

    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>POD Play</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="data:image/png;base64,${screenshot}" />
          <meta property="fc:frame:button:1" content="Easy" />
          <meta property="fc:frame:button:2" content="Medium" />
          <meta property="fc:frame:button:3" content="Hard" />
          <meta property="fc:frame:button:4" content="Back" />
          <meta property="fc:frame:button:1:action" content="post" />
          <meta property="fc:frame:button:2:action" content="post" />
          <meta property="fc:frame:button:3:action" content="post" />
          <meta property="fc:frame:button:4:action" content="post" />
        </head>
      </html>`,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    )
  } catch (error) {
    console.error('Error in POST handler:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
