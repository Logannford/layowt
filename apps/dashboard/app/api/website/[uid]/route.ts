import { getWebsiteByDomain } from '@/actions/websites/get'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { 
  params 
}: { 
  params: { 
    slug: string 
  } 
}) {
  const { websiteId } = await getWebsiteByDomain(params.slug)

  return NextResponse.json(websiteId)
}