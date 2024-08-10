import { redirect } from "next/navigation";

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  // redirect off this page on the production site
  // of on a vercel deployment
  if (
    process.env.NODE_ENV === 'production' ||
    process.env.VERCEL_ENV === 'production'
  ) {
    return {
      redirect: {
        destination: '/404',
        permanent: true
      }
    }
  }

  return (
    <div className="h-screen flex justify-center items-center">
      {children}
    </div>
  )
}