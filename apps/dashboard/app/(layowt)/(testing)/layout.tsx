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
    redirect('/404');
  }

  return (
    <div className="h-screen flex justify-center items-center">
      {children}
    </div>
  )
}