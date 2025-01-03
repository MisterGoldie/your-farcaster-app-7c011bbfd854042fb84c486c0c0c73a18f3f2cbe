import { NextRequest, NextResponse } from "next/server"
import axios from "axios"
import CryptoJS from 'crypto-js'
// Remove the import for validateFarcasterMessage as it's not exported from the module
// import { validateFarcasterMessage } from '@/app/helpers/frames'

//NOTE - you might want to remove the console logs in production

/*
  Handle the POST request, validates the Farcaster message,
  Create an auth link, and respond with the necessary form of metadata
*/

export async function POST(req: NextRequest) {
  const data = await req.json()
  console.log("[launcher route.ts] - Received data:", data)

  try {
    // Validate the trustedData.messageBytes using Neynar API
    console.log("[launcher route.ts] - Attempting to validate Farcaster message")
    const validationResult = await validateFarcasterMessage(data.trustedData.messageBytes)

    if (!validationResult.valid) {
      console.log("[launcher route.ts] - Validation failed")
      return NextResponse.json({ error: 'User validation failed' }, { status: 400 })
    }

    // Once validation is successful, create an auth link 
    // Encrypt the data.trustedData.messageBytes using AES encryption to prevent injection attacks
    var cipheredBytes = CryptoJS.AES.encrypt(data.trustedData.messageBytes, `${process.env.AUTH_ENCRYPTION_KEY}`)?.toString()
    const cleanedBytes = cipheredBytes.replace(/\+/g, 'p1L2u3S').replace(/\//g, 's1L2a3S4h').replace(/=/g, 'e1Q2u3A4l')
    const authLink = `${process.env.NEXT_PUBLIC_URL}/auth/?key=${cleanedBytes}&mini=${true}`

    console.log("[launcher route.ts] - Auth link created:", authLink)

    // Return the success response with the auth link
    console.log("[launcher route.ts] - Returning success response")
    return NextResponse.json({ type: "form", title: `${process.env.NEXT_PUBLIC_APP_NAME}`, url: authLink, }, { status: 200 })

  } catch (error: any) {
    console.error('[launcher route.ts] - Detailed error:', error);
    return NextResponse.json({ 
        type: "form", 
        title: "Error", 
        url: `${process.env.NEXT_PUBLIC_URL}`, 
        error: error.message 
    }, { status: 500 });
  }
}

/*
  Handle the GET request, return metadata about the mini-app
*/
export async function GET(req: NextRequest) {
  console.log('GET request received at /api/launcher');
  try {
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const baseUrl = `${protocol}://${host}`;

    console.log('Request headers:', req.headers);
    console.log('Calculated base URL:', baseUrl);

    console.log('Environment variables:', {
      NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
      NEXT_PUBLIC_APP_DESCRIPTION_SHORT: process.env.NEXT_PUBLIC_APP_DESCRIPTION_SHORT,
      NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL
    });

    const response = {
      type: "composer",
      name: process.env.NEXT_PUBLIC_APP_NAME || 'Default App Name',
      icon: "zap",
      description: process.env.NEXT_PUBLIC_APP_DESCRIPTION_SHORT || 'Default Description',
      aboutUrl: baseUrl,
      imageUrl: `${baseUrl}/imgUrl.png`,
      action: {
        type: "post",
      },
    };

    console.log('Response:', response);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/launcher:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
  Validate the Farcaster message by sending it to the Neynar API
*/
async function validateFarcasterMessage(messageBytes: string) {
  const options = {
    method: "POST",
    url: "https://api.neynar.com/v2/farcaster/frame/validate",
    headers: {
      accept: "application/json",
      api_key: process.env.NEYNAR_API_KEY,
      "content-type": "application/json",
    },
    data: {
      message_bytes_in_hex: messageBytes,
      cast_reaction_context: true,
      follow_context: false,
      signer_context: false,
      channel_follow_context: false,
    },
  }

  const response = await axios.request(options)
  return response.data
}


